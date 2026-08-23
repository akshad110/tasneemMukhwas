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
    description: { type: String, default: '', maxlength: 2000 },
    category: { type: String, required: true, trim: true },
    brand: { type: String, default: 'Tasneem', trim: true },
    fill: { type: String, default: '#0a2e22' },
    showPanelBg: { type: Boolean, default: true },
    lightText: { type: Boolean, default: true },
    image: { type: String, default: '' },
    images: { type: [String], default: [], validate: [(v) => v.length <= 3, 'Max 3 images'] },
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
    sales: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

productSchema.index({ name: 'text', category: 'text', brand: 'text' })
productSchema.index({ category: 1, outOfStock: 1, isActive: 1 })

productSchema.methods.toPublicJSON = function toPublicJSON() {
  const images = (this.images?.length ? this.images : this.image ? [this.image] : []).slice(0, 3)
  return {
    id: this._id.toString(),
    name: this.name,
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
    variants:
      this.variants?.length > 0
        ? this.variants
        : [
            {
              id: '100g',
              label: '100 gm',
              color: this.fill || '#0a2e22',
              image: images[0] || this.image || '',
            },
          ],
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
  const images = (raw.images?.length ? raw.images : raw.image ? [raw.image] : []).slice(0, 3)
  const primaryImage = publicImageRef(images[0] || raw.image || '')
  const variants =
    raw.variants?.length > 0
      ? raw.variants.map((v) => ({
          id: v.id,
          label: v.label,
          color: v.color || raw.fill || '#0a2e22',
          image: '',
        }))
      : [
          {
            id: '100g',
            label: '100 gm',
            color: raw.fill || '#0a2e22',
            image: '',
          },
        ]

  return {
    id: raw._id?.toString?.() ?? String(raw.id),
    name: raw.name,
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
