import mongoose from 'mongoose'
import { Order } from '../models/Order.js'
import { Transaction } from '../models/Transaction.js'

const counterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, required: true },
  },
  { versionKey: false },
)

const Counter = mongoose.models.IdCounter || mongoose.model('IdCounter', counterSchema)

async function maxSeq(model, field, prefix, floor) {
  const [row] = await model.aggregate([
    { $match: { [field]: { $regex: new RegExp(`^${prefix}-\\d+$`) } } },
    {
      $project: {
        n: {
          $convert: {
            input: { $substrBytes: [`$${field}`, prefix.length + 1, 12] },
            to: 'int',
            onError: floor,
            onNull: floor,
          },
        },
      },
    },
    { $group: { _id: null, max: { $max: '$n' } } },
  ])
  return row?.max ?? floor
}

async function nextId(counterKey, prefix, floor, model, field) {
  const highest = await maxSeq(model, field, prefix, floor)
  await Counter.findOneAndUpdate(
    { _id: counterKey },
    { $max: { seq: Math.max(floor, highest) } },
    { upsert: true, setDefaultsOnInsert: { seq: floor } },
  )

  const doc = await Counter.findOneAndUpdate(
    { _id: counterKey },
    { $inc: { seq: 1 } },
    { new: true },
  )

  return `${prefix}-${doc.seq}`
}

export function nextOrderNumber() {
  return nextId('orderNumber', 'TM', 1000, Order, 'orderNumber')
}

export function nextTxnNumber() {
  return nextId('txnNumber', 'TX', 9000, Transaction, 'txnNumber')
}
