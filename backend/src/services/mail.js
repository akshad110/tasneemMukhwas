import { Resend } from 'resend'
import { env } from '../config/env.js'

let resendClient = null

function getResend() {
  if (!env.resendApiKey) return null
  if (!resendClient) resendClient = new Resend(env.resendApiKey)
  return resendClient
}

export function isMailConfigured() {
  return Boolean(env.resendApiKey)
}

function extractErrorMessage(error) {
  if (!error) return ''
  if (typeof error === 'string') return error
  return String(error.message || error.error?.message || error.name || '')
}

function isSandboxRestrictionError(error) {
  const msg = extractErrorMessage(error).toLowerCase()
  return (
    msg.includes('testing emails') ||
    msg.includes('verify a domain') ||
    msg.includes('only send testing')
  )
}

function withTestRoutingMeta({ subject, html, intendedTo }) {
  return {
    subject: `[DEV mail for ${intendedTo}] ${subject}`,
    html: `${html}<p style="margin:24px 0 0;padding:12px 14px;background:#f7efe0;border-radius:10px;font-size:12px;color:#8a6a1a">Sandbox mode: this email was intended for <strong>${intendedTo}</strong> but Resend only allows your account inbox in test mode.</p>`,
  }
}

function isResendTestFrom() {
  return String(env.mailFrom).includes('@resend.dev')
}

/** Customer mail must never be redirected to the admin sandbox inbox. */
function shouldSandboxFallback(intendedTo, audience) {
  if (!env.resendSandboxTo) return false
  if (audience === 'customer') return false
  return env.resendSandboxTo.trim().toLowerCase() !== intendedTo.trim().toLowerCase()
}

function isCustomerBlockedInTestMode(intendedTo, audience) {
  if (audience !== 'customer' || !isResendTestFrom()) return false
  const allowed = env.resendSandboxTo?.trim().toLowerCase()
  if (!allowed) return true
  return intendedTo.trim().toLowerCase() !== allowed
}

/**
 * @param {'customer' | 'admin' | 'any'} [options.audience]
 *   customer — send only to the real user email (no admin inbox fallback in sandbox)
 *   admin — may fall back to RESEND_SANDBOX_TO when Resend blocks other recipients
 */
export async function sendEmail({ to, subject, html, text, attachments = [], audience = 'any' }) {
  const client = getResend()
  if (!client) {
    console.warn('[mail] RESEND_API_KEY not set — skipping email:', subject)
    return { ok: false, skipped: true, error: 'Mail not configured' }
  }

  const intendedTo = String(to || '').trim()
  if (!intendedTo) {
    return { ok: false, error: 'Missing recipient email' }
  }

  if (isCustomerBlockedInTestMode(intendedTo, audience)) {
    console.warn(
      `[mail] Customer email skipped (Resend test mode): "${subject}" → ${intendedTo}. Use checkout email ${env.resendSandboxTo || 'your verified inbox'} to test, or verify a domain at resend.com/domains.`,
    )
    return {
      ok: false,
      skipped: true,
      sandboxBlocked: true,
      intendedTo,
      error: 'Resend test mode only delivers to verified inbox',
    }
  }

  const plainText = text || html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

  async function attempt(recipient, routedSubject, routedHtml, routedAttachments = attachments) {
    try {
      const result = await client.emails.send({
        from: env.mailFrom,
        to: recipient,
        subject: routedSubject,
        html: routedHtml,
        text: plainText,
        attachments: routedAttachments?.length ? routedAttachments : undefined,
      })
      return { data: result.data, error: result.error }
    } catch (err) {
      return { data: null, error: err }
    }
  }

  let { data, error } = await attempt(intendedTo, subject, html, attachments)

  if (error && isSandboxRestrictionError(error)) {
    if (shouldSandboxFallback(intendedTo, audience)) {
      const routed = withTestRoutingMeta({ subject, html, intendedTo })
      ;({ data, error } = await attempt(env.resendSandboxTo, routed.subject, routed.html, attachments))
      if (!error) {
        return {
          ok: true,
          id: data?.id,
          to: env.resendSandboxTo,
          intendedTo,
          sandboxFallback: true,
        }
      }
    } else if (audience === 'customer') {
      console.warn(
        `[mail] Customer email not sent (Resend sandbox): "${subject}" → ${intendedTo}. Verify a domain at resend.com/domains to deliver to real customers.`,
      )
      return {
        ok: false,
        skipped: true,
        sandboxBlocked: true,
        intendedTo,
        error: extractErrorMessage(error),
      }
    }
  }

  if (error) {
    console.error('[mail] Resend error:', extractErrorMessage(error) || error)
    return { ok: false, error: extractErrorMessage(error) || 'Send failed', intendedTo, to: intendedTo }
  }

  return { ok: true, id: data?.id, to: intendedTo, intendedTo }
}

function fmtInr(n) {
  return `₹${Number(n).toLocaleString('en-IN')}`
}

export function orderPlacedAdminEmailHtml({ order, paymentLabel }) {
  return `
    <div style="font-family:Inter,sans-serif;max-width:560px;color:#0a2e22">
      <h2 style="color:#b8860b;margin:0 0 12px">New order received</h2>
      <p style="margin:0 0 16px">A customer just placed an order on Tasneem Mukhwas.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 0;color:#666">Order</td><td style="padding:6px 0;font-weight:600">${order.orderNumber}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Customer</td><td style="padding:6px 0">${order.customerName}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Email</td><td style="padding:6px 0">${order.customerEmail}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Phone</td><td style="padding:6px 0">${order.customerPhone || '—'}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Items</td><td style="padding:6px 0">${order.itemCount}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Total</td><td style="padding:6px 0;font-weight:700;color:#b8860b">${fmtInr(order.total)}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Payment</td><td style="padding:6px 0;text-transform:uppercase">${paymentLabel}</td></tr>
      </table>
      <p style="margin:20px 0 0;font-size:13px;color:#666">Open the admin panel to process this order.</p>
    </div>
  `
}

