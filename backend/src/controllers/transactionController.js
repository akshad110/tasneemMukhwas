import { Transaction } from '../models/Transaction.js'
import { ApiError, asyncHandler, sendSuccess } from '../utils/asyncHandler.js'

export const listTransactions = asyncHandler(async (req, res) => {
  const { status, q } = req.query
  const filter = {}
  if (status && status !== 'all') filter.status = status
  if (q) {
    filter.$or = [
      { txnNumber: new RegExp(String(q), 'i') },
      { orderNumber: new RegExp(String(q), 'i') },
      { customerName: new RegExp(String(q), 'i') },
      { invoice: new RegExp(String(q), 'i') },
    ]
  }

  const items = await Transaction.find(filter).sort({ createdAt: -1 }).limit(200)

  const totals = await Transaction.aggregate([
    {
      $group: {
        _id: '$status',
        amount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ])

  const byStatus = totals.reduce((acc, row) => {
    acc[row._id] = { amount: row.amount, count: row.count }
    return acc
  }, {})

  return sendSuccess(res, {
    data: {
      items: items.map((t) => t.toPublicJSON()),
      summary: {
        paid: byStatus.paid?.amount || 0,
        pending: byStatus.pending?.amount || 0,
        count: await Transaction.countDocuments(filter),
      },
    },
  })
})

export const getTransaction = asyncHandler(async (req, res) => {
  const txn =
    (await Transaction.findOne({ txnNumber: req.params.id })) ||
    (await Transaction.findById(req.params.id).catch(() => null))
  if (!txn) throw new ApiError(404, 'Transaction not found')
  return sendSuccess(res, { data: txn.toPublicJSON() })
})
