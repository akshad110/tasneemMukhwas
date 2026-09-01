import mongoose from 'mongoose'

const variantSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    color: { type: String, default: '#0a2e22' },
    image: { type: String, default: '' },
  },
  { _id: false },
)

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, sparse: true, trim: true },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    shortDescription: { type: String, default: '', maxlength: 200 },
    description: { type: String, default: '', maxlength: 2000 },
    category: { type: String, required: true, trim: true },
    brand: { type: String, default: 'Tasneem', trim: true },
    fill: { type: String, default: '#0a2e22' },
    showPanelBg: { type: Boolean, default: true },
    lightText: { type: Boolean, default: true },
    image: { type: String, default: '' },
    images: { type: [String], default: [], validate: [(v) => v.length <= 4, 'Max 4 images'] },
    hasImage: { type: Boolean, default: false },
    price: { type: Number, required: true, min: 0 },
    showDiscountedPrice: { type: Boolean, default: false },
    discountedPrice: { type: Number, min: 0 },
    compareAt: { type: Number, min: 0 },
    outOfStock: { type: Boolean, default: false },
    stock: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 5, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    variants: { type: [variantSchema], default: [] },
    packetEnabled: { type: Boolean, default: true },
    bottleEnabled: { type: Boolean, default: false },
    packFormat: { type: String, enum: ['packet', 'bottle'], default: 'packet' },
    packetGrams: { type: [Number], default: [100] },
    bottleGrams: { type: [Number], default: [100] },
    bottlePrice: { type: Number, min: 0 },
    bottleShowDiscountedPrice: { type: Boolean, default: false },
    bottleDiscountedPrice: { type: Number, min: 0 },
    bottleShortDescription: { type: String, default: '', maxlength: 200 },
    bottleDescription: { type: String, default: '', maxlength: 2000 },
    sales: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

productSchema.index({ name: 'text', category: 'text', brand: 'text' })
productSchema.index({ category: 1, outOfStock: 1, isActive: 1 })

function buildVariantsFromPackFields(raw) {
  const fill = raw.fill || '#0a2e22'
  const images = (raw.images?.length ? raw.images : raw.image ? [raw.image] : []).slice(0, 4)
  const image = images[0] || raw.image || ''
  const variants = []

  const packFormat = raw.packFormat === 'bottle' ? 'bottle' : 'packet'
  const packetGrams = Array.isArray(raw.packetGrams) && raw.packetGrams.length ? raw.packetGrams : null
  const bottleGrams = Array.isArray(raw.bottleGrams) && raw.bottleGrams.length ? raw.bottleGrams : null
  const packetEnabled = packFormat === 'packet' && raw.packetEnabled !== false
  const bottleEnabled = packFormat === 'bottle' && (raw.bottleEnabled !== false || raw.packFormat === 'bottle')

  if (packetEnabled && packetGrams) {
    for (const g of [...new Set(packetGrams)].sort((a, b) => a - b)) {
      variants.push({ id: `packet-${g}g`, label: `${g} gm`, color: fill, image })
    }
  }
  if (bottleEnabled && bottleGrams) {
    for (const g of [...new Set(bottleGrams)].sort((a, b) => a - b)) {
      variants.push({ id: `bottle-${g}g`, label: `${g} gm`, color: fill, image })
    }
  }

  if (variants.length) return variants

  if (raw.variants?.length > 0) {
    return raw.variants.map((v) => ({
      id: v.id,
      label: v.label,
      color: v.color || fill,
      image: v.image || image,
    }))
  }

  return [{ id: 'packet-100g', label: '100 gm', color: fill, image }]
}

function bottleFieldsForList(raw) {
  return {
    bottlePrice: raw.bottlePrice,
    bottleShowDiscountedPrice: Boolean(raw.bottleShowDiscountedPrice),
    bottleDiscountedPrice: raw.bottleDiscountedPrice,
    bottleShortDescription: raw.bottleShortDescription || '',
    bottleDescription: raw.bottleDescription || '',
  }
}

