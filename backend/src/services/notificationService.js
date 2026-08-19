import { Notification } from '../models/Notification.js'
import { User } from '../models/User.js'
import { env } from '../config/env.js'
import { buildInvoicePdf } from './invoicePdf.js'
import {
  sendEmail,
  orderPlacedAdminEmailHtml,
  orderPlacedCustomerEmailHtml,
  orderDeliveredEmailHtml,
  discountCampaignEmailHtml,
  campaignSentAdminEmailHtml,
  isMailConfigured,
} from './mail.js'
import { TWO_DAYS_MS } from './notificationCleanup.js'

const ADMIN_IN_APP_TYPES = [
  'order_placed',
  'payment_received',
  'order_shipped',
  'order_completed',
  'discount_campaign',
]

export async function createNotification(payload) {
  return Notification.create(payload)
}

async function getAdminUsers() {
  return User.find({ role: 'admin', isActive: true }).select('_id email').lean()
}

/** Admin alert emails go only to ADMIN_EMAIL from .env — never legacy DB admins. */
async function getAdminNotifyEmails() {
  const email = String(env.adminEmail || '').trim().toLowerCase()
  return email ? [email] : []
}

async function notifyAdminsInApp(payload) {
  const admins = await getAdminUsers()
  if (!admins.length) return
  await Promise.all(
    admins.map((admin) =>
      createNotification({
        ...payload,
        user: admin._id,
        channel: 'in_app',
        emailStatus: 'skipped',
      }),
    ),
  )
}

/** Razorpay checkout created — awaiting payment (no emails). */
export async function notifyOrderAwaitingPayment({ order, userId }) {
  if (userId) {
    await createNotification({
      user: userId,
      email: order.customerEmail,
      type: 'payment_pending',
      title: `Complete payment · ${order.orderNumber}`,
      body: `Your order total is ₹${order.total}. Finish Razorpay payment to confirm.`,
      channel: 'in_app',
      emailStatus: 'skipped',
      orderNumber: order.orderNumber,
      meta: { total: order.total, payment: 'razorpay' },
    })
  }
}

/** Order confirmed — customer invoice email + admin alert email + in-app alerts. */
export async function notifyOrderConfirmed({ order, transaction, userId, paymentLabel }) {
  const orderNumber = order.orderNumber
  const tasks = []

  if (userId) {
    tasks.push(
      createNotification({
        user: userId,
        email: order.customerEmail,
        type: 'order_placed',
        title: `Order confirmed · ${orderNumber}`,
        body: `Your order of ₹${order.total} is confirmed. Invoice sent to your email.`,
        channel: 'in_app',
        emailStatus: 'skipped',
        orderNumber,
        meta: { total: order.total, payment: paymentLabel },
      }),
    )
  }

  tasks.push(
    notifyAdminsInApp({
      type: 'order_placed',
      title: `New order · ${orderNumber}`,
      body: `${order.customerName} confirmed an order for ₹${order.total}.`,
      orderNumber,
      meta: { customerEmail: order.customerEmail, payment: paymentLabel },
    }),
  )

  const adminEmails = await getAdminNotifyEmails()
  const adminHtml = orderPlacedAdminEmailHtml({ order, paymentLabel })
  const customerEmail = String(order.customerEmail || '').trim().toLowerCase()

  for (const adminEmail of adminEmails) {
    if (customerEmail && adminEmail.toLowerCase() === customerEmail) continue
    tasks.push(
      sendEmail({
        to: adminEmail,
        subject: `[Admin] Order confirmed ${orderNumber} · ₹${order.total}`,
        html: adminHtml,
        audience: 'admin',
      }),
    )
  }

  const billingEmail = String(order.customerEmail || '').trim().toLowerCase()
  if (billingEmail) {
    tasks.push(
      (async () => {
        let attachments = []
        if (transaction) {
          try {
            const pdf = await buildInvoicePdf({ order, transaction })
            attachments = [
              {
                filename: `${orderNumber}-invoice.pdf`,
                content: pdf.toString('base64'),
              },
            ]
          } catch (err) {
            console.error('[notify] invoice pdf', err)
          }
        }
        await sendEmail({
          to: billingEmail,
          subject: `Order confirmed · ${orderNumber} · Tasneem Mukhwas`,
          html: orderPlacedCustomerEmailHtml({ order, paymentLabel }),
          attachments,
          audience: 'customer',
        })
      })(),
    )
  }

  await Promise.allSettled(tasks)
}

