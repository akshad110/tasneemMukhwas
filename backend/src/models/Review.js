import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    productId: { type: String, required: true, index: true },
    productName: { type: String, default: '' },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    orderNumber: { type: String, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    /** Kept for future testimonials */
    comment: { type: String, default: '', trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'ignored'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true },
)

reviewSchema.index({ user: 1, order: 1, productId: 1 }, { unique: true })

reviewSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    productId: this.productId,
    productName: this.productName,
    orderNumber: this.orderNumber,
    rating: this.rating,
    comment: this.comment,
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

reviewSchema.methods.toAdminJSON = function toAdminJSON(userDoc) {
  const name = userDoc?.name?.trim() || 'Customer'
  return {
    ...this.toPublicJSON(),
    customerName: name,
    customerEmail: userDoc?.email || '',
    authorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=b8860b&color=f3e6c8&size=128&bold=true`,
  }
}

export const Review = mongoose.model('Review', reviewSchema)
