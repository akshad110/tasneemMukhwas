import { useMemo, useState, type ChangeEvent } from 'react'
import { useCatalog } from '../../context/CatalogContext'
import {
  extractPacketBackgroundColor,
  fillUsesLightText,
} from '../../lib/extractPacketBackgroundColor'
import { CATEGORIES, type ShopProduct } from '../../lib/shopCatalog'

const INK = '#0a2e22'
const CREAM = '#f2f4f5'
const GOLD = '#b8860b'
const MUTED = 'rgba(10,46,34,0.55)'
const CARD = '#ffffff'
const LINE = 'rgba(10,46,34,0.08)'

type Editable = {
  id: string
  name: string
  category: string
  price: number
  showDiscountedPrice: boolean
  discountedPrice: number
  outOfStock: boolean
  images: [string, string, string]
  description: string
  brand: string
  rating: number
  reviews: number
  fill: string
}

function toEditable(p: ShopProduct): Editable {
  const imgs = [...(p.images?.length ? p.images : [p.image]), '', '', ''].slice(0, 3) as [
    string,
    string,
    string,
  ]
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    showDiscountedPrice: Boolean(p.showDiscountedPrice),
    discountedPrice: p.discountedPrice ?? p.compareAt ?? Math.round(p.price * 0.85),
    outOfStock: Boolean(p.outOfStock),
    images: imgs,
    description: p.description,
    brand: p.brand,
    rating: p.rating,
    reviews: p.reviews,
    fill: p.fill || '#0a2e22',
  }
}

function toShopProduct(e: Editable, existing?: ShopProduct): ShopProduct {
  const images = e.images.map((x) => x.trim()).filter(Boolean).slice(0, 3)
  const image = images[0] ?? existing?.image ?? '/products/shahi-mukhwas.png'
  const gallery = images.length ? images : image ? [image] : []
  const fill = e.fill || existing?.fill || '#0a2e22'

  const variants = existing?.variants?.length
    ? existing.variants.map((v, idx) => ({
        ...v,
        color: fill,
        image: idx === 0 ? gallery[0] || v.image : v.image,
      }))
    : [
        {
          id: 'default',
          label: 'Default',
          color: fill,
          image,
        },
      ]

  return {
    id: e.id,
    name: e.name.trim(),
    description: e.description.trim() || existing?.description || e.name.trim(),
    image,
    images: gallery,
    fill,
    lightText: fillUsesLightText(fill),
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
  }
}

