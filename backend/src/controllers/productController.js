import { z } from 'zod'
import { Product } from '../models/Product.js'
import { ApiError, asyncHandler, sendSuccess } from '../utils/asyncHandler.js'

export const productCreateSchema = z.object({
  name: z.string().trim().min(2).max(160),
  description: z.string().trim().max(2000).optional().default(''),
  category: z.string().trim().min(2).max(80),
  brand: z.string().trim().max(80).optional().default('Tasneem'),
  fill: z.string().trim().max(32).optional().default('#0a2e22'),
  lightText: z.boolean().optional().default(true),
  image: z.string().optional().default(''),
  images: z.array(z.string()).max(3).optional().default([]),
  price: z.number().min(0),
  showDiscountedPrice: z.boolean().optional().default(false),
  discountedPrice: z.number().min(0).optional(),
  compareAt: z.number().min(0).optional(),
  outOfStock: z.boolean().optional().default(false),
  stock: z.number().int().min(0).optional().default(50),
  rating: z.number().min(0).max(5).optional().default(5),
  reviews: z.number().int().min(0).optional().default(0),
  variants: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        color: z.string().optional(),
        image: z.string().optional(),
      }),
    )
    .optional()
    .default([]),
  isActive: z.boolean().optional().default(true),
})

export const productUpdateSchema = productCreateSchema.partial()

function normalizeImages(body) {
  const images = (body.images || []).filter(Boolean).slice(0, 3)
  const image = images[0] || body.image || ''
  return { images: images.length ? images : image ? [image] : [], image }
}

export const listProducts = asyncHandler(async (req, res) => {
  const {
    q,
    category,
    minRating,
    maxPrice,
    includeInactive,
    page = '1',
    limit = '50',
  } = req.query

  const filter = {}
  const isAdmin = req.user?.role === 'admin'
  if (!isAdmin || includeInactive !== 'true') {
    filter.isActive = true
  }

  if (category) filter.category = category
  if (minRating) filter.rating = { $gte: Number(minRating) }
  if (maxPrice) {
    filter.$and = filter.$and || []
    filter.$and.push({
      $or: [
        { showDiscountedPrice: true, discountedPrice: { $lte: Number(maxPrice) } },
        {
          $or: [{ showDiscountedPrice: { $ne: true } }, { showDiscountedPrice: false }],
          price: { $lte: Number(maxPrice) },
        },
      ],
    })
  }
  if (q) {
    const rx = new RegExp(String(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [{ name: rx }, { category: rx }, { brand: rx }, { description: rx }]
  }

  const pageNum = Math.max(1, Number(page) || 1)
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 50))
  const skip = (pageNum - 1) * limitNum

  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Product.countDocuments(filter),
  ])

  return sendSuccess(res, {
    data: {
      items: items.map((p) => p.toPublicJSON()),
      total,
      page: pageNum,
      limit: limitNum,
      categories: await Product.distinct('category', { isActive: true }),
    },
  })
})

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product || (!product.isActive && req.user?.role !== 'admin')) {
    throw new ApiError(404, 'Product not found')
  }
  return sendSuccess(res, { data: product.toPublicJSON() })
})

export const createProduct = asyncHandler(async (req, res) => {
  const body = { ...req.body, ...normalizeImages(req.body) }
  delete body.id
  delete body._id
  if (body.showDiscountedPrice && !(body.discountedPrice > 0)) {
    throw new ApiError(400, 'Discounted price is required when show discounted price is enabled')
  }
  if (body.outOfStock) body.stock = 0
  if (!body.variants?.length && body.image) {
    body.variants = [
      { id: 'default', label: 'Default', color: body.fill || '#0a2e22', image: body.image },
    ]
  }

  const product = await Product.create(body)
  return sendSuccess(res, {
    status: 201,
    message: 'Product created',
    data: product.toPublicJSON(),
  })
})

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) throw new ApiError(404, 'Product not found')

  const body = { ...req.body }
  if (body.images || body.image) {
    Object.assign(body, normalizeImages({ ...product.toObject(), ...body }))
  }
  if (body.showDiscountedPrice && body.discountedPrice != null && !(body.discountedPrice > 0)) {
    throw new ApiError(400, 'Discounted price must be greater than 0')
  }
  if (body.outOfStock === true) body.stock = 0

  Object.assign(product, body)
  await product.save()

  return sendSuccess(res, {
    message: 'Product updated',
    data: product.toPublicJSON(),
  })
})

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) throw new ApiError(404, 'Product not found')
  return sendSuccess(res, { message: 'Product deleted', data: { id: req.params.id } })
})
