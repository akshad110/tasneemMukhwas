import { z } from 'zod'
import mongoose from 'mongoose'
import { Order } from '../models/Order.js'
import { Transaction } from '../models/Transaction.js'
import { Product } from '../models/Product.js'
import { ApiError, asyncHandler } from '../utils/asyncHandler.js'
import { userCanAccessOrder } from '../utils/orderAccess.js'
import { verifyRazorpaySignature } from '../services/razorpay.js'
import { canDownloadInvoice } from '../services/invoicePdf.js'
import { Coupon } from '../models/Coupon.js'
import { CouponRedemption } from '../models/CouponRedemption.js'
import { Customer } from '../models/Customer.js'
import { redeemCoupon } from '../services/couponService.js'
import { notifyPaymentReceived, notifyOrderConfirmed } from '../services/notificationService.js'

async function findOrderByRef(ref) {
  return (
    (await Order.findOne({ orderNumber: ref })) ||
    (mongoose.isValidObjectId(ref) ? await Order.findById(ref) : null)
  )
}

export async function decrementOrderStock(items) {
  for (const line of items) {
    await Product.findByIdAndUpdate(line.productId, {
      $inc: { stock: -line.qty, sales: line.qty },
    })
    const p = await Product.findById(line.productId)
    if (p && p.stock <= 0) {
      p.outOfStock = true
      p.stock = 0
      await p.save()
    }
  }
}

const verifySchema = z.object({
  orderNumber: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  email: z.string().email().optional(),
})

function canVerifyOrder(req, order, bodyEmail) {
  if (req.user?.role === 'admin') return true

  const orderEmail = String(order.customerEmail || '').trim().toLowerCase()
  const checkoutEmail = String(bodyEmail || '').trim().toLowerCase()
  const userEmail = req.user ? String(req.user.email || '').trim().toLowerCase() : ''

  if (orderEmail && checkoutEmail && orderEmail === checkoutEmail) return true
  if (orderEmail && userEmail && orderEmail === userEmail) return true

  return false
}

export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const body = verifySchema.parse(req.body)

  const order = await Order.findOne({ orderNumber: body.orderNumber })
  if (!order) throw new ApiError(404, 'Order not found')
  if (order.payment !== 'razorpay') throw new ApiError(400, 'Not a Razorpay order')

  if (!canVerifyOrder(req, order, body.email)) {
    // Razorpay signature verification below is the primary trust gate — if it passes,
    // the payment genuinely completed for this order's Razorpay order id.
    const sigOk = verifyRazorpaySignature({
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      signature: body.razorpay_signature,
    })
    const rzpMatch =
      !order.razorpayOrderId || order.razorpayOrderId === body.razorpay_order_id
    if (!(sigOk && rzpMatch)) {
      throw new ApiError(403, 'Not allowed to verify this order')
    }
  }

  if (order.paymentStatus === 'paid') {
    const txn = await Transaction.findOne({ orderNumber: order.orderNumber })
    return res.json({
      success: true,
      message: 'Payment already verified',
      data: {
        order: order.toPublicJSON(),
        transaction: txn?.toPublicJSON(),
      },
    })
  }

  if (order.razorpayOrderId && order.razorpayOrderId !== body.razorpay_order_id) {
    throw new ApiError(400, 'Razorpay order mismatch')
  }

  const valid = verifyRazorpaySignature({
    orderId: body.razorpay_order_id,
    paymentId: body.razorpay_payment_id,
    signature: body.razorpay_signature,
  })
  if (!valid) throw new ApiError(400, 'Invalid payment signature')

  order.paymentStatus = 'paid'
  order.status = 'processing'
  order.razorpayOrderId = body.razorpay_order_id
  order.razorpayPaymentId = body.razorpay_payment_id
  order.razorpaySignature = body.razorpay_signature
  await order.save()

  const txn = await Transaction.findOne({ orderNumber: order.orderNumber })
  if (txn) {
    txn.status = 'paid'
    txn.razorpayOrderId = body.razorpay_order_id
    txn.razorpayPaymentId = body.razorpay_payment_id
    txn.razorpaySignature = body.razorpay_signature
    await txn.save()
  }

  await decrementOrderStock(
    order.items.map((i) => ({ productId: i.productId, qty: i.qty })),
  )

  if (order.couponCode && order.discountAmount > 0) {
    const existing = await CouponRedemption.findOne({ orderNumber: order.orderNumber })
    if (!existing) {
      const coupon = await Coupon.findOne({ code: order.couponCode })
      if (coupon) {
        await redeemCoupon({
          coupon,
          email: order.customerEmail,
          userId: req.user?._id,
          orderNumber: order.orderNumber,
          discountAmount: order.discountAmount,
        })
      }
    }
  }

  const customer = order.customer ? await Customer.findById(order.customer) : null
  const userId = customer?.user || req.user?._id

  void notifyPaymentReceived({
    order: {
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      total: order.total,
    },
    userId,
  }).catch((err) => console.error('[notify] payment received', err))

  void notifyOrderConfirmed({
    order,
    transaction: txn,
    userId,
    paymentLabel: 'Paid via Razorpay',
  }).catch((err) => console.error('[notify] order confirmed', err))

  return res.json({
    success: true,
    message: 'Payment verified successfully',
    data: {
      order: order.toPublicJSON(),
      transaction: txn?.toPublicJSON(),
    },
  })
})

const cancelSchema = z.object({
  orderNumber: z.string().min(1),
})

export const cancelRazorpayPayment = asyncHandler(async (req, res) => {
  const body = cancelSchema.parse(req.body)
  const order = await Order.findOne({ orderNumber: body.orderNumber })
  if (!order) throw new ApiError(404, 'Order not found')
  if (order.payment !== 'razorpay') throw new ApiError(400, 'Not a Razorpay order')
  if (order.paymentStatus === 'paid') throw new ApiError(400, 'Order already paid')

  order.status = 'cancelled'
  order.paymentStatus = 'failed'
  await order.save()

  await Transaction.findOneAndUpdate(
    { orderNumber: order.orderNumber },
    { status: 'failed' },
  )

  return res.json({
    success: true,
    message: 'Payment cancelled',
    data: { order: order.toPublicJSON() },
  })
})

export const downloadOrderInvoice = asyncHandler(async (req, res) => {
  const order = await findOrderByRef(req.params.id)
  if (!order) throw new ApiError(404, 'Order not found')

  if (!(await userCanAccessOrder(req, order))) {
    throw new ApiError(403, 'Not allowed to download this invoice')
  }

  const txn = await Transaction.findOne({ orderNumber: order.orderNumber })
  if (!txn) throw new ApiError(404, 'Invoice not found')

  const { buildInvoicePdf, invoiceFilename } = await import('../services/invoicePdf.js')
  if (!canDownloadInvoice(order, txn)) {
    throw new ApiError(400, 'Invoice is not available for this order yet')
  }

  const pdf = await buildInvoicePdf({ order, transaction: txn })
  const filename = invoiceFilename(order.orderNumber, txn.invoice)

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.setHeader('Cache-Control', 'no-store')
  res.send(pdf)
})
