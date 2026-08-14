import mongoose from 'mongoose'

const interactionSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    type: { type: String, required: true },
    detail: { type: String, required: true },
  },
  { _id: false },
)

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: '', trim: true },
    city: { type: String, default: '', trim: true },
    orders: { type: Number, default: 0, min: 0 },
    spent: { type: Number, default: 0, min: 0 },
    lastActive: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    interactions: { type: [interactionSchema], default: [] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

customerSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    phone: this.phone,
    city: this.city,
    orders: this.orders,
    spent: this.spent,
    lastActive: this.lastActive,
    status: this.status,
    interactions: this.interactions,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

export const Customer = mongoose.model('Customer', customerSchema)
