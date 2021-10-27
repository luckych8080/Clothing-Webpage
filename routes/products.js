const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const products = require('../controllers/products');
const { productSchema } = require('../schemas.js');
const { isLoggedIn, isAuthor, validateProduct } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');


router.route('/')
    .get(catchAsync(products.index))
    .post(isLoggedIn, upload.array('image'), validateProduct, catchAsync(products.createProduct))

router.get('/new', isLoggedIn, products.renderNewForm)

router.route('/:id')
    .get(catchAsync(products.showProduct))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateProduct, catchAsync(products.updateProduct))
    .delete(isLoggedIn, isAuthor, catchAsync(products.deleteProduct))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(products.renderEditForm))

module.exports = router;