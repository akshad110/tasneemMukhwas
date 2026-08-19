import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
  {
    txnNumber: { type: String, required: true, unique: true, index: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    orderNumber: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, default: '' },
    amount: { type: Number, required: true, min: 0 },
    method: {
      type: String,
      enum: ['cod', 'razorpay', 'upi', 'card'],
      required: true,
    },
    status: {
      type: String,
      enum: ['paid', 'pending', 'refunded', 'failed'],
      default: 'pending',
      index: true,
    },
    invoice: { type: String, required: true },
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' },
    razorpaySignature: { type: String, default: '' },
  },
  { timestamps: true },
)

transactionSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this.txnNumber,
    mongoId: this._id.toString(),
    orderId: this.orderNumber,
    customer: this.customerName,
    amount: this.amount,
    method: this.method,
    status: this.status,
    invoice: this.invoice,
    razorpayOrderId: this.razorpayOrderId || undefined,
    razorpayPaymentId: this.razorpayPaymentId || undefined,
    date: this.createdAt ? this.createdAt.toISOString().slice(0, 10) : '',
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

export const Transaction = mongoose.model('Transaction', transactionSchema)
