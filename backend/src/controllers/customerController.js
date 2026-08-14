import { Customer } from '../models/Customer.js'
import { ApiError, asyncHandler, sendSuccess } from '../utils/asyncHandler.js'

export const listCustomers = asyncHandler(async (req, res) => {
  const { q, status } = req.query
  const filter = {}
  if (status && status !== 'all') filter.status = status
  if (q) {
    filter.$or = [
      { name: new RegExp(String(q), 'i') },
      { email: new RegExp(String(q), 'i') },
      { phone: new RegExp(String(q), 'i') },
      { city: new RegExp(String(q), 'i') },
    ]
  }

  const customers = await Customer.find(filter).sort({ updatedAt: -1 }).limit(200)
  return sendSuccess(res, {
    data: {
      items: customers.map((c) => c.toPublicJSON()),
      total: customers.length,
    },
  })
})

export const getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id)
  if (!customer) throw new ApiError(404, 'Customer not found')
  return sendSuccess(res, { data: customer.toPublicJSON() })
})
