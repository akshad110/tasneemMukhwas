import { z } from 'zod'
import mongoose from 'mongoose'
import { Review } from '../models/Review.js'
import { Order } from '../models/Order.js'
import { Product } from '../models/Product.js'
import { ApiError, asyncHandler, sendSuccess } from '../utils/asyncHandler.js'

async function refreshProductRating(productId) {
  const rows = await Review.aggregate([
    { $match: { productId: String(productId), status: 'approved' } },
    { $group: { _id: '$productId', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ])
  const stats = rows[0]
  const rating = stats ? Math.round(stats.avg * 10) / 10 : 5
  const reviews = stats ? stats.count : 0
  await Product.findByIdAndUpdate(productId, { $set: { rating, reviews } })
  return { rating, reviews }
}

export const createReviewSchema = z.object({
  orderId: z.string().min(1),
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).optional().default(''),
})

/** POST /reviews — authenticated customer review for a completed-order product */
export const createReview = asyncHandler(async (req, res) => {
  const body = req.body
  const userId = req.user._id
  const email = String(req.user.email || '').toLowerCase()

  const order =
    (await Order.findOne({ orderNumber: body.orderId })) ||
    (mongoose.isValidObjectId(body.orderId) ? await Order.findById(body.orderId) : null)

  if (!order) throw new ApiError(404, 'Order not found')
  if (order.status !== 'completed') {
    throw new ApiError(400, 'You can only review products from completed orders')
  }

  const ownsOrder =
    order.customerEmail === email ||
    (await (async () => {
      const { Customer } = await import('../models/Customer.js')
      const customer = await Customer.findById(order.customer)
      return customer?.user?.toString() === userId.toString()
    })())

  if (!ownsOrder) throw new ApiError(403, 'This order does not belong to you')

  const line = order.items.find((i) => i.productId === body.productId)
  if (!line) throw new ApiError(400, 'Product was not part of this order')

  const existing = await Review.findOne({
    user: userId,
    order: order._id,
    productId: body.productId,
  })
  if (existing) throw new ApiError(409, 'You already reviewed this product for this order')

  const product = await Product.findById(body.productId)
  if (!product) throw new ApiError(404, 'Product not found')

  const review = await Review.create({
    user: userId,
    product: product._id,
    productId: body.productId,
    productName: line.name || product.name,
    order: order._id,
    orderNumber: order.orderNumber,
    rating: body.rating,
    comment: body.comment || '',
    status: 'pending',
  })

  const stats = await refreshProductRating(body.productId)

  return sendSuccess(res, {
    status: 201,
    message: 'Review submitted',
    data: {
      review: review.toPublicJSON(),
      productRating: stats.rating,
      productReviews: stats.reviews,
    },
  })
})

/** GET /reviews/testimonials — public marquee feed (approved only) */
export const listTestimonials = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 24, 1), 50)

  const items = await Review.find({ status: 'approved' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name email')

  const mapped = items.map((r) => {
    const name = r.user?.name?.trim() || 'Happy Customer'
    const product = r.productName?.trim()
    return {
      id: r._id.toString(),
      text:
        r.comment?.trim() ||
        (product
          ? `Rated ${r.rating} stars for ${product}. A favourite in our household!`
          : `Rated ${r.rating} out of 5 — wonderful quality and taste.`),
      rating: r.rating,
      productName: product || '',
      author: {
        name,
        handle: product || 'Verified buyer',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=b8860b&color=f3e6c8&size=128&bold=true`,
      },
    }
  })

  return sendSuccess(res, { data: { items: mapped } })
})

export const updateReviewStatusSchema = z.object({
  status: z.enum(['approved', 'ignored', 'pending']),
})

/** GET /reviews/admin — all reviews for moderation */
export const listAdminReviews = asyncHandler(async (req, res) => {
  const status = String(req.query.status || 'all')
  const filter =
    status === 'all'
      ? {}
      : status === 'pending'
        ? { $or: [{ status: 'pending' }, { status: { $exists: false } }] }
        : { status }

  const items = await Review.find(filter)
    .sort({ createdAt: -1 })
    .limit(200)
    .populate('user', 'name email')

  const counts = await Review.aggregate([
    {
      $group: {
        _id: {
          $cond: [
            { $in: ['$status', ['approved', 'ignored']] },
            '$status',
            'pending',
          ],
        },
        count: { $sum: 1 },
      },
    },
  ]).then((rows) =>
    rows.reduce(
      (acc, r) => {
        acc[r._id] = r.count
        return acc
      },
      { pending: 0, approved: 0, ignored: 0 },
    ),
  )

  const total = counts.pending + counts.approved + counts.ignored

  return sendSuccess(res, {
    data: {
      items: items.map((r) => r.toAdminJSON(r.user)),
      counts: { ...counts, total },
    },
  })
})

/** PATCH /reviews/:id/status — approve / ignore / reset to pending */
export const updateReviewStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const review = mongoose.isValidObjectId(req.params.id)
    ? await Review.findById(req.params.id).populate('user', 'name email')
    : null

  if (!review) throw new ApiError(404, 'Review not found')

  review.status = status
  await review.save()

  await refreshProductRating(review.productId)

  return sendSuccess(res, {
    message: `Review marked as ${status}`,
    data: { review: review.toAdminJSON(review.user) },
  })
})

/** GET /reviews/mine — reviews by current user */
export const listMyReviews = asyncHandler(async (req, res) => {
  const items = await Review.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(200)
  return sendSuccess(res, {
    data: { items: items.map((r) => r.toPublicJSON()) },
  })
})

/** GET /reviews/product/:productId — public list (approved only) */
export const listProductReviews = asyncHandler(async (req, res) => {
  const items = await Review.find({ productId: req.params.productId, status: 'approved' })
    .sort({ createdAt: -1 })
    .limit(100)
  return sendSuccess(res, {
    data: { items: items.map((r) => r.toPublicJSON()) },
  })
})
