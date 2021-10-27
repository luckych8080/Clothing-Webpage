const Product = require('../models/product');
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const products = await Product.find({});
    res.render('products/index', { products });
};

module.exports.renderNewForm = (req, res) => {
    res.render('products/new');
};

module.exports.createProduct = async (req, res, next) => {
    const product = new Product(req.body.product);
    product.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    product.author = req.user._id;
    await product.save();
    console.log(product, product.images)
    req.flash('success', 'Successfully made a new product!');
    res.redirect(`/products/${product._id}`)
};

module.exports.showProduct = async (req, res) => {
    const product = await Product.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!product){
        req.flash('error', 'Cannot find that Product!');
        return res.redirect('/products');
    }
    res.render('products/show', { product });
};

module.exports.renderEditForm = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        req.flash('error', 'Cannot find that Product!')
        return res.redirect('/products');
    }
    res.render('products/edit', { product });
};

module.exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    product.images.push(...imgs);
    await product.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await product.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    
    req.flash('success', 'Successfully update Product!');
    res.redirect(`/products/${product._id}`)
};

module.exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Product')
    res.redirect('/products');
};


