import { Category, ensureDefaultCategories } from '../models/Category.js'
import { Product } from '../models/Product.js'
import { ApiError, asyncHandler, sendSuccess } from '../utils/asyncHandler.js'

export const listCategories = asyncHandler(async (_req, res) => {
  await ensureDefaultCategories(Product)
  const items = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean()
  return sendSuccess(res, {
    data: items.map((c) => ({
      id: c._id.toString(),
      name: c.name,
      sortOrder: c.sortOrder,
    })),
  })
})

export const createCategory = asyncHandler(async (req, res) => {
  const name = String(req.body?.name || '').trim()
  if (name.length < 2) throw new ApiError(400, 'Category name is required')

  const existing = await Category.findOne({ name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') })
  if (existing) {
    if (!existing.isActive) {
      existing.isActive = true
      await existing.save()
      return sendSuccess(res, { data: { id: existing._id.toString(), name: existing.name } })
    }
    throw new ApiError(409, 'Category already exists')
  }

  const maxOrder = await Category.findOne().sort({ sortOrder: -1 }).select('sortOrder').lean()
  const doc = await Category.create({
    name,
    sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
    isActive: true,
  })

  return sendSuccess(res, {
    data: { id: doc._id.toString(), name: doc.name },
    statusCode: 201,
  })
})

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)
  if (!category || !category.isActive) {
    throw new ApiError(404, 'Category not found')
  }

  const inUse = await Product.countDocuments({ category: category.name, isActive: true })
  if (inUse > 0) {
    throw new ApiError(
      409,
      `Cannot delete "${category.name}" — ${inUse} active product(s) still use it. Reassign them first.`,
    )
  }

  category.isActive = false
  await category.save()

  return sendSuccess(res, {
    message: 'Category deleted',
    data: { id: category._id.toString(), name: category.name },
  })
})
