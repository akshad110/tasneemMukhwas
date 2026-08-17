import { z } from 'zod'
import mongoose from 'mongoose'
import { Wishlist } from '../models/Wishlist.js'
import { Product } from '../models/Product.js'
import { User } from '../models/User.js'
import { ApiError, asyncHandler, sendSuccess } from '../utils/asyncHandler.js'

export const wishlistBodySchema = z.object({
  productId: z.string().min(1),
})

async function ensureWishlist(user) {
  if (user.wishlist) {
    const existing = await Wishlist.findById(user.wishlist)
    if (existing) return existing
  }

  const created = await Wishlist.create({ user: user._id, products: [] })
  user.wishlist = created._id
  await user.save()
  return created
}

async function wishlistProducts(wishlist) {
  if (!wishlist.products.length) return []

  const products = await Product.find({
    _id: { $in: wishlist.products },
    isActive: true,
  })
  const byId = new Map(products.map((p) => [p._id.toString(), p]))

  return wishlist.products
    .map((id) => byId.get(id.toString()))
    .filter(Boolean)
    .map((p) => p.toPublicJSON())
}

/** GET /wishlist — current user's saved products */
export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await ensureWishlist(req.user)
  const items = await wishlistProducts(wishlist)

  return sendSuccess(res, {
    data: {
      wishlist: wishlist.toPublicJSON(),
      items,
    },
  })
})

/** POST /wishlist — add product */
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body
  if (!mongoose.isValidObjectId(productId)) {
    throw new ApiError(400, 'Invalid product id')
  }

  const product = await Product.findOne({ _id: productId, isActive: true })
  if (!product) throw new ApiError(404, 'Product not found')

  const wishlist = await ensureWishlist(req.user)
  const already = wishlist.products.some((id) => id.toString() === productId)
  if (!already) {
    wishlist.products.push(product._id)
    await wishlist.save()
  }

  const items = await wishlistProducts(wishlist)

  return sendSuccess(res, {
    status: already ? 200 : 201,
    message: already ? 'Already in wishlist' : 'Added to wishlist',
    data: {
      wishlist: wishlist.toPublicJSON(),
      items,
      added: !already,
    },
  })
})

/** DELETE /wishlist/:productId — remove product */
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params
  const wishlist = await ensureWishlist(req.user)
  const before = wishlist.products.length

  wishlist.products = wishlist.products.filter((id) => id.toString() !== productId)
  if (wishlist.products.length !== before) {
    await wishlist.save()
  }

  const items = await wishlistProducts(wishlist)

  return sendSuccess(res, {
    message: 'Removed from wishlist',
    data: {
      wishlist: wishlist.toPublicJSON(),
      items,
      removed: before !== wishlist.products.length,
    },
  })
})

/** Ensure existing users without a wishlist doc get one lazily */
export async function backfillUserWishlist(userId) {
  const user = await User.findById(userId)
  if (!user) return null
  return ensureWishlist(user)
}
