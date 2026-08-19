export type RazorpayCheckoutOptions = {
  keyId: string
  orderId: string
  amount: number
  currency: string
  name: string
  description: string
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
}

type RazorpaySuccessResponse = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void
      on: (event: string, handler: (response: RazorpaySuccessResponse) => void) => void
    }
  }
}

const SCRIPT_ID = 'razorpay-checkout-js'
const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js'

let scriptPromise: Promise<void> | null = null

export function loadRazorpayScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'))
  if (window.Razorpay) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Razorpay script failed')))
      if (window.Razorpay) resolve()
      return
    }
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Razorpay script failed'))
    document.body.appendChild(script)
  })

  return scriptPromise
}

export function openRazorpayCheckout(
  opts: RazorpayCheckoutOptions,
  handlers: {
    onSuccess: (payload: RazorpaySuccessResponse) => void
    onDismiss?: () => void
  },
): Promise<void> {
  return loadRazorpayScript().then(() => {
    if (!window.Razorpay) throw new Error('Razorpay unavailable')

    const key =
      opts.keyId ||
      (import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined) ||
      (import.meta.env.VITE_RAZOPAY_API_KEY as string | undefined) ||
      ''

    if (!key) throw new Error('Razorpay key is not configured')

    const rzp = new window.Razorpay({
      key,
      amount: opts.amount,
      currency: opts.currency,
      name: opts.name,
      description: opts.description,
      order_id: opts.orderId,
      prefill: opts.prefill,
      theme: { color: '#0a2e22' },
      handler: (response: RazorpaySuccessResponse) => handlers.onSuccess(response),
      modal: {
        ondismiss: () => handlers.onDismiss?.(),
      },
    })

    rzp.open()
  })
}
