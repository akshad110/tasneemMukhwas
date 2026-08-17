import mongoose from 'mongoose'

const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true },
)

wishlistSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    productIds: this.products.map((id) => id.toString()),
    updatedAt: this.updatedAt,
  }
}

export const Wishlist = mongoose.model('Wishlist', wishlistSchema)