export function orderPlacedCustomerEmailHtml({ order, paymentLabel }) {
  return `
    <div style="font-family:Inter,sans-serif;max-width:560px;color:#0a2e22">
      <h2 style="color:#b8860b;margin:0 0 12px">Order confirmed</h2>
      <p style="margin:0 0 16px">Hi ${order.customerName}, thank you for ordering from Tasneem Mukhwas.</p>
      <p style="margin:0 0 8px"><strong>Order ${order.orderNumber}</strong></p>
      <p style="margin:0 0 16px">Total: <strong style="color:#b8860b">${fmtInr(order.total)}</strong> · ${paymentLabel}</p>
      <p style="margin:0;font-size:14px;color:#666">Your invoice is attached. Track this order from My Orders in your account.</p>
    </div>
  `
}

export function orderDeliveredEmailHtml({ order, forAdmin = false }) {
  return `
    <div style="font-family:Inter,sans-serif;max-width:560px;color:#0a2e22">
      <h2 style="color:#1b7a3e;margin:0 0 12px">${forAdmin ? 'Order delivered' : 'Delivered!'}</h2>
      <p style="margin:0 0 16px">${
        forAdmin
          ? `Order <strong>${order.orderNumber}</strong> for ${order.customerName} has been marked delivered.`
          : `Hi ${order.customerName}, your order <strong>${order.orderNumber}</strong> has been delivered.`
      }</p>
      <p style="margin:0;font-size:14px;color:#666">Thank you for choosing Tasneem Mukhwas.</p>
    </div>
  `
}

export function campaignSentAdminEmailHtml({ campaign, coupon, sent, total }) {
  const discountLabel =
    coupon.discountType === 'percent' ? `${coupon.value}% off` : `${fmtInr(coupon.value)} off`
  return `
    <div style="font-family:Inter,sans-serif;max-width:560px;color:#0a2e22">
      <h2 style="color:#b8860b;margin:0 0 12px">Bulk discount campaign sent</h2>
      <p style="margin:0 0 12px"><strong>${campaign.title}</strong></p>
      <p style="margin:0 0 16px">${discountLabel} · delivered to ${sent} of ${total} customers.</p>
    </div>
  `
}

export function paymentReceivedEmailHtml({ order }) {
  return `
    <div style="font-family:Inter,sans-serif;max-width:560px;color:#0a2e22">
      <h2 style="color:#1b7a3e;margin:0 0 12px">Payment received</h2>
      <p style="margin:0 0 16px">Hi ${order.customerName}, your payment for order <strong>${order.orderNumber}</strong> was successful.</p>
      <p style="margin:0 0 8px">Amount paid: <strong style="color:#b8860b">${fmtInr(order.total)}</strong></p>
      <p style="margin:0;font-size:14px;color:#666">We are processing your order. You will be notified when it ships.</p>
    </div>
  `
}

export function passwordRecoveryEmailHtml({ name, email, temporaryPassword }) {
  return `
    <div style="font-family:Inter,sans-serif;max-width:560px;color:#0a2e22">
      <h2 style="color:#b8860b;margin:0 0 12px">Password recovery</h2>
      <p style="margin:0 0 12px">Hi ${name || 'there'},</p>
      <p style="margin:0 0 16px;line-height:1.6">We received a request to recover the login for <strong>${email}</strong>.</p>
      <p style="margin:0 0 8px;font-size:14px;color:#666">Your new temporary password:</p>
      <p style="margin:0 0 16px;padding:14px 18px;background:#f3f8f4;border-radius:12px;font-size:22px;font-weight:700;letter-spacing:0.12em;text-align:center;color:#0a2e22">${temporaryPassword}</p>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#666">Use this password to sign in, then update it from Settings for better security.</p>
      <p style="margin:0;font-size:13px;color:#666">If you did not request this, contact Tasneem Mukhwas support immediately.</p>
    </div>
  `
}

export function discountCampaignEmailHtml({ customerName, message, coupon, shopUrl }) {
  const discountLabel =
    coupon.discountType === 'percent'
      ? `${coupon.value}% off`
      : `${fmtInr(coupon.value)} off`
  const codeBlock = coupon.code
    ? `<p style="margin:16px 0;padding:14px 18px;background:#f3f8f4;border-radius:12px;font-size:22px;font-weight:700;letter-spacing:0.18em;text-align:center;color:#0a2e22">${coupon.code}</p>`
    : `<p style="margin:16px 0;padding:12px;background:#f3f8f4;border-radius:12px;font-weight:600;color:#b8860b">${discountLabel} applied on eligible products</p>`

  return `
    <div style="font-family:Inter,sans-serif;max-width:560px;color:#0a2e22">
      <h2 style="color:#b8860b;margin:0 0 12px">${coupon.title}</h2>
      <p style="margin:0 0 12px">Hi ${customerName || 'there'},</p>
      <p style="margin:0 0 16px;line-height:1.6">${message || `Enjoy ${discountLabel} at Tasneem Mukhwas.`}</p>
      ${codeBlock}
      <p style="margin:0 0 8px;font-size:13px;color:#666">Valid until ${new Date(coupon.expiresAt).toLocaleDateString('en-IN')}${coupon.minOrderValue ? ` · Min order ${fmtInr(coupon.minOrderValue)}` : ''}</p>
      <p style="margin:20px 0 0"><a href="${shopUrl}" style="display:inline-block;background:#0a2e22;color:#f2f4f5;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:600">Shop now</a></p>
    </div>
  `
}
