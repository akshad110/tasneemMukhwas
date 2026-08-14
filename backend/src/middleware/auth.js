import { ApiError } from '../utils/asyncHandler.js'
import { verifyToken } from '../utils/tokens.js'
import { User } from '../models/User.js'

export async function authenticate(req, _res, next) {
  try {
    const header = req.headers.authorization || ''
    const [scheme, token] = header.split(' ')
    if (scheme !== 'Bearer' || !token) {
      throw new ApiError(401, 'Authentication required')
    }

    let decoded
    try {
      decoded = verifyToken(token)
    } catch {
      throw new ApiError(401, 'Invalid or expired token')
    }

    const user = await User.findById(decoded.sub)
    if (!user || !user.isActive) {
      throw new ApiError(401, 'User not found or inactive')
    }

    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

export function requireAdmin(req, _res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError(403, 'Admin access required'))
  }
  next()
}

export async function optionalAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || ''
    const [scheme, token] = header.split(' ')
    if (scheme !== 'Bearer' || !token) return next()

    const decoded = verifyToken(token)
    const user = await User.findById(decoded.sub)
    if (user?.isActive) req.user = user
    next()
  } catch {
    next()
  }
}
