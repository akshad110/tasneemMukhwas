export class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors
    this.isOperational = true
  }
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export function sendSuccess(res, { status = 200, message = 'OK', data = null, cache = 'no-store' } = {}) {
  if (cache) res.set('Cache-Control', cache)
  return res.status(status).json({
    success: true,
    message,
    data,
  })
}
