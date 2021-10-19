const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Product = require('./models/product')
const ejsMate = require('ejs-mate');

const dbUrl = 'mongodb://localhost:27017/anythingsell';
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error'));
db.once("open", () => {
    console.log("Database connected");
});

const port = 8080;
const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); 

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', function (req, res) {
    res.render('home');
})

app.get('/products', async (req, res) => {
    const products = await Product.find({});
    res.render('products/index', {products});
})

app.get('/products/new', (req, res) => {
    res.render('products/new');
})

app.post('/products', async (req, res) => {
    const product = new Product(req.body.product);
    console.log(product);
    await product.save();
    res.redirect(`/products`)
})

app.get('/products/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)
    res.render('products/show', { product });
});

// app.get('/products/:id/edit', async (req, res) => {
//     const product = await Product.findById(req.params.id)
//     res.render('products/edit', { product });
// })

// app.put('/products/:id', async (req, res) => {
//     const { id } = req.params;
//     const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
//     res.redirect(`/products/${product._id}`)
// });

// app.delete('/products/:id', async (req, res) => {
//     const { id } = req.params;
//     await Product.findByIdAndDelete(id);
//     res.redirect('/products');
// })

// app.get('/login', (req, res)=>{
//     res.render('users/login')
// })

// // app.post('/login', (req, res)=>{
// //     res.render('users/login')
// // })


// app.get('/register', (req, res)=>{
//     res.render('users/register')
// })

app.listen(port, () => {
    console.log(`Serving on https://localhost:${port}`)
})