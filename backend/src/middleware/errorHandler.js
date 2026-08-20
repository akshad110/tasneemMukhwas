import { ZodError } from 'zod'
import { ApiError } from '../utils/asyncHandler.js'
import { env } from '../config/env.js'

export function notFoundHandler(_req, _res, next) {
  next(new ApiError(404, 'Route not found'))
}

export function errorHandler(err, _req, res, _next) {
  let status = err.statusCode || 500
  let message = err.message || 'Internal server error'
  let errors = err.errors || null

  if (err instanceof ZodError) {
    status = 400
    message = 'Validation failed'
    errors = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }))
  }

  if (err?.name === 'ValidationError' && err.errors) {
    status = 400
    message = 'Validation failed'
    errors = Object.values(err.errors).map((e) => ({
      path: e.path,
      message: e.message,
    }))
  }

  if (err?.code === 11000) {
    status = 409
    const field = Object.keys(err.keyPattern || {})[0] || 'field'
    message =
      field === 'orderNumber'
        ? 'Could not assign an order number. Please try again.'
        : `${field} already exists`
  }

  if (err?.name === 'CastError') {
    status = 400
    message = 'Invalid id'
  }

  if (status >= 500 && env.nodeEnv !== 'development') {
    message = 'Internal server error'
  }

  if (env.nodeEnv === 'development' && status >= 500) {
    console.error(err)
  }

  res.status(status).json({
    success: false,
    message,
    errors,
  })
}
