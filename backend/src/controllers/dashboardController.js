import { Order } from '../models/Order.js'
import { Product } from '../models/Product.js'
import { Customer } from '../models/Customer.js'
import { Transaction } from '../models/Transaction.js'
import { asyncHandler, sendSuccess } from '../utils/asyncHandler.js'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_FULL = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function monthRange(year, month1to12) {
  const start = new Date(year, month1to12 - 1, 1, 0, 0, 0, 0)
  const end = new Date(year, month1to12, 0, 23, 59, 59, 999)
  return { start, end }
}

function daysInMonth(year, month1to12) {
  return new Date(year, month1to12, 0).getDate()
}

export const getDashboard = asyncHandler(async (req, res) => {
  const period = req.query.period === 'month' ? 'month' : 'all'
  const year = Math.min(9999, Math.max(2000, Number(req.query.year) || new Date().getFullYear()))
  const month = Number(req.query.month)

  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  let orderDateFilter = {}
  let txnDateFilter = { status: 'paid' }
  let periodLabel = 'All time'

  if (period === 'month' && month >= 1 && month <= 12) {
    const { start, end } = monthRange(year, month)
    orderDateFilter = { createdAt: { $gte: start, $lte: end } }
    txnDateFilter = { ...txnDateFilter, createdAt: { $gte: start, $lte: end } }
    periodLabel = `${MONTHS_FULL[month - 1]} ${year}`
  }

  const orderMatch = Object.keys(orderDateFilter).length ? [{ $match: orderDateFilter }] : []

  const [
    paidSales,
    ordersInPeriod,
    totalProducts,
    customers,
    salesSeriesRaw,
    inventory,
    shipment,
    topProductsAgg,
    recentOrders,
  ] = await Promise.all([
    Transaction.aggregate([
      { $match: txnDateFilter },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    period === 'month'
      ? Order.countDocuments(orderDateFilter)
      : Order.countDocuments({ createdAt: { $gte: startOfDay } }),
    Product.countDocuments({ isActive: true }),
    period === 'month'
      ? Order.distinct('customerEmail', orderDateFilter).then((emails) => emails.filter(Boolean).length)
      : Customer.countDocuments(),
    period === 'month' && month >= 1 && month <= 12
      ? Order.aggregate([
          ...orderMatch,
          {
            $group: {
              _id: { $dayOfMonth: '$createdAt' },
              total: { $sum: '$total' },
            },
          },
        ])
      : Order.aggregate([
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
    Order.aggregate([...orderMatch, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    Order.aggregate([
      ...orderMatch,
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          name: { $first: '$items.name' },
          qty: { $sum: '$items.qty' },
          revenue: { $sum: '$items.lineTotal' },
        },
      },
    ]),
    Order.find(orderDateFilter)
      .sort({ createdAt: -1 })
      .limit(6),
  ])

  let salesByMonth
  if (period === 'month' && month >= 1 && month <= 12) {
    const dayMap = Object.fromEntries(salesSeriesRaw.map((r) => [r._id, r.total]))
    const totalDays = daysInMonth(year, month)
    const maxDay = Math.max(...Object.values(dayMap), 1)
    salesByMonth = Array.from({ length: totalDays }, (_, i) => {
      const day = i + 1
      const amount = dayMap[day] || 0
      return {
        m: String(day),
        v: Math.round((amount / maxDay) * 100) || 0,
        amount,
      }
    })
  } else {
    const salesMap = Object.fromEntries(salesSeriesRaw.map((r) => [r._id, r.total]))
    const maxMonth = Math.max(...Object.values(salesMap), 1)
    salesByMonth = MONTHS.map((m, i) => ({
      m,
      v: Math.round(((salesMap[i + 1] || 0) / maxMonth) * 100) || 0,
      amount: salesMap[i + 1] || 0,
    }))
  }

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

  const soldMap = new Map(topProductsAgg.map((r) => [String(r._id), r]))
  const allProducts = await Product.find({ isActive: true }).sort({ name: 1 })

  let topProducts = allProducts.map((p) => {
    const row = soldMap.get(p._id.toString())
    const json = p.toPublicJSON()
    return {
      ...json,
      sales: row?.revenue ?? 0,
      reviews: row?.qty ?? 0,
    }
  })

  if (period === 'all' && topProductsAgg.length === 0) {
    topProducts = allProducts
      .map((p) => p.toPublicJSON())
      .sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0) || a.name.localeCompare(b.name))
  } else {
    topProducts.sort(
      (a, b) => (b.reviews ?? 0) - (a.reviews ?? 0) || (b.sales ?? 0) - (a.sales ?? 0) || a.name.localeCompare(b.name),
    )
  }

  return sendSuccess(res, {
    data: {
      period: period === 'month' && month >= 1 && month <= 12 ? { mode: 'month', year, month } : { mode: 'all' },
      periodLabel,
      metrics: {
        totalSales: paidSales[0]?.total || 0,
        ordersToday: ordersInPeriod,
        totalProducts,
        customers,
      },
      salesByMonth,
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
      topProducts,
      recentOrders: recentOrders.map((o) => o.toPublicJSON()),
    },
  })
})
