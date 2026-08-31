import { GRAM_STEP, DEFAULT_GRAM } from '../../lib/shopCatalog'

const INK = '#0a2e22'
const GOLD = '#b8860b'
const MUTED = 'rgba(10,46,34,0.55)'
const LINE = 'rgba(10,46,34,0.08)'

type AdminGramEditorProps = {
  label: string
  grams: number[]
  onChange: (grams: number[]) => void
  enabled?: boolean
  onEnabledChange?: (enabled: boolean) => void
}

export default function AdminGramEditor({
  label,
  grams,
  onChange,
  enabled = true,
  onEnabledChange,
}: AdminGramEditorProps) {
  const sorted = grams.length ? [...grams].sort((a, b) => a - b) : [DEFAULT_GRAM]

  const adjustAt = (index: number, delta: number) => {
    const next = [...sorted]
    next[index] = Math.max(GRAM_STEP, next[index] + delta)
    onChange([...new Set(next)].sort((a, b) => a - b))
  }

  const removeAt = (index: number) => {
    if (sorted.length <= 1) return
    onChange(sorted.filter((_, i) => i !== index))
  }

  const addMore = () => {
    const last = sorted[sorted.length - 1] ?? DEFAULT_GRAM
    onChange([...sorted, last + GRAM_STEP].sort((a, b) => a - b))
  }

  return (
    <div
      className="rounded-xl border p-3"
      style={{
        borderColor: enabled ? 'rgba(184,134,11,0.35)' : LINE,
        backgroundColor: enabled ? 'rgba(184,134,11,0.06)' : '#f7faf8',
        opacity: enabled ? 1 : 0.72,
      }}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="m-0 text-[0.82rem] font-semibold" style={{ color: INK }}>
          {label}
        </p>
        {onEnabledChange ? (
          <label className="flex cursor-pointer items-center gap-1.5 text-[0.72rem]" style={{ color: MUTED }}>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => onEnabledChange(e.target.checked)}
            />
            Offer this pack
          </label>
        ) : null}
      </div>

      {enabled ? (
        <>
          <p className="m-0 mb-2 text-[0.68rem]" style={{ color: MUTED }}>
            Adjust quantities in {GRAM_STEP} gm steps. Default starts at {DEFAULT_GRAM} gm.
          </p>
          <div className="space-y-2">
            {sorted.map((g, i) => (
              <div
                key={`${g}-${i}`}
                className="flex items-center justify-between gap-2 rounded-lg border px-2 py-1.5"
                style={{ borderColor: LINE, backgroundColor: '#fff' }}
              >
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => adjustAt(i, -GRAM_STEP)}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-0 text-[0.95rem] font-bold"
                    style={{ backgroundColor: 'rgba(10,46,34,0.08)', color: INK }}
                    aria-label={`Decrease ${g} gm by ${GRAM_STEP}`}
                  >
                    −
                  </button>
                  <span
                    className="min-w-[4.5rem] text-center text-[0.82rem] font-semibold tabular-nums"
                    style={{ color: INK }}
                  >
                    {g} gm
                  </span>
                  <button
                    type="button"
                    onClick={() => adjustAt(i, GRAM_STEP)}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-0 text-[0.95rem] font-bold"
                    style={{ backgroundColor: GOLD, color: INK }}
                    aria-label={`Increase ${g} gm by ${GRAM_STEP}`}
                  >
                    +
                  </button>
                </div>
                {sorted.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    className="cursor-pointer border-0 bg-transparent text-[0.65rem] font-semibold"
                    style={{ color: '#a32020' }}
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addMore}
            className="mt-2 w-full cursor-pointer rounded-lg border border-dashed px-3 py-2 text-[0.72rem] font-semibold"
            style={{ borderColor: 'rgba(184,134,11,0.45)', color: GOLD, backgroundColor: 'transparent' }}
          >
            + Add more quantity
          </button>
        </>
      ) : (
        <p className="m-0 text-[0.68rem]" style={{ color: MUTED }}>
          Enable to configure gram options for this pack type.
        </p>
      )}
    </div>
  )
}
