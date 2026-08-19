import Razorpay from 'razorpay'
import crypto from 'crypto'
import { env } from '../config/env.js'

let instance = null

export function getRazorpay() {
  if (!env.razorpayKeyId || !env.razorpayKeySecret) {
    throw new Error('Razorpay is not configured')
  }
  if (!instance) {
    instance = new Razorpay({
      key_id: env.razorpayKeyId,
      key_secret: env.razorpayKeySecret,
    })
  }
  return instance
}

export function isRazorpayConfigured() {
  return Boolean(env.razorpayKeyId && env.razorpayKeySecret)
}

/** Amount in INR rupees → paise for Razorpay. */
export function toPaise(rupees) {
  return Math.round(Number(rupees) * 100)
}

export function verifyRazorpaySignature({ orderId, paymentId, signature }) {
  const body = `${orderId}|${paymentId}`
  const expected = crypto
    .createHmac('sha256', env.razorpayKeySecret)
    .update(body)
    .digest('hex')
  return expected === signature
}
