import { Customer } from '../models/Customer.js'

/**
 * Whether the authenticated user may view or download this order.
 * Mirrors /orders/mine visibility: account email, linked customer profile, or admin.
 */
export async function userCanAccessOrder(req, order) {
  if (!req.user) return false
  if (req.user.role === 'admin') return true

  const userEmail = String(req.user.email || '').trim().toLowerCase()
  const orderEmail = String(order.customerEmail || '').trim().toLowerCase()

  if (orderEmail && userEmail && orderEmail === userEmail) return true

  if (order.customer) {
    const orderCustomer = await Customer.findById(order.customer)
    if (orderCustomer?.user && String(orderCustomer.user) === String(req.user._id)) {
      return true
    }
    if (
      orderEmail &&
      orderCustomer &&
      String(orderCustomer.email || '').toLowerCase() === orderEmail &&
      orderCustomer.user &&
      String(orderCustomer.user) === String(req.user._id)
    ) {
      return true
    }
  }

  const linkedCustomers = await Customer.find({ user: req.user._id }).select('_id email')
  for (const customer of linkedCustomers) {
    if (order.customer && String(order.customer) === String(customer._id)) return true
    if (orderEmail && String(customer.email || '').toLowerCase() === orderEmail) return true
  }

  const customer = await Customer.findOne({
    $or: [{ email: userEmail }, { user: req.user._id }],
  })
  if (customer) {
    if (order.customer && String(order.customer) === String(customer._id)) return true
    if (orderEmail && String(customer.email || '').toLowerCase() === orderEmail) return true
  }

  return false
}
