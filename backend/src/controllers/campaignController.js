import { z } from 'zod'
import { Campaign } from '../models/Campaign.js'
import { Coupon } from '../models/Coupon.js'
import { Customer } from '../models/Customer.js'
import { ApiError, asyncHandler, sendSuccess } from '../utils/asyncHandler.js'
import { sendDiscountCampaignEmail, findUserIdForCustomer, notifyCampaignSentToAdmin } from '../services/notificationService.js'
import { isMailConfigured } from '../services/mail.js'

const createSchema = z.object({
  title: z.string().trim().min(2).max(160),
  message: z.string().trim().max(2000).optional().default(''),
  couponId: z.string().min(1),
  recipientFilter: z.enum(['all', 'active']).optional().default('all'),
})

export const listCampaigns = asyncHandler(async (_req, res) => {
  const items = await Campaign.find().sort({ createdAt: -1 }).limit(100).populate('coupon')
  return sendSuccess(res, {
    data: {
      items: items.map((c) => ({
        ...c.toPublicJSON(),
        coupon: c.coupon?.toPublicJSON?.() || c.coupon,
      })),
      mailConfigured: isMailConfigured(),
    },
  })
})

export const createCampaign = asyncHandler(async (req, res) => {
  const body = createSchema.parse(req.body)
  const coupon = await Coupon.findById(body.couponId)
  if (!coupon || !coupon.isActive) throw new ApiError(404, 'Coupon not found or inactive')

  const campaign = await Campaign.create({
    title: body.title,
    message: body.message,
    coupon: coupon._id,
    recipientFilter: body.recipientFilter,
    status: 'draft',
    createdBy: req.user._id,
  })

  return sendSuccess(res, {
    status: 201,
    message: 'Campaign created',
    data: { ...campaign.toPublicJSON(), coupon: coupon.toPublicJSON() },
  })
})

export const sendCampaign = asyncHandler(async (req, res) => {
  if (!isMailConfigured()) {
    throw new ApiError(503, 'Email is not configured. Add RESEND_API_KEY to backend .env')
  }

  const campaign = await Campaign.findById(req.params.id).populate('coupon')
  if (!campaign) throw new ApiError(404, 'Campaign not found')
  if (campaign.status === 'sent') throw new ApiError(400, 'Campaign already sent')

  const coupon = campaign.coupon
  if (!coupon) throw new ApiError(400, 'Campaign has no linked discount')

  const filter = campaign.recipientFilter === 'active' ? { status: 'active' } : {}
  const customers = await Customer.find(filter).limit(500)

  campaign.status = 'sending'
  campaign.stats = { total: customers.length, sent: 0, failed: 0 }
  await campaign.save()

  let sent = 0
  let failed = 0

  for (const customer of customers) {
    if (!customer.email) {
      failed += 1
      continue
    }

    if (!customer.user) {
      const userId = await findUserIdForCustomer(customer)
      if (userId) customer.user = userId
    }

    const result = await sendDiscountCampaignEmail({
      customer,
      coupon,
      message: campaign.message,
      campaignId: campaign._id,
    })

    if (result.ok) sent += 1
    else failed += 1
  }

  campaign.status = failed === customers.length ? 'failed' : 'sent'
  campaign.stats = { total: customers.length, sent, failed }
  campaign.sentAt = new Date()
  await campaign.save()

  if (sent > 0) {
    void notifyCampaignSentToAdmin({ campaign, coupon, sent, total: customers.length }).catch((err) =>
      console.error('[notify] campaign admin', err),
    )
  }

  return sendSuccess(res, {
    message: `Campaign sent to ${sent} of ${customers.length} customers`,
    data: {
      ...campaign.toPublicJSON(),
      coupon: coupon.toPublicJSON?.() || coupon,
    },
  })
})

export const previewCampaignRecipients = asyncHandler(async (req, res) => {
  const filter = req.query.filter === 'active' ? { status: 'active' } : {}
  const count = await Customer.countDocuments(filter)
  const sample = await Customer.find(filter).limit(5).select('name email')
  return sendSuccess(res, {
    data: {
      count,
      sample: sample.map((c) => ({ name: c.name, email: c.email })),
    },
  })
})
