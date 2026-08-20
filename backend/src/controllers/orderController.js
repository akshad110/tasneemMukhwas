import { z } from 'zod'
import mongoose from 'mongoose'
import { Product } from '../models/Product.js'
import { Customer } from '../models/Customer.js'
import { Order } from '../models/Order.js'
import { Transaction } from '../models/Transaction.js'
import { env } from '../config/env.js'
import { ApiError, asyncHandler, sendSuccess } from '../utils/asyncHandler.js'
import { decrementOrderStock } from './paymentController.js'
import { getRazorpay, isRazorpayConfigured, toPaise } from '../services/razorpay.js'
import { canDownloadInvoice } from '../services/invoicePdf.js'
import { validateCouponForCheckout, redeemCoupon } from '../services/couponService.js'
import { notifyOrderPlaced, notifyOrderStatusChange } from '../services/notificationService.js'
import { nextOrderNumber, nextTxnNumber } from '../services/orderNumbers.js'

const FLOW = ['pending', 'processing', 'shipped', 'completed']

export const createOrderSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7).max(40),
  address: z.string().trim().min(3).max(300),
  city: z.string().trim().min(2).max(80),
  country: z.string().trim().min(2).max(80).default('India'),
  postal: z.string().trim().min(3).max(20),
  payment: z.enum(['cod', 'razorpay']),
  deliveryFee: z.number().min(0).optional().default(49),
  couponCode: z.string().trim().max(12).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().optional().default('default'),
        qty: z.number().int().min(1).max(99),
      }),
    )
    .min(1),
})

function sellPrice(p) {
  if (p.showDiscountedPrice && p.discountedPrice > 0) return p.discountedPrice
  return p.price
}

export const listOrders = asyncHandler(async (req, res) => {
  const { status, q } = req.query
  const filter = {}
  if (status && status !== 'all') filter.status = status
  if (q) {
    filter.$or = [
      { orderNumber: new RegExp(String(q), 'i') },
      { customerName: new RegExp(String(q), 'i') },
      { customerEmail: new RegExp(String(q), 'i') },
    ]
  }

  const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(200)
  return sendSuccess(res, {
    data: {
      items: orders.map((o) => o.toPublicJSON()),
      counts: await Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]).then((rows) =>
        rows.reduce((acc, r) => {
          acc[r._id] = r.count
          return acc
        }, {}),
      ),
    },
  })
})

/** GET /orders/mine — orders for the logged-in customer */
export const listMyOrders = asyncHandler(async (req, res) => {
  const email = String(req.user.email || '').toLowerCase()
  const customer = await Customer.findOne({
    $or: [{ email }, { user: req.user._id }],
  })

  const filter = customer
    ? { $or: [{ customerEmail: email }, { customer: customer._id }] }
    : { customerEmail: email }

  const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(100)

  const orderNumbers = orders.map((o) => o.orderNumber)
  const txns = await Transaction.find({ orderNumber: { $in: orderNumbers } })
  const txnByOrder = new Map(txns.map((t) => [t.orderNumber, t]))

  const { Review } = await import('../models/Review.js')
  const orderIds = orders.map((o) => o._id)
  const myReviews = await Review.find({
    user: req.user._id,
    order: { $in: orderIds },
  })
  const reviewedKey = new Set(myReviews.map((r) => `${r.orderNumber}::${r.productId}`))

  return sendSuccess(res, {
    data: {
      items: orders.map((o) => {
        const json = o.toPublicJSON()
        const txn = txnByOrder.get(o.orderNumber)
        const lineItems = (o.items || []).map((item) => {
          const plain = typeof item.toObject === 'function' ? item.toObject() : { ...item }
          return {
            ...plain,
            reviewed: reviewedKey.has(`${o.orderNumber}::${item.productId}`),
          }
        })
        return {
          ...json,
          lineItems,
          invoice: txn?.invoice,
          invoiceAvailable: txn ? canDownloadInvoice(o, txn) : false,
          transactionStatus: txn?.status,
        }
      }),
      reviews: myReviews.map((r) => r.toPublicJSON()),
    },
  })
})

export const getOrder = asyncHandler(async (req, res) => {
  const order =
    (await Order.findOne({ orderNumber: req.params.id })) ||
    (mongoose.isValidObjectId(req.params.id) ? await Order.findById(req.params.id) : null)
  if (!order) throw new ApiError(404, 'Order not found')
  return sendSuccess(res, { data: order.toPublicJSON() })
})

