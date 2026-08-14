import { Order } from '../models/Order.js'
import { Product } from '../models/Product.js'
import { Customer } from '../models/Customer.js'
import { Transaction } from '../models/Transaction.js'
import { asyncHandler, sendSuccess } from '../utils/asyncHandler.js'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const getDashboard = asyncHandler(async (_req, res) => {
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const [
    paidSales,
    ordersToday,
    lowStock,
    customers,
    salesByMonthRaw,
    inventory,
    shipment,
    topProducts,
    recentOrders,
  ] = await Promise.all([
    Transaction.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Order.countDocuments({ createdAt: { $gte: startOfDay } }),
    Product.countDocuments({
      isActive: true,
      $or: [{ outOfStock: true }, { stock: { $gt: 0, $lt: 20 } }],
    }),
    Customer.countDocuments(),
    Order.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: '$total' },
        },
      },
    ]),
    Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: {
            $cond: [
              { $or: [{ $eq: ['$outOfStock', true] }, { $lte: ['$stock', 0] }] },
              'Out of Stock',
              {
                $cond: [{ $lt: ['$stock', 20] }, 'Low Stock', 'In Stock'],
              },
            ],
          },
          count: { $sum: 1 },
        },
      },
    ]),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Product.find({ isActive: true }).sort({ sales: -1 }).limit(4),
    Order.find().sort({ createdAt: -1 }).limit(6),
  ])

  const salesMap = Object.fromEntries(salesByMonthRaw.map((r) => [r._id, r.total]))
  const maxMonth = Math.max(...Object.values(salesMap), 1)

  const inventoryStatus = [
    { label: 'In Stock', count: 0, tone: 'ok' },
    { label: 'Low Stock', count: 0, tone: 'warn' },
    { label: 'Out of Stock', count: 0, tone: 'bad' },
  ].map((row) => {
    const found = inventory.find((i) => i._id === row.label)
    return { ...row, count: found?.count || 0 }
  })

  const shipmentMap = Object.fromEntries(shipment.map((s) => [s._id, s.count]))
  const shipmentTotal = Object.values(shipmentMap).reduce((a, b) => a + b, 0) || 1

  const shipmentBreakdown = [
    { label: 'Delivered', key: 'completed', color: '#2d6a4f' },
    { label: 'On Delivery', key: 'shipped', color: '#40916c' },
    { label: 'Processing', key: 'processing', color: '#b8860b' },
    { label: 'Canceled', key: 'cancelled', color: '#c0392b' },
  ].map((row) => ({
    label: row.label,
    value: Math.round(((shipmentMap[row.key] || 0) / shipmentTotal) * 100),
    color: row.color,
  }))

  return sendSuccess(res, {
    data: {
      metrics: {
        totalSales: paidSales[0]?.total || 0,
        ordersToday,
        lowStock,
        customers,
      },
      salesByMonth: MONTHS.map((m, i) => ({
        m,
        v: Math.round(((salesMap[i + 1] || 0) / maxMonth) * 100) || 0,
        amount: salesMap[i + 1] || 0,
      })),
      inventoryStatus,
      shipmentBreakdown,
      customerActivity: [
        { label: 'Direct', value: 40, color: '#2d6a4f' },
        { label: 'Search', value: 35, color: '#52b788' },
        { label: 'Social', value: 25, color: '#b8860b' },
      ],
      marketingBars: [
        { label: 'Facebook', a: 72, b: 48 },
        { label: 'Google', a: 88, b: 62 },
        { label: 'Email', a: 54, b: 38 },
        { label: 'Instagram', a: 79, b: 55 },
        { label: 'Video', a: 41, b: 28 },
      ],
      topProducts: topProducts.map((p) => p.toPublicJSON()),
      recentOrders: recentOrders.map((o) => o.toPublicJSON()),
    },
  })
})
