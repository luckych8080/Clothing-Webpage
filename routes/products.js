const express = require('express');
const router = express.Router();
const Product = require('../models/product')

const catchAsync = require('../utils/catchAsync');



router.get('/', catchAsync(async (req, res) => {
    const products = await Product.find({});
    res.render('products/index', { products });
}))

router.get('/new', (req, res) => {
    res.render('products/new');
})

router.post('/', catchAsync(async (req, res) => {
    const product = new Product(req.body.product);
    console.log(product);
    await product.save();
    res.redirect(`/products/${product._id}`)
}))

router.get('/:id',  catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id)
    res.render('products/show', { product });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id)
    res.render('products/edit', { product });
}))

router.put('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
    res.redirect(`/products/${product._id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
}))


module.exports = router;
