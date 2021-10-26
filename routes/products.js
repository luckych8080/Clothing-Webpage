const express = require('express');
const router = express.Router();
const Product = require('../models/product')
const { productSchema } = require('../schemas.js');
const {isLoggedIn, isAuthor, validateProduct} = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');


router.get('/', catchAsync(async (req, res) => {
    const products = await Product.find({});
    res.render('products/index', { products });
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('products/new');
})

router.post('/', isLoggedIn, validateProduct, catchAsync(async (req, res) => {
    const product = new Product(req.body.product);
    product.author = req.user._id;
    console.log(product);
    await product.save();
    req.flash('success', 'Successfully made a new product!');
    res.redirect(`/products/${product._id}`)
}))

router.get('/:id',  catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(product)
    if(!product){
        req.flash('error', 'Cannot find that Product!');
        res.redirect('/products');
    }
    res.render('products/show', { product });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        req.flash('error', 'Cannot find that Product!')
        res.redirect('/products');
    }
    res.render('products/edit', { product });
}))

router.put('/:id', isLoggedIn, isAuthor, validateProduct, catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
    req.flash('success', 'Successfully update Product!');
    res.redirect(`/products/${product._id}`)
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Product')
    res.redirect('/products');
}))


module.exports = router;
