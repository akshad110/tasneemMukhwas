import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { useCatalog } from '../../context/CatalogContext'
import { compressProductImage } from '../../lib/compressProductImage'
import {
  getCachedProductImages,
  loadProductImages,
  queueAdminProductImage,
  subscribeProductImages,
} from '../../lib/productImageCache'
import AdminPackSection from './AdminPackSection'
import {
  DEFAULT_CATEGORIES,
  DEFAULT_GRAM,
  PRODUCT_CARD_PANEL_BG,
  PRODUCT_MAX_GALLERY_IMAGES,
  buildAllPackVariants,
  parseGramOptionsFromVariants,
  type ShopProduct,
} from '../../lib/shopCatalog'

const INK = '#0a2e22'
const CREAM = '#f2f4f5'
const GOLD = '#b8860b'
const MUTED = 'rgba(10,46,34,0.55)'
const CARD = '#ffffff'
const LINE = 'rgba(10,46,34,0.08)'

const BRAND_FILL = '#0a2e22'

type ProductImageSlots = [string, string, string, string]

type Editable = {
  id: string
  name: string
  category: string
  price: number
  showDiscountedPrice: boolean
  discountedPrice: number
  outOfStock: boolean
  images: ProductImageSlots
  shortDescription: string
  description: string
  brand: string
  rating: number
  reviews: number
  packetEnabled: boolean
  bottleEnabled: boolean
  packetGrams: number[]
  bottleGrams: number[]
  bottlePrice: number
  bottleShowDiscountedPrice: boolean
  bottleDiscountedPrice: number
  bottleShortDescription: string
  bottleDescription: string
}

function padImageSlots(images: string[]): ProductImageSlots {
  return [...images, '', '', '', ''].slice(0, PRODUCT_MAX_GALLERY_IMAGES) as ProductImageSlots
}

function toEditable(p: ShopProduct): Editable {
  const imgs = padImageSlots(p.images?.length ? p.images : [p.image])
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    showDiscountedPrice: Boolean(p.showDiscountedPrice),
    discountedPrice: p.discountedPrice ?? p.compareAt ?? Math.round(p.price * 0.85),
    outOfStock: Boolean(p.outOfStock),
    images: imgs,
    shortDescription: p.shortDescription ?? '',
    description: p.description,
    brand: p.brand,
    rating: p.rating,
    reviews: p.reviews,
    packetEnabled: p.packetEnabled !== false,
    bottleEnabled: Boolean(p.bottleEnabled),
    packetGrams: p.packetGrams?.length
      ? [...p.packetGrams]
      : parseGramOptionsFromVariants(p.variants, 'packet'),
    bottleGrams: p.bottleGrams?.length
      ? [...p.bottleGrams]
      : parseGramOptionsFromVariants(p.variants, 'bottle'),
    bottlePrice: p.bottlePrice ?? p.price,
    bottleShowDiscountedPrice: Boolean(p.bottleShowDiscountedPrice),
    bottleDiscountedPrice: p.bottleDiscountedPrice ?? Math.round((p.bottlePrice ?? p.price) * 0.85),
    bottleShortDescription: p.bottleShortDescription ?? '',
    bottleDescription: p.bottleDescription ?? '',
  }
}

