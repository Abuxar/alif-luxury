import express from 'express';
import { getProductReviews, createReview, getAllReviews, updateReviewStatus } from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:productId').get(getProductReviews);
router.route('/').post(protect, createReview);
router.route('/').get(protect, admin, getAllReviews);
router.route('/:id/status').put(protect, admin, updateReviewStatus);

export default router;
