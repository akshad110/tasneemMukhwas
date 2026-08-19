import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    email: { type: String, lowercase: true, trim: true, index: true },
    type: {
      type: String,
      enum: [
        'order_placed',
        'payment_received',
        'payment_pending',
        'order_shipped',
        'order_completed',
        'discount_campaign',
        'discount_available',
        'system',
      ],
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    body: { type: String, default: '', trim: true, maxlength: 2000 },
    channel: { type: String, enum: ['in_app', 'email', 'both'], default: 'in_app' },
    emailStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'skipped'],
      default: 'skipped',
    },
    orderNumber: { type: String, default: '', index: true },
    couponCode: { type: String, default: '' },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    read: { type: Boolean, default: false, index: true },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
)

notificationSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    type: this.type,
    title: this.title,
    body: this.body,
    channel: this.channel,
    emailStatus: this.emailStatus,
    orderNumber: this.orderNumber || undefined,
    couponCode: this.couponCode || undefined,
    read: this.read,
    meta: this.meta,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

export const Notification = mongoose.model('Notification', notificationSchema)
