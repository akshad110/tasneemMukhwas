import { z } from 'zod'
import { Coupon } from '../models/Coupon.js'
import { ApiError, asyncHandler, sendSuccess } from '../utils/asyncHandler.js'
import {
  computeDiscountAmount,
  ensureUniqueCode,
  generateCouponCode,
  validateCouponForCheckout,
} from '../services/couponService.js'
import { notifyProductDiscountCreated } from '../services/notificationService.js'
import { Product } from '../models/Product.js'

const couponBodySchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(500).optional().default(''),
  scope: z.enum(['global', 'product', 'category']),
  productId: z.string().optional().default(''),
  category: z.string().optional().default(''),
  discountType: z.enum(['percent', 'fixed']),
  value: z.number().min(0),
  expiresAt: z.string().min(1),
  maxRedemptions: z.number().int().min(0).optional().default(0),
  maxRedemptionsPerUser: z.number().int().min(1).optional().default(1),
  minOrderValue: z.number().min(0).optional().default(0),
  maxDiscountAmount: z.number().min(0).optional().default(0),
  autoApply: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  code: z.string().trim().max(12).optional(),
})

export const listCoupons = asyncHandler(async (_req, res) => {
  const items = await Coupon.find().sort({ createdAt: -1 }).limit(200)
  return sendSuccess(res, { data: { items: items.map((c) => c.toPublicJSON()) } })
})

export const createCoupon = asyncHandler(async (req, res) => {
  const body = couponBodySchema.parse(req.body)

  if (body.scope === 'global') {
    body.autoApply = false
    body.code = body.code?.trim() ? body.code.toUpperCase() : await ensureUniqueCode()
  } else {
    body.code = body.code?.trim() ? body.code.toUpperCase() : ''
    if (!body.autoApply && !body.code) {
      throw new ApiError(400, 'Product/category discounts need auto-apply or a code')
    }
    if (body.scope === 'product' && !body.productId) {
      throw new ApiError(400, 'Product ID is required for product scope')
    }
    if (body.scope === 'category' && !body.category) {
      throw new ApiError(400, 'Category is required for category scope')
    }
  }

  if (body.discountType === 'percent' && body.value > 100) {
    throw new ApiError(400, 'Percent discount cannot exceed 100')
  }

  const coupon = await Coupon.create({
    ...body,
    expiresAt: new Date(body.expiresAt),
    createdBy: req.user._id,
  })

  if (coupon.scope === 'product' || coupon.scope === 'category') {
    let productName = ''
    let productImage = ''
    if (coupon.scope === 'product' && coupon.productId) {
      const product = await Product.findById(coupon.productId).select('name image').lean()
      productName = product?.name || ''
      productImage = product?.image || ''
    }
    void notifyProductDiscountCreated({ coupon, productName, productImage }).catch((err) =>
      console.error('[notify] product discount', err),
    )
  }

  return sendSuccess(res, {
    status: 201,
    message: 'Discount created',
    data: coupon.toPublicJSON(),
  })
})

export const updateCoupon = asyncHandler(async (req, res) => {
  const body = couponBodySchema.partial().parse(req.body)
  const coupon = await Coupon.findById(req.params.id)
  if (!coupon) throw new ApiError(404, 'Discount not found')

  if (body.expiresAt) body.expiresAt = new Date(body.expiresAt)
  if (body.code) body.code = body.code.toUpperCase()

  Object.assign(coupon, body)
  await coupon.save()

  return sendSuccess(res, { message: 'Discount updated', data: coupon.toPublicJSON() })
})

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id)
  if (!coupon) throw new ApiError(404, 'Discount not found')
  return sendSuccess(res, { message: 'Discount removed' })
})

export const regenerateCouponCode = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id)
  if (!coupon) throw new ApiError(404, 'Discount not found')
  if (coupon.scope !== 'global') throw new ApiError(400, 'Only global coupons use codes')

  coupon.code = await ensureUniqueCode()
  await coupon.save()

  return sendSuccess(res, { message: 'New code generated', data: coupon.toPublicJSON() })
})

const validateSchema = z.object({
  code: z.string().min(1),
  email: z.string().email(),
  subtotal: z.number().min(0),
  items: z.array(
    z.object({
      productId: z.string(),
      qty: z.number().int().min(1),
    }),
  ),
})

export const validateCoupon = asyncHandler(async (req, res) => {
  const body = validateSchema.parse(req.body)
  const { Product } = await import('../models/Product.js')
  const productIds = body.items.map((i) => i.productId)
  const products = await Product.find({ _id: { $in: productIds } })
  const byId = new Map(products.map((p) => [p._id.toString(), p]))

  const result = await validateCouponForCheckout({
    code: body.code,
    email: body.email,
    userId: req.user?._id,
    subtotal: body.subtotal,
    lineItems: body.items,
    productsById: byId,
  })

  return sendSuccess(res, {
    data: {
      code: result.code,
      discountAmount: result.discountAmount,
      label: result.label,
      title: result.coupon.title,
      newTotal: Math.max(0, body.subtotal - result.discountAmount),
    },
  })
})

export const listActivePromos = asyncHandler(async (_req, res) => {
  const { getActiveAutoApplyRules } = await import('../services/couponService.js')
  const { Product } = await import('../models/Product.js')
  const rules = await getActiveAutoApplyRules()
  const productIds = rules.filter((r) => r.productId).map((r) => r.productId)
  const products = productIds.length
    ? await Product.find({ _id: { $in: productIds } }).select('name image').lean()
    : []
  const productById = new Map(products.map((p) => [p._id.toString(), p]))

  return sendSuccess(res, {
    data: {
      items: rules.map((r) => {
        const product = r.productId ? productById.get(String(r.productId)) : null
        return {
          id: r._id.toString(),
          scope: r.scope,
          productId: r.productId || undefined,
          category: r.category || undefined,
          discountType: r.discountType,
          value: r.value,
          title: r.title,
          label: r.discountType === 'percent' ? `${r.value}% off` : `₹${r.value} off`,
          expiresAt: r.expiresAt,
          productName: product?.name,
          productImage: product?.image,
        }
      }),
    },
  })
})
