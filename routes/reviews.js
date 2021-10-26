const express = require('express');
const router = express.Router({ mergeParams: true });
const Product = require('../models/product');
const Review = require('../models/review');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const { reviewSchema } = require('../schemas.js');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');


router.post("/", isLoggedIn, validateReview, catchAsync(async(req, res)=>{
    const product = await Product.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    product.reviews.push(review);
    console.log(product, review)
    await review.save();
    await product.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/products/${product._id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync((async (req, res) => {
    const { id, reviewId } = req.params;
    await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/products/${id}`);
})))

module.exports = router;