function packFieldsForList(raw) {
  const packFormat = raw.packFormat === 'bottle' ? 'bottle' : 'packet'
  return {
    packFormat,
    packetEnabled: packFormat === 'packet' && raw.packetEnabled !== false,
    bottleEnabled: packFormat === 'bottle',
    packetGrams:
      Array.isArray(raw.packetGrams) && raw.packetGrams.length
        ? [...new Set(raw.packetGrams)].sort((a, b) => a - b)
        : [100],
    bottleGrams:
      Array.isArray(raw.bottleGrams) && raw.bottleGrams.length
        ? [...new Set(raw.bottleGrams)].sort((a, b) => a - b)
        : [100],
    ...bottleFieldsForList(raw),
  }
}

productSchema.methods.toPublicJSON = function toPublicJSON() {
  const images = (this.images?.length ? this.images : this.image ? [this.image] : []).slice(0, 4)
  return {
    id: this._id.toString(),
    name: this.name,
    shortDescription: this.shortDescription || '',
    description: this.description,
    category: this.category,
    brand: this.brand,
    fill: this.fill,
    showPanelBg: this.showPanelBg !== false,
    lightText: this.lightText,
    image: images[0] || this.image || '',
    images,
    price: this.price,
    showDiscountedPrice: this.showDiscountedPrice,
    discountedPrice: this.discountedPrice,
    compareAt: this.compareAt,
    outOfStock: this.outOfStock || this.stock <= 0,
    stock: this.stock,
    rating: this.rating,
    reviews: this.reviews,
    ...packFieldsForList(this),
    variants: buildVariantsFromPackFields(this),
    sales: this.sales,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

/** Lightweight payload for shop grid — one image, no duplicate variant blobs. */
function publicImageRef(src) {
  if (!src || typeof src !== 'string') return ''
  if (src.startsWith('data:')) return ''
  return src
}

export function serializeProductList(doc) {
  const raw = doc?.toObject ? doc.toObject() : doc
  const images = (raw.images?.length ? raw.images : raw.image ? [raw.image] : []).slice(0, 4)
  const primaryImage = publicImageRef(images[0] || raw.image || '')
  const variants = buildVariantsFromPackFields(raw).map((v) => ({
    id: v.id,
    label: v.label,
    color: v.color || raw.fill || '#0a2e22',
    image: '',
  }))

  return {
    id: raw._id?.toString?.() ?? String(raw.id),
    name: raw.name,
    shortDescription: raw.shortDescription || '',
    description: raw.description || '',
    category: raw.category,
    brand: raw.brand,
    image: primaryImage,
    images: primaryImage ? [primaryImage] : [],
    hasStoredImage: Boolean(raw.hasImage ?? images.some((src) => src?.startsWith?.('data:'))),
    price: raw.price,
    showDiscountedPrice: raw.showDiscountedPrice,
    discountedPrice: raw.discountedPrice,
    compareAt: raw.compareAt,
    outOfStock: raw.outOfStock || raw.stock <= 0,
    rating: raw.rating,
    reviews: raw.reviews,
    ...packFieldsForList(raw),
    variants,
  }
}

/** Admin catalog list — metadata without embedded base64 blobs. */
export function serializeProductAdminList(doc) {
  const raw = doc?.toObject ? doc.toObject() : doc
  return {
    ...serializeProductList(raw),
    fill: raw.fill || '#0a2e22',
    showPanelBg: raw.showPanelBg !== false,
    lightText: raw.lightText,
    stock: raw.stock,
    compareAt: raw.compareAt,
    sales: raw.sales,
    isActive: raw.isActive !== false,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  }
}

productSchema.methods.toListJSON = function toListJSON() {
  return serializeProductList(this)
}

export const Product = mongoose.model('Product', productSchema)
