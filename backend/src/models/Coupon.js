import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, trim: true, uppercase: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: '', trim: true, maxlength: 500 },
    scope: {
      type: String,
      enum: ['global', 'product', 'category'],
      default: 'global',
      index: true,
    },
    productId: { type: String, default: '', index: true },
    category: { type: String, default: '', index: true },
    discountType: { type: String, enum: ['percent', 'fixed'], required: true },
    value: { type: Number, required: true, min: 0 },
    expiresAt: { type: Date, required: true, index: true },
    maxRedemptions: { type: Number, default: 0, min: 0 },
    redemptionCount: { type: Number, default: 0, min: 0 },
    maxRedemptionsPerUser: { type: Number, default: 1, min: 1 },
    minOrderValue: { type: Number, default: 0, min: 0 },
    maxDiscountAmount: { type: Number, default: 0, min: 0 },
    autoApply: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

couponSchema.index({ scope: 1, isActive: 1, expiresAt: 1 })

couponSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    code: this.code || undefined,
    title: this.title,
    description: this.description,
    scope: this.scope,
    productId: this.productId || undefined,
    category: this.category || undefined,
    discountType: this.discountType,
    value: this.value,
    expiresAt: this.expiresAt,
    maxRedemptions: this.maxRedemptions,
    redemptionCount: this.redemptionCount,
    maxRedemptionsPerUser: this.maxRedemptionsPerUser,
    minOrderValue: this.minOrderValue,
    maxDiscountAmount: this.maxDiscountAmount || undefined,
    autoApply: this.autoApply,
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

export const Coupon = mongoose.model('Coupon', couponSchema)
