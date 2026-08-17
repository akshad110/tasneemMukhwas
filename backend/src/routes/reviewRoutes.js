import { Router } from 'express'
import {
  createReview,
  createReviewSchema,
  listAdminReviews,
  listMyReviews,
  listProductReviews,
  listTestimonials,
  updateReviewStatus,
  updateReviewStatusSchema,
} from '../controllers/reviewController.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

router.get('/testimonials', listTestimonials)
router.get('/admin', authenticate, requireAdmin, listAdminReviews)
router.get('/product/:productId', listProductReviews)
router.get('/mine', authenticate, listMyReviews)
router.post('/', authenticate, validate(createReviewSchema), createReview)
router.patch('/:id/status', authenticate, requireAdmin, validate(updateReviewStatusSchema), updateReviewStatus)

export default router
