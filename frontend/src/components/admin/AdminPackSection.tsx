import type { CSSProperties } from 'react'
import AdminGramEditor from './AdminGramEditor'

const INK = '#0a2e22'
const MUTED = 'rgba(10,46,34,0.55)'
const LINE = 'rgba(10,46,34,0.08)'
const CARD = '#ffffff'

function formatPriceDisplay(value: number): string {
  return value > 0 ? String(value) : ''
}

function parsePriceInput(raw: string): number {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return 0
  return Number.parseInt(digits, 10)
}

type PriceInputProps = {
  value: number
  onChange: (value: number) => void
  className?: string
  style?: CSSProperties
  placeholder?: string
}

function PriceInput({ value, onChange, className, style, placeholder = '0' }: PriceInputProps) {
  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      className={className}
      style={style}
      value={formatPriceDisplay(value)}
      placeholder={placeholder}
      onChange={(e) => onChange(parsePriceInput(e.target.value))}
    />
  )
}

export type PackFormFields = {
  enabled: boolean
  shortDescription: string
  description: string
  price: number
  showDiscountedPrice: boolean
  discountedPrice: number
  grams: number[]
}

type AdminPackSectionProps = {
  title: string
  subtitle: string
  fields: PackFormFields
  onChange: (patch: Partial<PackFormFields>) => void
  showEnableToggle?: boolean
}

export default function AdminPackSection({
  title,
  subtitle,
  fields,
  onChange,
  showEnableToggle = true,
}: AdminPackSectionProps) {
  return (
    <div
      className="space-y-3 rounded-xl border p-3"
      style={{
        borderColor: fields.enabled ? 'rgba(184,134,11,0.35)' : LINE,
        backgroundColor: fields.enabled ? 'rgba(184,134,11,0.05)' : '#f7faf8',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="m-0 text-[0.88rem] font-bold" style={{ color: INK }}>
            {title}
          </p>
          <p className="m-0 mt-0.5 text-[0.68rem]" style={{ color: MUTED }}>
            {subtitle}
          </p>
        </div>
        {showEnableToggle ? (
          <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-[0.72rem] font-semibold" style={{ color: INK }}>
            <input
              type="checkbox"
              checked={fields.enabled}
              onChange={(e) => onChange({ enabled: e.target.checked })}
            />
            Enabled
          </label>
        ) : null}
      </div>

      {fields.enabled ? (
        <>
          <label className="block text-[0.78rem]" style={{ color: MUTED }}>
            One-line description
            <span className="ml-1 text-[0.68rem] opacity-80">(shop card teaser)</span>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[0.9rem] outline-none"
              style={{ borderColor: LINE, color: INK, backgroundColor: CARD }}
              value={fields.shortDescription}
              maxLength={200}
              placeholder={`Short ${title.toLowerCase()} pitch…`}
              onChange={(e) => onChange({ shortDescription: e.target.value })}
            />
          </label>

          <label className="block text-[0.78rem]" style={{ color: MUTED }}>
            Long description
            <span className="ml-1 text-[0.68rem] opacity-80">(product detail)</span>
            <textarea
              className="mt-1 min-h-[5.5rem] w-full resize-y rounded-xl border px-3 py-2.5 text-[0.9rem] outline-none"
              style={{ borderColor: LINE, color: INK, backgroundColor: CARD }}
              value={fields.description}
              maxLength={2000}
              placeholder="Taste notes, ingredients, storage…"
              onChange={(e) => onChange({ description: e.target.value })}
            />
          </label>

          <label className="block text-[0.78rem]" style={{ color: MUTED }}>
            Price (₹)
            <PriceInput
              className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[0.9rem] outline-none"
              style={{ borderColor: LINE, color: INK, backgroundColor: CARD }}
              value={fields.price}
              onChange={(price) => onChange({ price })}
            />
          </label>

          <label
            className="flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-[0.85rem]"
            style={{ borderColor: LINE, color: INK, backgroundColor: CARD }}
          >
            <input
              type="checkbox"
              checked={fields.showDiscountedPrice}
              onChange={(e) => onChange({ showDiscountedPrice: e.target.checked })}
            />
            Show discounted price
          </label>

          {fields.showDiscountedPrice ? (
            <label className="block text-[0.78rem]" style={{ color: MUTED }}>
              Discounted price (₹)
              <PriceInput
                className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[0.9rem] outline-none"
                style={{ borderColor: LINE, color: INK, backgroundColor: CARD }}
                value={fields.discountedPrice}
                onChange={(discountedPrice) => onChange({ discountedPrice })}
              />
            </label>
          ) : null}

          <AdminGramEditor
            label={`${title} quantities`}
            grams={fields.grams}
            onChange={(grams) => onChange({ grams })}
          />
        </>
      ) : (
        <p className="m-0 text-[0.68rem]" style={{ color: MUTED }}>
          Enable to configure pricing, copy, and gram options for this pack type.
        </p>
      )}
    </div>
  )
}
