import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 160,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, trim: true, default: '' },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    store: { type: String, trim: true, default: 'Tasneem Mukhwas · Chhapi' },
    timezone: { type: String, trim: true, default: 'Asia/Kolkata' },
    notifyOrders: { type: Boolean, default: true },
    notifyLowStock: { type: Boolean, default: true },
    notifyReviews: { type: Boolean, default: false },
    wishlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist', default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password)
}

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    store: this.store,
    timezone: this.timezone,
    notifyOrders: this.notifyOrders,
    notifyLowStock: this.notifyLowStock,
    notifyReviews: this.notifyReviews,
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

export const User = mongoose.model('User', userSchema)
