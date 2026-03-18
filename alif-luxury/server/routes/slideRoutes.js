import express from 'express';
import { getSlides, createSlide, updateSlide, deleteSlide, updateSlideOrder } from '../controllers/slideController.js';

const router = express.Router();

router.get('/', getSlides);
router.post('/', createSlide);
router.put('/reorder', updateSlideOrder);
router.put('/:id', updateSlide);
router.delete('/:id', deleteSlide);

export default router;
