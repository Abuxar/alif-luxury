import Review from '../models/Review.js';

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, status: 'approved' })
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    // Calculate average
    const average = reviews.length > 0 
      ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length 
      : 0;
      
    res.json({
        reviews,
        count: reviews.length,
        average: Number(average.toFixed(1))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment, images } = req.body;

    const reviewExists = await Review.findOne({
      user: req.user._id,
      product: productId
    });

    if (reviewExists) {
      return res.status(400).json({ message: 'You have already reviewed this piece.' });
    }

    const review = new Review({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment,
      images: images || [],
      status: 'pending'
    });

    const createdReview = await review.save();
    
    // Return populated review so the frontend can immediately display it as pending
    const populated = await Review.findById(createdReview._id).populate('user', 'firstName lastName');
    
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error while submitting review' });
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
// @access  Private/Admin
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'firstName lastName email')
      .populate('product', 'name _id image')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all reviews' });
  }
};

// @desc    Update review status (Admin)
// @route   PUT /api/reviews/:id/status
// @access  Private/Admin
export const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.status = status;
    const updatedReview = await review.save();
    
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review status' });
  }
};
