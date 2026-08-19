import type { ReactNode } from 'react'
import { APP_ROUTES, navigateApp } from '../../lib/appRoutes'

const INK = '#0a2e22'
const CREAM = '#f2f4f5'
const GOLD = '#b8860b'
const PAGE = '#f2f4f5'
const TEXTURE = '/image.png_2K_202608092240.jpeg'
const MUTED = 'rgba(10,46,34,0.58)'

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M5 12.5 10 17l9-10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export type CheckoutFlowStep = 1 | 2 | 3

/** Cart → Review → Checkout progress — circles, gold border, label below. */
export function CheckoutFlowStepper({ step }: { step: CheckoutFlowStep }) {
  const steps = [
    { n: 1 as const, label: 'Cart', path: APP_ROUTES.cart },
    { n: 2 as const, label: 'Review', path: APP_ROUTES.cart },
    { n: 3 as const, label: 'Checkout', path: APP_ROUTES.checkout },
  ]

  return (
    <ol className="flex w-full max-w-lg items-start justify-between" aria-label="Checkout progress">
      {steps.map((s, i) => {
        const done = step > s.n
        const active = step === s.n
        const prevDone = i > 0 && step > steps[i - 1]!.n

        return (
          <li key={s.label} className="flex min-w-0 flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <span
                className="h-px flex-1"
                style={{
                  backgroundColor: i === 0 ? 'transparent' : prevDone ? GOLD : 'rgba(10,46,34,0.18)',
                }}
                aria-hidden
              />
              <button
                type="button"
                onClick={() => navigateApp(s.path)}
                className="flex shrink-0 cursor-pointer flex-col items-center border-0 bg-transparent p-0"
                aria-current={active ? 'step' : undefined}
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[0.78rem] font-bold transition"
                  style={{
                    backgroundColor: done ? INK : 'transparent',
                    color: done ? CREAM : active ? INK : MUTED,
                    border: `2px solid ${active || done ? GOLD : 'rgba(184,134,11,0.45)'}`,
                    boxShadow: active ? '0 0 0 3px rgba(184,134,11,0.18)' : undefined,
                  }}
                >
                  {done ? <CheckIcon className="h-4 w-4 text-[#f2f4f5]" /> : s.n}
                </span>
              </button>
              <span
                className="h-px flex-1"
                style={{
                  backgroundColor:
                    i === steps.length - 1 ? 'transparent' : step > s.n ? GOLD : 'rgba(10,46,34,0.18)',
                }}
                aria-hidden
              />
            </div>
            <span
              className="mt-2 text-center text-[0.72rem] font-semibold sm:text-[0.78rem]"
              style={{
                color: active || done ? INK : MUTED,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {s.label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export function CheckoutFlowStepperBar({ step }: { step: CheckoutFlowStep }) {
  return (
    <div style={{ backgroundColor: 'transparent' }}>
      <div className="mx-auto flex max-w-6xl justify-center px-4 py-4 sm:px-6 lg:px-8">
        <CheckoutFlowStepper step={step} />
      </div>
    </div>
  )
}

/** Shared light creamy textured shell used by cart + checkout. */
export function CheckoutFlowShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: PAGE }}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url(${TEXTURE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'brightness(1.55) saturate(0.35) contrast(0.88)',
          opacity: 0.4,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, rgba(242,244,245,0.88) 0%, rgba(242,244,245,0.55) 48%, rgba(242,244,245,0.92) 100%),
            radial-gradient(ellipse 70% 45% at 80% 0%, rgba(255,252,245,0.65) 0%, transparent 60%)
          `,
        }}
        aria-hidden
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}
