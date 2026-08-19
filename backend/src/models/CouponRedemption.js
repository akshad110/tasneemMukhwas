import mongoose from 'mongoose'

const couponRedemptionSchema = new mongoose.Schema(
  {
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', required: true, index: true },
    code: { type: String, required: true, uppercase: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: { type: String, required: true, lowercase: true, trim: true },
    orderNumber: { type: String, required: true, index: true },
    discountAmount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
)

couponRedemptionSchema.index({ coupon: 1, email: 1 })

export const CouponRedemption = mongoose.model('CouponRedemption', couponRedemptionSchema)
