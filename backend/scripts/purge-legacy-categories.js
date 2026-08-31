import 'dotenv/config'
import mongoose from 'mongoose'
import { ensureDefaultCategories } from '../src/models/Category.js'
import { Product } from '../src/models/Product.js'

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('MONGODB_URI is not set')
  process.exit(1)
}

await mongoose.connect(uri)
await ensureDefaultCategories(Product)
const active = await mongoose.connection.db
  .collection('categories')
  .find({ isActive: true })
  .project({ name: 1 })
  .toArray()
console.log(
  'Active categories:',
  active.map((c) => c.name).join(', '),
)
await mongoose.disconnect()
