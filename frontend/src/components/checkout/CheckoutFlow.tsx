import type { ReactNode } from 'react'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'

const INK = '#0a2e22'
const CREAM = '#f3e6c8'
const GOLD = '#b8860b'
const TEXTURE = '/image.png_2K_202608092240.jpeg'
const MUTED = 'rgba(243,230,200,0.62)'

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M5 12.5 10 17l9-10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export type CheckoutFlowStep = 1 | 2 | 3

/** Cart → Review → Checkout progress (sharp squares, brand colors). */
export function CheckoutFlowStepper({ step }: { step: CheckoutFlowStep }) {
  const steps = [
    { n: 1 as const, label: 'Cart', path: APP_ROUTES.cart },
    { n: 2 as const, label: 'Review', path: APP_ROUTES.cart },
    { n: 3 as const, label: 'Checkout', path: APP_ROUTES.checkout },
  ]

  return (
    <ol className="flex flex-wrap items-center justify-center gap-2 sm:gap-3" aria-label="Checkout progress">
      {steps.map((s, i) => {
        const done = step > s.n
        const active = step === s.n

        return (
          <li key={s.label} className="flex items-center gap-2 sm:gap-3">
            {i > 0 && (
              <span
                className="hidden h-px w-6 sm:block sm:w-10"
                style={{ backgroundColor: step > s.n - 1 ? GOLD : 'rgba(243,230,200,0.25)' }}
                aria-hidden
              />
            )}
            <button
              type="button"
              onClick={() => navigateApp(s.path)}
              className="inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0"
              aria-current={active ? 'step' : undefined}
            >
              <span
                className="flex h-7 w-7 items-center justify-center text-[0.72rem] font-bold"
                style={{
                  borderRadius: 0,
                  backgroundColor: done || active ? CREAM : 'transparent',
                  color: done || active ? INK : MUTED,
                  border: done || active ? 'none' : `1.5px solid rgba(243,230,200,0.3)`,
                  boxShadow: active ? `0 0 0 2px rgba(184,134,11,0.4)` : undefined,
                }}
              >
                {done ? <CheckIcon className="h-3.5 w-3.5" /> : s.n}
              </span>
              <span
                className="text-[0.78rem] font-semibold"
                style={{
                  color: active || done ? CREAM : MUTED,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {s.label}
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}

export function CheckoutFlowStepperBar({ step }: { step: CheckoutFlowStep }) {
  return (
    <div
      className="border-b"
      style={{
        borderColor: 'rgba(243,230,200,0.14)',
        backgroundColor: 'rgba(4,17,12,0.55)',
      }}
    >
      <div className="mx-auto flex max-w-6xl justify-center px-4 py-3.5 sm:px-6 lg:px-8">
        <CheckoutFlowStepper step={step} />
      </div>
    </div>
  )
}

/** Shared dark textured shell used by cart + checkout. */
export function CheckoutFlowShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: INK }}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url(${TEXTURE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(4,17,12,0.58) 0%, rgba(4,17,12,0.48) 45%, rgba(4,17,12,0.68) 100%)',
        }}
        aria-hidden
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}