export const createOrder = asyncHandler(async (req, res) => {
  const body = req.body
  const productIds = body.items.map((i) => i.productId)
  const products = await Product.find({ _id: { $in: productIds }, isActive: true })
  const byId = new Map(products.map((p) => [p._id.toString(), p]))

  const lineItems = []
  let subtotal = 0
  let itemCount = 0

  for (const line of body.items) {
    const product = byId.get(line.productId)
    if (!product) throw new ApiError(400, `Product not found: ${line.productId}`)
    if (product.outOfStock || product.stock <= 0) {
      throw new ApiError(400, `${product.name} is out of stock`)
    }
    if (product.stock < line.qty) {
      throw new ApiError(400, `Insufficient stock for ${product.name}`)
    }

    const variant =
      product.variants.find((v) => v.id === line.variantId) || product.variants[0] || {
        id: 'default',
        label: 'Default',
        image: product.image,
      }

    const unitPrice = sellPrice(product)
    const lineTotal = unitPrice * line.qty
    subtotal += lineTotal
    itemCount += line.qty

    lineItems.push({
      product: product._id,
      productId: product._id.toString(),
      name: product.name,
      variantId: variant.id,
      variantLabel: variant.label,
      image: variant.image || product.image,
      qty: line.qty,
      unitPrice,
      lineTotal,
    })
  }

  const deliveryFee = body.deliveryFee ?? 49
  let discountAmount = 0
  let couponCode = ''
  let appliedCoupon = null

  if (body.couponCode) {
    const validation = await validateCouponForCheckout({
      code: body.couponCode,
      email: body.email.toLowerCase(),
      userId: req.user?._id,
      subtotal,
      lineItems: body.items,
      productsById: byId,
    })
    discountAmount = validation.discountAmount
    couponCode = validation.code
    appliedCoupon = validation.coupon
  }

  const total = Math.max(0, subtotal - discountAmount + deliveryFee)
  const customerName = `${body.firstName} ${body.lastName}`.trim()
  const today = new Date().toISOString().slice(0, 10)

  let customer = await Customer.findOne({ email: body.email.toLowerCase() })
  if (!customer) {
    customer = await Customer.create({
      name: customerName,
      email: body.email.toLowerCase(),
      phone: body.phone,
      city: body.city,
      orders: 0,
      spent: 0,
      lastActive: today,
      status: 'active',
      interactions: [],
      user: req.user?._id,
    })
  }

  customer.name = customerName
  customer.phone = body.phone
  customer.city = body.city
  customer.lastActive = today
  customer.status = 'active'
  if (req.user?._id && !customer.user) customer.user = req.user._id
  customer.orders += 1
  customer.spent += total
  customer.interactions.unshift({
    date: today,
    type: 'Order',
    detail: `Placed order · ₹${total}`,
  })
  customer.interactions = customer.interactions.slice(0, 20)
  await customer.save()

  const orderNumber = await nextOrderNumber()
  const isRazorpay = body.payment === 'razorpay'

  if (isRazorpay && !isRazorpayConfigured()) {
    throw new ApiError(503, 'Online payment is not configured. Please choose Cash on Delivery.')
  }

  let order
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const candidate =
      attempt === 0 ? orderNumber : await nextOrderNumber()
    try {
      order = await Order.create({
        orderNumber: candidate,
        customer: customer._id,
        customerName,
        customerEmail: body.email.toLowerCase(),
        customerPhone: body.phone,
        address: body.address,
        city: body.city,
        country: body.country,
        postal: body.postal,
        items: lineItems,
        itemCount,
        subtotal,
        deliveryFee,
        discountAmount,
        couponCode,
        total,
        status: 'pending',
        payment: body.payment,
        paymentStatus: isRazorpay ? 'pending' : 'pending',
      })
      break
    } catch (err) {
      if (err?.code === 11000 && err?.keyPattern?.orderNumber && attempt < 2) continue
      throw err
    }
  }
  if (!order) throw new ApiError(500, 'Could not create order')

  if (!isRazorpay) {
    await decrementOrderStock(body.items)
    if (appliedCoupon && discountAmount > 0) {
      await redeemCoupon({
        coupon: appliedCoupon,
        email: body.email.toLowerCase(),
        userId: req.user?._id,
        orderNumber: order.orderNumber,
        discountAmount,
      })
    }
  }

  const txnNumber = await nextTxnNumber()
  const invoice = `INV-${new Date().getFullYear()}-${order.orderNumber.replace('TM-', '')}`
  const txnStatus = isRazorpay ? 'pending' : 'pending'

  const txn = await Transaction.create({
    txnNumber,
    order: order._id,
    orderNumber: order.orderNumber,
    customerName,
    customerEmail: body.email.toLowerCase(),
    amount: total,
    method: body.payment,
    status: txnStatus,
    invoice,
  })

  void notifyOrderPlaced({
    order: order.toObject ? order.toObject() : order,
    paymentMethod: body.payment,
    userId: req.user?._id,
    orderDoc: order,
    transaction: txn,
  }).catch((err) => console.error('[notify] order placed', err))

  let razorpayCheckout = null

  if (isRazorpay) {
    const rzp = getRazorpay()
    const rzpOrder = await rzp.orders.create({
      amount: toPaise(total),
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderNumber: order.orderNumber,
        customerEmail: body.email.toLowerCase(),
      },
    })

    order.razorpayOrderId = rzpOrder.id
    await order.save()
    txn.razorpayOrderId = rzpOrder.id
    await txn.save()

    razorpayCheckout = {
      keyId: env.razorpayKeyId,
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      name: 'Tasneem Mukhwas',
      description: `Order ${order.orderNumber}`,
      prefill: {
        name: customerName,
        email: body.email.toLowerCase(),
        contact: body.phone,
      },
    }
  }

  return sendSuccess(res, {
    status: 201,
    message: isRazorpay ? 'Order created — complete payment to confirm' : 'Order placed successfully',
    data: {
      order: order.toPublicJSON(),
      transaction: txn.toPublicJSON(),
      razorpay: razorpayCheckout,
    },
  })
})

