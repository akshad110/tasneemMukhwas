/**
 * Removes all storefront / admin commerce data from MongoDB.
 * Keeps admin user accounts only — products, orders, customers, etc. are wiped.
 *
 * Run: npm run clear-commerce
 */
import { connectDB } from '../config/db.js'
import { User } from '../models/User.js'
import { Product } from '../models/Product.js'
import { Customer } from '../models/Customer.js'
import { Order } from '../models/Order.js'
import { Transaction } from '../models/Transaction.js'
import { Review } from '../models/Review.js'
import { Coupon } from '../models/Coupon.js'
import { CouponRedemption } from '../models/CouponRedemption.js'
import { Campaign } from '../models/Campaign.js'
import { Notification } from '../models/Notification.js'
import { Wishlist } from '../models/Wishlist.js'

async function clearCommerce() {
  await connectDB()

  const results = await Promise.all([
    Product.deleteMany({}),
    Order.deleteMany({}),
    Transaction.deleteMany({}),
    Customer.deleteMany({}),
    Review.deleteMany({}),
    Coupon.deleteMany({}),
    CouponRedemption.deleteMany({}),
    Campaign.deleteMany({}),
    Notification.deleteMany({}),
    Wishlist.deleteMany({}),
    User.deleteMany({ role: { $ne: 'admin' } }),
  ])

  const labels = [
    'products',
    'orders',
    'transactions',
    'customers',
    'reviews',
    'coupons',
    'coupon redemptions',
    'campaigns',
    'notifications',
    'wishlists',
    'non-admin users',
  ]

  console.log('Commerce data cleared:')
  labels.forEach((label, i) => console.log(`  - ${results[i].deletedCount} ${label}`))

  const admins = await User.find({ role: 'admin' }).select('email').lean()
  console.log(`\nAdmin accounts kept (${admins.length}):`)
  for (const a of admins) console.log(`  - ${a.email}`)

  console.log('\nAdmin panel is empty — add products and content manually.')
  process.exit(0)
}

clearCommerce().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
