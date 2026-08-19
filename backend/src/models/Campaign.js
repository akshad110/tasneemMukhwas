import mongoose from 'mongoose'

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    message: { type: String, default: '', trim: true, maxlength: 2000 },
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
    channel: { type: String, enum: ['email'], default: 'email' },
    recipientFilter: { type: String, enum: ['all', 'active'], default: 'all' },
    status: {
      type: String,
      enum: ['draft', 'sending', 'sent', 'failed'],
      default: 'draft',
      index: true,
    },
    stats: {
      total: { type: Number, default: 0 },
      sent: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
    },
    sentAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

campaignSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    title: this.title,
    message: this.message,
    couponId: this.coupon?.toString?.() || this.coupon,
    channel: this.channel,
    recipientFilter: this.recipientFilter,
    status: this.status,
    stats: this.stats,
    sentAt: this.sentAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

export const Campaign = mongoose.model('Campaign', campaignSchema)