/** Legacy entry — COD confirms immediately; Razorpay waits for payment. */
export async function notifyOrderPlaced({ order, paymentMethod, userId, orderDoc, transaction }) {
  const paymentLabel =
    paymentMethod === 'razorpay'
      ? order.paymentStatus === 'paid'
        ? 'Paid via Razorpay'
        : 'Razorpay (awaiting payment)'
      : 'Cash on Delivery'

  if (paymentMethod === 'razorpay' && order.paymentStatus !== 'paid') {
    await notifyOrderAwaitingPayment({ order, userId })
    return
  }

  await notifyOrderConfirmed({
    order: orderDoc || order,
    transaction,
    userId,
    paymentLabel,
  })
}

/** Razorpay paid — in-app only (invoice email sent via notifyOrderConfirmed). */
export async function notifyPaymentReceived({ order, userId }) {
  const tasks = []

  if (userId) {
    tasks.push(
      createNotification({
        user: userId,
        email: order.customerEmail,
        type: 'payment_received',
        title: `Payment received · ${order.orderNumber}`,
        body: `₹${order.total} paid successfully. Your order is being prepared.`,
        channel: 'in_app',
        emailStatus: 'skipped',
        orderNumber: order.orderNumber,
        meta: { total: order.total },
      }),
    )
  }

  tasks.push(
    notifyAdminsInApp({
      type: 'payment_received',
      title: `Payment confirmed · ${order.orderNumber}`,
      body: `₹${order.total} received from ${order.customerName || 'customer'}.`,
      orderNumber: order.orderNumber,
      meta: { total: order.total },
    }),
  )

  await Promise.allSettled(tasks)
}

export async function notifyOrderStatusChange({ order, userId, newStatus }) {
  const map = {
    shipped: {
      type: 'order_shipped',
      title: `Order shipped · ${order.orderNumber}`,
      body: order.tracking
        ? `Tracking: ${order.tracking}. Your mukhwas is on the way.`
        : 'Your order has been shipped.',
      adminBody: `Order ${order.orderNumber} shipped${order.tracking ? ` · ${order.tracking}` : ''}.`,
    },
    completed: {
      type: 'order_completed',
      title: `Order delivered · ${order.orderNumber}`,
      body: 'Your order has been delivered. Thank you for shopping with Tasneem Mukhwas.',
      adminBody: `Order ${order.orderNumber} marked delivered.`,
    },
    processing: {
      type: 'payment_pending',
      title: `Order processing · ${order.orderNumber}`,
      body: 'We are preparing your order for dispatch.',
      adminBody: `Order ${order.orderNumber} is being processed.`,
    },
  }

  const info = map[newStatus]
  if (!info) return

  const tasks = []

  if (userId) {
    tasks.push(
      createNotification({
        user: userId,
        email: order.customerEmail,
        type: info.type,
        title: info.title,
        body: info.body,
        channel: 'in_app',
        emailStatus: 'skipped',
        orderNumber: order.orderNumber,
        meta: { status: newStatus, tracking: order.tracking },
      }),
    )
  }

  if (['shipped', 'completed', 'processing'].includes(newStatus)) {
    tasks.push(
      notifyAdminsInApp({
        type: info.type === 'payment_pending' ? 'payment_received' : info.type,
        title: info.title.replace('Order ', 'Order update · '),
        body: info.adminBody,
        orderNumber: order.orderNumber,
        meta: { status: newStatus, tracking: order.tracking },
      }),
    )
  }

  if (newStatus === 'completed') {
    const billingEmail = String(order.customerEmail || '').trim().toLowerCase()
    if (billingEmail) {
      tasks.push(
        sendEmail({
          to: billingEmail,
          subject: `Order delivered · ${order.orderNumber} · Tasneem Mukhwas`,
          html: orderDeliveredEmailHtml({ order }),
          audience: 'customer',
        }),
      )
    }

    const adminEmails = await getAdminNotifyEmails()
    for (const adminEmail of adminEmails) {
      if (billingEmail && adminEmail.toLowerCase() === billingEmail) continue
      tasks.push(
        sendEmail({
          to: adminEmail,
          subject: `[Admin] Order delivered · ${order.orderNumber}`,
          html: orderDeliveredEmailHtml({ order, forAdmin: true }),
          audience: 'admin',
        }),
      )
    }
  }

  await Promise.allSettled(tasks)
}

