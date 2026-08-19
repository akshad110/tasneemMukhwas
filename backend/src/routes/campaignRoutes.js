import { Router } from 'express'
import {
  createCampaign,
  listCampaigns,
  previewCampaignRecipients,
  sendCampaign,
} from '../controllers/campaignController.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, requireAdmin, listCampaigns)
router.get('/preview-recipients', authenticate, requireAdmin, previewCampaignRecipients)
router.post('/', authenticate, requireAdmin, createCampaign)
router.post('/:id/send', authenticate, requireAdmin, sendCampaign)

export default router