export const advanceOrderStatus = asyncHandler(async (req, res) => {
  const order =
    (await Order.findOne({ orderNumber: req.params.id })) ||
    (mongoose.isValidObjectId(req.params.id) ? await Order.findById(req.params.id) : null)
  if (!order) throw new ApiError(404, 'Order not found')
  if (order.status === 'cancelled') throw new ApiError(400, 'Cancelled orders cannot be advanced')
  if (order.status === 'completed') throw new ApiError(400, 'Order already completed')

  const i = FLOW.indexOf(order.status)
  if (i < 0 || i >= FLOW.length - 1) throw new ApiError(400, 'Cannot advance status')

  order.status = FLOW[i + 1]
  if (order.status === 'shipped' && !order.tracking) {
    order.tracking = `INPOST${Math.floor(88000 + Math.random() * 900)}`
  }
  await order.save()

  const customer = order.customer ? await Customer.findById(order.customer) : null
  void notifyOrderStatusChange({
    order,
    userId: customer?.user,
    newStatus: order.status,
  }).catch((err) => console.error('[notify] status change', err))

  if (order.status === 'completed') {
    await Transaction.findOneAndUpdate(
      { orderNumber: order.orderNumber, status: 'pending' },
      { status: 'paid' },
    )
    if (order.payment === 'cod') {
      order.paymentStatus = 'paid'
      await order.save()
    }
  }

  return sendSuccess(res, {
    message: 'Order status updated',
    data: order.toPublicJSON(),
  })
})

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const schema = z.object({
    status: z.enum(['pending', 'processing', 'shipped', 'completed', 'cancelled']),
    tracking: z.string().optional(),
  })
  const body = schema.parse(req.body)

  const order =
    (await Order.findOne({ orderNumber: req.params.id })) ||
    (mongoose.isValidObjectId(req.params.id) ? await Order.findById(req.params.id) : null)
  if (!order) throw new ApiError(404, 'Order not found')

  order.status = body.status
  if (body.tracking != null) order.tracking = body.tracking
  if (body.status === 'shipped' && !order.tracking) {
    order.tracking = `INPOST${Math.floor(88000 + Math.random() * 900)}`
  }
  await order.save()

  return sendSuccess(res, {
    message: 'Order updated',
    data: order.toPublicJSON(),
  })
})
