import crypto from 'crypto'
import { Coupon } from '../models/Coupon.js'
import { CouponRedemption } from '../models/CouponRedemption.js'
import { ApiError } from '../utils/asyncHandler.js'

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateCouponCode(length = 6) {
  let code = ''
  const bytes = crypto.randomBytes(length)
  for (let i = 0; i < length; i++) {
    code += CODE_CHARS[bytes[i] % CODE_CHARS.length]
  }
  return code
}

export async function ensureUniqueCode() {
  for (let attempt = 0; attempt < 12; attempt++) {
    const code = generateCouponCode()
    const exists = await Coupon.findOne({ code })
    if (!exists) return code
  }
  throw new ApiError(500, 'Could not generate unique coupon code')
}

function isExpired(coupon) {
  return new Date(coupon.expiresAt).getTime() < Date.now()
}

function normalizeCode(code) {
  return String(code || '').trim().toUpperCase()
}

export function computeDiscountAmount(coupon, subtotal) {
  if (subtotal <= 0) return 0

  let amount = 0
  if (coupon.discountType === 'percent') {
    amount = Math.round((subtotal * coupon.value) / 100)
    if (coupon.maxDiscountAmount > 0) {
      amount = Math.min(amount, coupon.maxDiscountAmount)
    }
  } else {
    amount = Math.min(coupon.value, subtotal)
  }

  return Math.max(0, amount)
}

function cartMatchesScope(coupon, lineItems, productsById) {
  if (coupon.scope === 'global') return true

  if (coupon.scope === 'product') {
    return lineItems.some((line) => line.productId === coupon.productId)
  }

  if (coupon.scope === 'category') {
    return lineItems.some((line) => {
      const p = productsById.get(line.productId)
      return p && String(p.category).toLowerCase() === String(coupon.category).toLowerCase()
    })
  }

  return false
}

export async function validateCouponForCheckout({
  code,
  email,
  userId,
  subtotal,
  lineItems,
  productsById,
}) {
  const normalized = normalizeCode(code)
  if (!normalized) throw new ApiError(400, 'Enter a coupon code')

  const coupon = await Coupon.findOne({ code: normalized, isActive: true })
  if (!coupon) throw new ApiError(400, 'Invalid or expired coupon code')
  if (isExpired(coupon)) throw new ApiError(400, 'This coupon has expired')
  if (coupon.scope !== 'global' && !coupon.code) {
    throw new ApiError(400, 'This discount is applied automatically — no code needed')
  }

  if (coupon.minOrderValue > 0 && subtotal < coupon.minOrderValue) {
    throw new ApiError(400, `Minimum order value is ₹${coupon.minOrderValue}`)
  }

  if (!cartMatchesScope(coupon, lineItems, productsById)) {
    throw new ApiError(400, 'This coupon does not apply to items in your cart')
  }

  if (coupon.maxRedemptions > 0 && coupon.redemptionCount >= coupon.maxRedemptions) {
    throw new ApiError(400, 'This coupon has reached its usage limit')
  }

  const priorUses = await CouponRedemption.countDocuments({
    coupon: coupon._id,
    email: String(email).toLowerCase(),
  })
  if (priorUses >= coupon.maxRedemptionsPerUser) {
    throw new ApiError(400, 'You have already used this coupon')
  }

  const discountAmount = computeDiscountAmount(coupon, subtotal)

  return {
    coupon,
    discountAmount,
    code: normalized,
    label:
      coupon.discountType === 'percent'
        ? `${coupon.value}% off`
        : `₹${coupon.value} off`,
  }
}

export async function redeemCoupon({ coupon, email, userId, orderNumber, discountAmount }) {
  await CouponRedemption.create({
    coupon: coupon._id,
    code: coupon.code,
    user: userId,
    email: String(email).toLowerCase(),
    orderNumber,
    discountAmount,
  })

  coupon.redemptionCount += 1
  await coupon.save()
}

export async function getActiveAutoApplyRules() {
  const now = new Date()
  return Coupon.find({
    isActive: true,
    autoApply: true,
    expiresAt: { $gt: now },
    scope: { $in: ['product', 'category'] },
  }).lean()
}

export function promoForProduct(product, rules) {
  const pid = product._id?.toString?.() || product.id
  const category = product.category

  const productRule = rules.find((r) => r.scope === 'product' && r.productId === pid)
  if (productRule) return formatPromo(productRule)

  const catRule = rules.find(
    (r) =>
      r.scope === 'category' &&
      String(r.category).toLowerCase() === String(category).toLowerCase(),
  )
  if (catRule) return formatPromo(catRule)

  return null
}

function formatPromo(rule) {
  return {
    title: rule.title,
    discountType: rule.discountType,
    value: rule.value,
    label: rule.discountType === 'percent' ? `${rule.value}% off` : `₹${rule.value} off`,
    expiresAt: rule.expiresAt,
  }
}

export function applyPromoToPrice(basePrice, promo) {
  if (!promo || basePrice <= 0) return basePrice
  if (promo.discountType === 'percent') {
    return Math.max(0, Math.round(basePrice - (basePrice * promo.value) / 100))
  }
  return Math.max(0, basePrice - promo.value)
}