export async function sendDiscountCampaignEmail({ customer, coupon, message, campaignId }) {
  const shopUrl = `${env.clientUrl}/shop`
  const html = discountCampaignEmailHtml({
    customerName: customer.name,
    message,
    coupon,
    shopUrl,
  })

  const result = await sendEmail({
    to: customer.email,
    subject: `${coupon.title} · Tasneem Mukhwas`,
    html,
    audience: 'customer',
  })

  if (customer.user) {
    await createNotification({
      user: customer.user,
      email: customer.email,
      type: 'discount_campaign',
      title: coupon.title,
      body: message || `Special offer: ${coupon.title}`,
      channel: 'in_app',
      emailStatus: 'skipped',
      couponCode: coupon.code || undefined,
      campaign: campaignId,
      meta: { discountType: coupon.discountType, value: coupon.value },
    })
  }

  return result
}

export async function notifyCampaignSentToAdmin({ campaign, coupon, sent, total }) {
  await notifyAdminsInApp({
    type: 'discount_campaign',
    title: `Campaign sent · ${campaign.title}`,
    body: `Discount emailed to ${sent} of ${total} customers.`,
    couponCode: coupon.code || undefined,
    campaign: campaign._id,
    meta: { sent, total },
  })

  const adminEmails = await getAdminNotifyEmails()
  const html = campaignSentAdminEmailHtml({ campaign, coupon, sent, total })
  await Promise.allSettled(
    adminEmails.map((to) =>
      sendEmail({
        to,
        subject: `[Admin] Campaign sent · ${campaign.title}`,
        html,
        audience: 'admin',
      }),
    ),
  )
}

/** Product / category auto-apply discount — in-app alert for all customers. */
export async function notifyProductDiscountCreated({ coupon, productName, productImage }) {
  const customers = await User.find({ role: 'customer', isActive: true }).select('_id email').lean()
  const label =
    coupon.discountType === 'percent' ? `${coupon.value}% off` : `₹${coupon.value} off`
  const title = coupon.title || `${label} on ${productName || 'selected products'}`
  const body =
    coupon.description ||
    `New offer: ${label}${productName ? ` on ${productName}` : ''}. Shop before ${new Date(coupon.expiresAt).toLocaleDateString('en-IN')}.`

  await Promise.all(
    customers.map((u) =>
      createNotification({
        user: u._id,
        email: u.email,
        type: 'discount_available',
        title,
        body,
        channel: 'in_app',
        emailStatus: 'skipped',
        couponCode: coupon.code || undefined,
        meta: {
          scope: coupon.scope,
          productId: coupon.productId || undefined,
          category: coupon.category || undefined,
          productName,
          productImage,
          discountType: coupon.discountType,
          value: coupon.value,
        },
      }),
    ),
  )
}

export async function findUserIdForCustomer(customer) {
  if (customer.user) return customer.user
  const user = await User.findOne({ email: customer.email.toLowerCase() })
  return user?._id
}

export { isMailConfigured, ADMIN_IN_APP_TYPES, TWO_DAYS_MS }