function stockStatus(outOfStock: boolean) {
  if (outOfStock) return { label: 'Out of Stock', bg: '#f8d7d4', fg: '#a32020' }
  return { label: 'In Stock', bg: '#d8f3e0', fg: '#1b7a3e' }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export default function AdminProducts() {
  const { products, upsertProduct, removeProduct, refresh } = useCatalog()
  const [editing, setEditing] = useState<Editable | null>(null)
  const [creating, setCreating] = useState(false)
  const [q, setQ] = useState('')
  const [saving, setSaving] = useState(false)

  const rows = useMemo(() => products.map(toEditable), [products])

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
    category: CATEGORIES[0],
    price: 199,
    showDiscountedPrice: false,
    discountedPrice: 149,
    outOfStock: false,
    images: ['', '', ''],
    description: '',
    brand: 'Tasneem',
    rating: 5,
    reviews: 0,
    fill: '#0a2e22',
  })

  const save = async (row: Editable) => {
    if (!row.name.trim()) return
    if (row.showDiscountedPrice && !(row.discountedPrice > 0)) return
    setSaving(true)
    try {
      // New products use a temp id that is not in `products`, so upsert creates via API
      const existing = creating ? undefined : products.find((p) => p.id === row.id)
      await upsertProduct(toShopProduct(row, existing))
      await refresh()
      setEditing(null)
      setCreating(false)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    await removeProduct(id)
    if (editing?.id === id) setEditing(null)
  }

  const setImageAt = async (index: 0 | 1 | 2, e: ChangeEvent<HTMLInputElement>) => {
    if (!editing) return
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await readFileAsDataUrl(file)
    const images = [...editing.images] as [string, string, string]
    images[index] = dataUrl

    let fill = editing.fill
    if (index === 0) {
      fill = await extractPacketBackgroundColor(dataUrl)
    }

    setEditing({ ...editing, images, fill })
    e.target.value = ''
  }

  const clearImageAt = (index: 0 | 1 | 2) => {
    if (!editing) return
    const images = [...editing.images] as [string, string, string]
    images[index] = ''
    setEditing({ ...editing, images })
  }

  const form = editing

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
              const thumb = r.images.find(Boolean) || '/products/shahi-mukhwas.png'
              return (
                <tr key={r.id} className="border-t" style={{ borderColor: LINE }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={thumb}
                        alt=""
                        className="h-10 w-10 rounded-lg object-contain"
                        style={{ backgroundColor: r.fill }}
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
                          setCreating(false)
                          setEditing({ ...r })
                        }}
                        className="cursor-pointer rounded-lg border-0 px-2.5 py-1.5 text-[0.72rem] font-semibold"
                        style={{ backgroundColor: '#e9f5ee', color: INK }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void remove(r.id)}
                        className="cursor-pointer rounded-lg border-0 px-2.5 py-1.5 text-[0.72rem] font-semibold"
                        style={{ backgroundColor: '#f8d7d4', color: '#a32020' }}
                      >
                        Delete
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
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border p-5 shadow-xl [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ backgroundColor: CARD, borderColor: LINE }}
          >
            <h2 className="m-0 text-[1.15rem] font-bold" style={{ color: INK }}>
              {creating ? 'Add product' : 'Edit product'}
            </h2>
            <div className="mt-4 space-y-3">
              <div>
                <p className="m-0 mb-2 text-[0.78rem]" style={{ color: MUTED }}>
                  Images (optional — up to 3). Primary image auto-detects panel color.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {([0, 1, 2] as const).map((i) => (
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
                        style={{ backgroundColor: form.images[i] ? form.fill : '#f2f4f5' }}
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
                {form.images[0] ? (
                  <div
                    className="mt-2 flex items-center gap-2 rounded-xl border px-3 py-2 text-[0.75rem]"
                    style={{ borderColor: LINE, color: MUTED }}
                  >
                    <span
                      className="h-5 w-5 shrink-0 rounded-md border"
                      style={{ backgroundColor: form.fill, borderColor: LINE }}
                      aria-hidden
                    />
                    Panel color detected from image:{' '}
                    <span className="font-semibold" style={{ color: INK }}>
                      {form.fill}
                    </span>
                  </div>
                ) : null}
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

              <label className="block text-[0.78rem]" style={{ color: MUTED }}>
                Product category
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[0.9rem] outline-none"
                  style={{ borderColor: LINE, color: INK, backgroundColor: CARD }}
                  value={form.category}
                  onChange={(e) => setEditing({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

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

              <label className="block text-[0.78rem]" style={{ color: MUTED }}>
                Real price (₹)
                <input
                  type="number"
                  min={1}
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[0.9rem] outline-none"
                  style={{ borderColor: LINE, color: INK }}
                  value={form.price}
                  onChange={(e) => setEditing({ ...form, price: Number(e.target.value) })}
                />
              </label>

              <label
                className="flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-[0.85rem]"
                style={{ borderColor: LINE, color: INK }}
              >
                <input
                  type="checkbox"
                  checked={form.showDiscountedPrice}
                  onChange={(e) =>
                    setEditing({ ...form, showDiscountedPrice: e.target.checked })
                  }
                />
                Show discounted price
              </label>

              {form.showDiscountedPrice && (
                <label className="block text-[0.78rem]" style={{ color: MUTED }}>
                  Discounted price (₹)
                  <input
                    type="number"
                    min={1}
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[0.9rem] outline-none"
                    style={{ borderColor: LINE, color: INK }}
                    value={form.discountedPrice}
                    onChange={(e) =>
                      setEditing({ ...form, discountedPrice: Number(e.target.value) })
                    }
                  />
                </label>
              )}
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
                disabled={saving}
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
