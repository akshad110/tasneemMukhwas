/**
 * Backfill shortDescription + description for all products.
 * Run: node src/scripts/seedProductDescriptions.js
 */
import { connectDB } from '../config/db.js'
import { applyDescriptionsToProduct } from '../lib/productDescriptions.js'
import { Product } from '../models/Product.js'

async function main() {
  await connectDB()
  const products = await Product.find({})
  let updated = 0

  for (const product of products) {
    if (!applyDescriptionsToProduct(product)) continue
    await product.save()
    updated += 1
    console.log(`Updated: ${product.name}`)
  }

  console.log(`Done — ${updated} product(s) updated of ${products.length} total.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