function toShopProduct(e: Editable, existing?: ShopProduct): ShopProduct {
  const images = e.images.map((x) => x.trim()).filter(Boolean).slice(0, PRODUCT_MAX_GALLERY_IMAGES)
  const image = images[0] ?? existing?.image ?? '/products/shahi-mukhwas.png'
  const gallery = images.length ? images : image ? [image] : []
  const fill = existing?.fill || BRAND_FILL
  const packetGrams = e.packetGrams.length ? [...e.packetGrams].sort((a, b) => a - b) : [DEFAULT_GRAM]
  const bottleGrams = e.bottleGrams.length ? [...e.bottleGrams].sort((a, b) => a - b) : [DEFAULT_GRAM]
  const variants = buildAllPackVariants(packetGrams, bottleGrams, fill, gallery[0] || image, {
    packetEnabled: e.packetEnabled,
    bottleEnabled: e.bottleEnabled,
  })

  return {
    id: e.id,
    name: e.name.trim(),
    shortDescription: e.shortDescription.trim(),
    description: e.description.trim() || existing?.description || e.shortDescription.trim() || e.name.trim(),
    image,
    images: gallery,
    fill,
    lightText: false,
    price: e.price,
    showDiscountedPrice: e.showDiscountedPrice,
    discountedPrice: e.showDiscountedPrice ? e.discountedPrice : undefined,
    compareAt: e.showDiscountedPrice ? e.price : existing?.compareAt,
    outOfStock: e.outOfStock,
    category: e.category,
    rating: e.rating || existing?.rating || 5,
    reviews: e.reviews || existing?.reviews || 0,
    brand: e.brand || existing?.brand || 'Tasneem',
    variants,
    packetEnabled: e.packetEnabled,
    bottleEnabled: e.bottleEnabled,
    packetGrams,
    bottleGrams,
    bottlePrice: e.bottleEnabled ? e.bottlePrice : undefined,
    bottleShowDiscountedPrice: e.bottleEnabled ? e.bottleShowDiscountedPrice : false,
    bottleDiscountedPrice: e.bottleEnabled && e.bottleShowDiscountedPrice ? e.bottleDiscountedPrice : undefined,
    bottleShortDescription: e.bottleEnabled ? e.bottleShortDescription.trim() : '',
    bottleDescription: e.bottleEnabled ? e.bottleDescription.trim() : '',
  }
}

function stockStatus(outOfStock: boolean) {
  if (outOfStock) return { label: 'Out of Stock', bg: '#f8d7d4', fg: '#a32020' }
  return { label: 'In Stock', bg: '#d8f3e0', fg: '#1b7a3e' }
}

function AdminProductThumb({
  productId,
  inline,
  needsFetch,
}: {
  productId: string
  inline?: string
  needsFetch?: boolean
}) {
  const [src, setSrc] = useState<string | null>(() => inline || getCachedProductImages(productId)[0] || null)

  useEffect(() => {
    const cached = getCachedProductImages(productId)
    if (cached[0]) {
      setSrc(cached[0])
      return
    }
    if (!needsFetch) return
    queueAdminProductImage(productId)
  }, [productId, needsFetch])

  useEffect(() => {
    return subscribeProductImages((id) => {
      if (id !== productId) return
      const next = getCachedProductImages(productId)[0]
      if (next) setSrc(next)
    })
  }, [productId])

  if (!src) {
    return (
      <div
        className="h-10 w-10 shrink-0 rounded-lg animate-pulse"
        style={{ backgroundColor: PRODUCT_CARD_PANEL_BG }}
        aria-hidden
      />
    )
  }

  return (
    <img
      src={src}
      alt=""
      className="h-10 w-10 shrink-0 rounded-lg object-contain"
      style={{ backgroundColor: PRODUCT_CARD_PANEL_BG }}
    />
  )
}

