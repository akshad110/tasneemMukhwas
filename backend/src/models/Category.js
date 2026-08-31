import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true, maxlength: 120 },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export const Category = mongoose.model('Category', categorySchema)

export const DEFAULT_CATEGORIES = [
  'Our Salted Mukhwas',
  'Our Sweet Mukhwas',
  'Our Taste Shots',
  'Our Imli Masti',
  'Our Mango Masti',
]

/** Old catalog names — deactivated and migrated off products. */
export const LEGACY_CATEGORIES = [
  'Classic Mukhwas',
  'Fruit Blend',
  'Paan Special',
  'Seed Mix',
  'Mouth Freshener',
]

const LEGACY_CATEGORY_MAP = {
  'Classic Mukhwas': 'Our Salted Mukhwas',
  'Fruit Blend': 'Our Sweet Mukhwas',
  'Paan Special': 'Our Taste Shots',
  'Seed Mix': 'Our Salted Mukhwas',
  'Mouth Freshener': 'Our Sweet Mukhwas',
}

export async function purgeLegacyCategories(Product) {
  await Category.updateMany({ name: { $in: LEGACY_CATEGORIES } }, { $set: { isActive: false } })

  if (Product) {
    for (const [oldName, newName] of Object.entries(LEGACY_CATEGORY_MAP)) {
      await Product.updateMany({ category: oldName }, { $set: { category: newName } })
    }
  }
}

export async function ensureDefaultCategories(Product) {
  for (let index = 0; index < DEFAULT_CATEGORIES.length; index += 1) {
    const name = DEFAULT_CATEGORIES[index]
    await Category.findOneAndUpdate(
      { name },
      { name, sortOrder: index, isActive: true },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )
  }

  await purgeLegacyCategories(Product)
}
