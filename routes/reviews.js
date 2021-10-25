const express = require('express');
const router = express.Router({ mergeParams: true });
const Product = require('../models/product');
const Review = require('../models/review');


const { reviewSchema } = require('../schemas.js');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post("/", validateReview, catchAsync(async(req, res)=>{
    const product = await Product.findById(req.params.id);
    const review = new Review(req.body.review);
    // review.author = req.user._id;
    product.reviews.push(review);
    console.log(product, review)
    await review.save();
    await product.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/products/${product._id}`);
}))

router.delete('/:reviewId', catchAsync((async (req, res) => {
    const { id, reviewId } = req.params;
    await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/products/${id}`);
})))

module.exports = router;
