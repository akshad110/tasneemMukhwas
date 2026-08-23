import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productId: { type: String, required: true },
    name: { type: String, required: true },
    variantId: { type: String, default: 'default' },
    variantLabel: { type: String, default: 'Default' },
    image: { type: String, default: '' },
    qty: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, lowercase: true },
    customerPhone: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    country: { type: String, default: 'India' },
    postal: { type: String, default: '' },
    items: { type: [orderItemSchema], default: [] },
    itemCount: { type: Number, default: 0 },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    couponCode: { type: String, default: '', uppercase: true },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    payment: { type: String, enum: ['cod', 'razorpay'], required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    razorpayOrderId: { type: String, default: '', index: true },
    razorpayPaymentId: { type: String, default: '' },
    razorpaySignature: { type: String, default: '' },
    tracking: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
)

orderSchema.index({ createdAt: -1 })
orderSchema.index({ status: 1, createdAt: -1 })

orderSchema.methods.toAdminListJSON = function toAdminListJSON() {
  const lineItems = (this.items || []).map((item) => ({
    productId: item.productId,
    name: item.name,
    variantId: item.variantId,
    variantLabel: item.variantLabel,
    qty: item.qty,
    unitPrice: item.unitPrice,
    lineTotal: item.lineTotal,
    image: '',
  }))

  return {
    id: this.orderNumber,
    mongoId: this._id.toString(),
    customer: this.customerName,
    customerEmail: this.customerEmail,
    customerPhone: this.customerPhone,
    address: this.address,
    city: this.city,
    country: this.country,
    postal: this.postal,
    items: this.itemCount || this.items.reduce((s, i) => s + i.qty, 0),
    lineItems,
    subtotal: this.subtotal,
    deliveryFee: this.deliveryFee,
    discountAmount: this.discountAmount || 0,
    couponCode: this.couponCode || undefined,
    total: this.total,
    status: this.status,
    payment: this.payment,
    paymentStatus: this.paymentStatus,
    razorpayOrderId: this.razorpayOrderId || undefined,
    razorpayPaymentId: this.razorpayPaymentId || undefined,
    tracking: this.tracking || undefined,
    date: this.createdAt ? this.createdAt.toISOString().slice(0, 10) : '',
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

orderSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this.orderNumber,
    mongoId: this._id.toString(),
    customer: this.customerName,
    customerEmail: this.customerEmail,
    customerPhone: this.customerPhone,
    address: this.address,
    city: this.city,
    country: this.country,
    postal: this.postal,
    items: this.itemCount || this.items.reduce((s, i) => s + i.qty, 0),
    lineItems: this.items,
    subtotal: this.subtotal,
    deliveryFee: this.deliveryFee,
    discountAmount: this.discountAmount || 0,
    couponCode: this.couponCode || undefined,
    total: this.total,
    status: this.status,
    payment: this.payment,
    paymentStatus: this.paymentStatus,
    razorpayOrderId: this.razorpayOrderId || undefined,
    razorpayPaymentId: this.razorpayPaymentId || undefined,
    tracking: this.tracking || undefined,
    date: this.createdAt ? this.createdAt.toISOString().slice(0, 10) : '',
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

export const Order = mongoose.model('Order', orderSchema)
