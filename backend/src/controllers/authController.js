import { z } from 'zod'
import { User } from '../models/User.js'
import { ApiError, asyncHandler, sendSuccess } from '../utils/asyncHandler.js'
import { signToken } from '../utils/tokens.js'

const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  password: z.string().min(6).max(128),
  phone: z.string().trim().max(40).optional().default(''),
})

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
})

const profileSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().max(40).optional(),
  store: z.string().trim().max(160).optional(),
  timezone: z.string().trim().max(80).optional(),
  notifyOrders: z.boolean().optional(),
  notifyLowStock: z.boolean().optional(),
  notifyReviews: z.boolean().optional(),
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6).max(128),
})

function authPayload(user) {
  const token = signToken({ sub: user._id.toString(), role: user.role })
  return { token, user: user.toSafeJSON() }
}

export const registerSchemas = {
  registerSchema,
  loginSchema,
  profileSchema,
  changePasswordSchema,
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body
  const exists = await User.findOne({ email: email.toLowerCase() })
  if (exists) throw new ApiError(409, 'Email already registered')

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: 'customer',
  })

  return sendSuccess(res, {
    status: 201,
    message: 'Registered successfully',
    data: authPayload(user),
  })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password')
  }
  if (!user.isActive) throw new ApiError(403, 'Account is inactive')

  return sendSuccess(res, {
    message: 'Logged in successfully',
    data: authPayload(user),
  })
})

export const me = asyncHandler(async (req, res) => {
  return sendSuccess(res, { data: req.user.toSafeJSON() })
})

export const updateProfile = asyncHandler(async (req, res) => {
  const updates = req.body
  Object.assign(req.user, updates)
  await req.user.save()
  return sendSuccess(res, {
    message: 'Profile updated',
    data: req.user.toSafeJSON(),
  })
})

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const user = await User.findById(req.user._id).select('+password')
  if (!user) throw new ApiError(404, 'User not found')

  const ok = await user.comparePassword(currentPassword)
  if (!ok) throw new ApiError(401, 'Current password is incorrect')

  user.password = newPassword
  await user.save()

  return sendSuccess(res, {
    message: 'Password updated successfully',
    data: null,
  })
})