export default function AdminProducts() {
  const { products, categories, categoryItems, upsertProduct, removeProduct, ensureLoaded, addCategory, removeCategory } =
    useCatalog()
  const [editing, setEditing] = useState<Editable | null>(null)
  const [creating, setCreating] = useState(false)
  const [q, setQ] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [categoryBusy, setCategoryBusy] = useState(false)

  const categoryOptions = categories.length ? categories : [...DEFAULT_CATEGORIES]

  useEffect(() => {
    void ensureLoaded()
  }, [ensureLoaded])

  const rows = useMemo(() => products.map(toEditable), [products])
  const productById = useMemo(() => new Map(products.map((p) => [p.id, p])), [products])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return rows
    return rows.filter(
      (r) => r.name.toLowerCase().includes(s) || r.category.toLowerCase().includes(s),
    )
  }, [q, rows])

  const blank = (): Editable => ({
    // Temporary client id — CatalogContext creates via API when id is not in list
    id: `prod-${Date.now()}`,
    name: '',
    category: categoryOptions[0] ?? DEFAULT_CATEGORIES[0],
    price: 199,
    showDiscountedPrice: false,
    discountedPrice: 149,
    outOfStock: false,
    images: ['', '', '', ''],
    shortDescription: '',
    description: '',
    brand: 'Tasneem',
    rating: 5,
    reviews: 0,
    packetEnabled: true,
    bottleEnabled: false,
    packetGrams: [DEFAULT_GRAM],
    bottleGrams: [DEFAULT_GRAM],
    bottlePrice: 199,
    bottleShowDiscountedPrice: false,
    bottleDiscountedPrice: 149,
    bottleShortDescription: '',
    bottleDescription: '',
  })

  const packConfigValid = (row: Editable) => {
    if (!row.packetEnabled && !row.bottleEnabled) return false
    if (row.packetEnabled && (!row.packetGrams.length || !(row.price > 0))) return false
    if (row.bottleEnabled && (!row.bottleGrams.length || !(row.bottlePrice > 0))) return false
    if (row.packetEnabled && row.showDiscountedPrice && !(row.discountedPrice > 0)) return false
    if (row.bottleEnabled && row.bottleShowDiscountedPrice && !(row.bottleDiscountedPrice > 0)) return false
    return true
  }

  const save = async (row: Editable) => {
    if (!row.name.trim()) return
    if (!packConfigValid(row)) return
    setSaving(true)
    try {
      // New products use a temp id that is not in `products`, so upsert creates via API
      const existing = creating ? undefined : products.find((p) => p.id === row.id)
      await upsertProduct(toShopProduct(row, existing))
      setEditing(null)
      setCreating(false)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (deletingId) return
    setDeletingId(id)
    try {
      await removeProduct(id)
      if (editing?.id === id) setEditing(null)
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not delete product. Try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const setImageAt = async (index: 0 | 1 | 2 | 3, e: ChangeEvent<HTMLInputElement>) => {
    if (!editing) return
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await compressProductImage(file)
    const images = [...editing.images] as ProductImageSlots
    images[index] = dataUrl
    setEditing({ ...editing, images })
    e.target.value = ''
  }

  const clearImageAt = (index: 0 | 1 | 2 | 3) => {
    if (!editing) return
    const images = [...editing.images] as ProductImageSlots
    images[index] = ''
    setEditing({ ...editing, images })
  }

  const form = editing

  const createCategory = async () => {
    const name = newCategoryName.trim()
    if (!name || categoryBusy) return
    setCategoryBusy(true)
    try {
      const created = await addCategory(name)
      setNewCategoryName('')
      if (form) setEditing({ ...form, category: created })
    } finally {
      setCategoryBusy(false)
    }
  }

  const deleteSelectedCategory = async () => {
    if (!form || categoryBusy) return
    const item = categoryItems.find((c) => c.name === form.category)
    if (!item) {
      window.alert('This category cannot be deleted from here.')
      return
    }
    const ok = window.confirm(`Delete category "${item.name}"? This cannot be undone.`)
    if (!ok) return
    setCategoryBusy(true)
    try {
      await removeCategory(item.id)
      const nextCategory = categoryOptions.find((c) => c !== item.name) ?? DEFAULT_CATEGORIES[0]
      setEditing({ ...form, category: nextCategory })
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not delete category.')
    } finally {
      setCategoryBusy(false)
    }
  }

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-sub">Create, edit, stock, and retire catalog items.</p>
        </div>
        <div className="admin-toolbar">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-xl border px-3 py-2.5 text-[0.85rem] outline-none sm:w-auto"
            style={{ borderColor: LINE, backgroundColor: CARD, color: INK }}
          />
          <button
            type="button"
            onClick={() => {
              setCreating(true)
              setEditing(blank())
            }}
            className="w-full cursor-pointer rounded-xl border-0 px-4 py-2.5 text-[0.82rem] font-semibold sm:w-auto"
            style={{ backgroundColor: GOLD, color: INK }}
          >
            + Add product
          </button>
        </div>
      </div>

      <div className="admin-table-wrap mt-5 overflow-hidden rounded-2xl border" style={{ backgroundColor: CARD, borderColor: LINE }}>
        <table className="w-full border-collapse text-left text-[0.85rem]">
          <thead>
            <tr style={{ backgroundColor: '#f3f8f4', color: MUTED }}>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const st = stockStatus(r.outOfStock)
              return (
                <tr key={r.id} className="border-t" style={{ borderColor: LINE }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <AdminProductThumb
                        productId={r.id}
                        inline={r.images.find(Boolean) || undefined}
                        needsFetch={productById.get(r.id)?.hasStoredImage !== false}
                      />
                      <span className="font-semibold" style={{ color: INK }}>
                        {r.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: MUTED }}>
                    {r.category}
                  </td>
                  <td className="px-4 py-3 font-semibold" style={{ color: INK }}>
                    {r.showDiscountedPrice ? (
                      <span className="inline-flex items-baseline gap-1.5">
                        <span style={{ color: GOLD }}>₹{r.discountedPrice}</span>
                        <span className="text-[0.75rem] font-normal line-through" style={{ color: MUTED }}>
                          ₹{r.price}
                        </span>
                      </span>
                    ) : (
                      <>₹{r.price}</>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="rounded-full px-2.5 py-1 text-[0.68rem] font-semibold"
                      style={{ backgroundColor: st.bg, color: st.fg }}
                    >
                      {st.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          void (async () => {
                            setCreating(false)
                            const row = { ...r }
                            if (!row.images.find(Boolean)) {
                              try {
                                const data = await loadProductImages(r.id)
                                const gallery = (data.images?.length ? data.images : data.image ? [data.image] : []).slice(0, PRODUCT_MAX_GALLERY_IMAGES)
                                row.images = padImageSlots(gallery)
                              } catch {
                                /* keep empty slots */
                              }
                            }
                            setEditing(row)
                          })()
                        }}
                        className="cursor-pointer rounded-lg border-0 px-2.5 py-1.5 text-[0.72rem] font-semibold"
                        style={{ backgroundColor: '#e9f5ee', color: INK }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={deletingId === r.id}
                        onClick={() => void remove(r.id)}
                        className="cursor-pointer rounded-lg border-0 px-2.5 py-1.5 text-[0.72rem] font-semibold disabled:opacity-60"
                        style={{ backgroundColor: '#f8d7d4', color: '#a32020' }}
                      >
                        {deletingId === r.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {form && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal
          aria-label={creating ? 'Add product' : 'Edit product'}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border p-5 shadow-xl [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ backgroundColor: CARD, borderColor: LINE }}
          >
            <h2 className="m-0 text-[1.15rem] font-bold" style={{ color: INK }}>
              {creating ? 'Add product' : 'Edit product'}
            </h2>
            <div className="mt-4 space-y-3">
              <div>
                <p className="m-0 mb-2 text-[0.78rem]" style={{ color: MUTED }}>
                  Images (optional — up to 4). Mix packet and bottle photos; the shop carousel auto-slides through uploaded images only (1–4 dots).
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {([0, 1, 2, 3] as const).map((i) => (
                    <div
                      key={i}
                      className="rounded-xl border p-2"
                      style={{ borderColor: LINE, backgroundColor: '#f7faf8' }}
                    >
                      <p className="m-0 mb-1.5 text-center text-[0.65rem] font-semibold" style={{ color: MUTED }}>
                        Image {i + 1}
                      </p>
                      <div
                        className="mb-2 flex h-20 items-center justify-center overflow-hidden rounded-lg"
                        style={{
                          backgroundColor: PRODUCT_CARD_PANEL_BG,
                          border: '1px solid rgba(10,46,34,0.08)',
                        }}
                      >
                        {form.images[i] ? (
                          <img src={form.images[i]} alt="" className="h-full w-full object-contain object-center" />
                        ) : (
                          <span className="text-[0.65rem]" style={{ color: MUTED }}>
                            Optional
                          </span>
                        )}
                      </div>
                      <label className="block cursor-pointer text-center text-[0.68rem] font-semibold" style={{ color: INK }}>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => void setImageAt(i, e)}
                        />
                        Upload
                      </label>
                      {form.images[i] ? (
                        <button
                          type="button"
                          onClick={() => clearImageAt(i)}
                          className="mt-1 w-full cursor-pointer border-0 bg-transparent text-[0.62rem]"
                          style={{ color: '#a32020' }}
                        >
                          Clear
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <label className="block text-[0.78rem]" style={{ color: MUTED }}>
                Product name
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[0.9rem] outline-none"
                  style={{ borderColor: LINE, color: INK }}
                  value={form.name}
                  onChange={(e) => setEditing({ ...form, name: e.target.value })}
                  required
                />
              </label>

              <div>
                <p className="m-0 mb-2 text-[0.78rem] font-semibold" style={{ color: INK }}>
                  Product category
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <select
                    className="w-full flex-1 rounded-xl border px-3 py-2.5 text-[0.9rem] outline-none"
                    style={{ borderColor: LINE, color: INK, backgroundColor: CARD }}
                    value={form.category}
                    onChange={(e) => setEditing({ ...form, category: e.target.value })}
                  >
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={
                      categoryBusy ||
                      !categoryItems.some((c) => c.name === form.category)
                    }
                    onClick={() => void deleteSelectedCategory()}
                    className="shrink-0 cursor-pointer rounded-xl border px-3 py-2.5 text-[0.78rem] font-semibold disabled:opacity-50"
                    style={{ borderColor: 'rgba(163,32,32,0.28)', color: '#a32020', backgroundColor: '#fff' }}
                    title="Delete selected category"
                  >
                    Delete
                  </button>
                </div>
                <div className="mt-2 flex gap-2">
                  <input
                    className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-[0.85rem] outline-none"
                    style={{ borderColor: LINE, color: INK }}
                    placeholder="New category name…"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        void createCategory()
                      }
                    }}
                  />
                  <button
                    type="button"
                    disabled={categoryBusy || !newCategoryName.trim()}
                    onClick={() => void createCategory()}
                    className="shrink-0 cursor-pointer rounded-xl border-0 px-3 py-2 text-[0.78rem] font-semibold disabled:opacity-60"
                    style={{ backgroundColor: GOLD, color: INK }}
                  >
                    + Add
                  </button>
                </div>
              </div>

              {!creating && (
                <label
                  className="flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-[0.85rem]"
                  style={{ borderColor: LINE, color: INK }}
                >
                  <input
                    type="checkbox"
                    checked={form.outOfStock}
                    onChange={(e) => setEditing({ ...form, outOfStock: e.target.checked })}
                  />
                  Out of stock
                </label>
              )}

              <div className="space-y-3">
                <AdminPackSection
                  title="Packet"
                  subtitle="Pricing, copy, and gram options for pouch / packet packs."
                  fields={{
                    enabled: form.packetEnabled,
                    shortDescription: form.shortDescription,
                    description: form.description,
                    price: form.price,
                    showDiscountedPrice: form.showDiscountedPrice,
                    discountedPrice: form.discountedPrice,
                    grams: form.packetGrams,
                  }}
                  onChange={(patch) =>
                    setEditing({
                      ...form,
                      packetEnabled: patch.enabled ?? form.packetEnabled,
                      shortDescription: patch.shortDescription ?? form.shortDescription,
                      description: patch.description ?? form.description,
                      price: patch.price ?? form.price,
                      showDiscountedPrice: patch.showDiscountedPrice ?? form.showDiscountedPrice,
                      discountedPrice: patch.discountedPrice ?? form.discountedPrice,
                      packetGrams: patch.grams ?? form.packetGrams,
                    })
                  }
                />

                <AdminPackSection
                  title="Bottle"
                  subtitle="Separate pricing and description when sold as a bottle."
                  fields={{
                    enabled: form.bottleEnabled,
                    shortDescription: form.bottleShortDescription,
                    description: form.bottleDescription,
                    price: form.bottlePrice,
                    showDiscountedPrice: form.bottleShowDiscountedPrice,
                    discountedPrice: form.bottleDiscountedPrice,
                    grams: form.bottleGrams,
                  }}
                  onChange={(patch) =>
                    setEditing({
                      ...form,
                      bottleEnabled: patch.enabled ?? form.bottleEnabled,
                      bottleShortDescription: patch.shortDescription ?? form.bottleShortDescription,
                      bottleDescription: patch.description ?? form.bottleDescription,
                      bottlePrice: patch.price ?? form.bottlePrice,
                      bottleShowDiscountedPrice: patch.showDiscountedPrice ?? form.bottleShowDiscountedPrice,
                      bottleDiscountedPrice: patch.discountedPrice ?? form.bottleDiscountedPrice,
                      bottleGrams: patch.grams ?? form.bottleGrams,
                    })
                  }
                />

                {!packConfigValid(form) ? (
                  <p className="m-0 text-[0.72rem]" style={{ color: '#a32020' }}>
                    Enable at least one pack type with valid price and quantity options.
                  </p>
                ) : null}
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditing(null)
                  setCreating(false)
                }}
                className="cursor-pointer rounded-xl border px-4 py-2 text-[0.8rem] font-semibold"
                style={{ borderColor: LINE, backgroundColor: 'transparent', color: INK }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving || !packConfigValid(form)}
                onClick={() => void save(form)}
                className="cursor-pointer rounded-xl border-0 px-4 py-2 text-[0.8rem] font-semibold disabled:opacity-60"
                style={{ backgroundColor: INK, color: CREAM }}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
