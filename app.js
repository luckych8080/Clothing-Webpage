const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Product = require('./models/product')
const Review = require('./models/review');
const session = require('express-session');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const productsRoutes = require('./routes/products');

const ExpressError = require('../YelpCamp/utils/ExpressError');

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

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))); 

const sessionConfig = {
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});



app.get('/', function (req, res) {
    res.render('home');
})



// app.get('/login', (req, res)=>{
//     res.render('users/login')
// })

// // app.post('/login', (req, res)=>{
// //     res.render('users/login')
// // })


// app.get('/register', (req, res)=>{
//     res.render('users/register')
// })

app.use("/products", productsRoutes);


app.post("/products/:id/reviews", async(req, res)=>{
    const product = await Product.findById(req.params.id);
    const review = new Review(req.body.review);
    // review.author = req.user._id;
    product.reviews.push(review);
    console.log(product, review)
    await review.save();
    await product.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/products/${product._id}`);
})

app.delete('/products/:id/reviews/:reviewId', (async (req, res) => {
    const { id, reviewId } = req.params;
    await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/products/${id}`);
}))

app.all('*', (req, res, next)=>{
    next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) =>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Oh No, Something went wrong!!"
    res.status(statusCode).render('error', {err});
})

app.listen(port, () => {
    console.log(`Serving on https://localhost:${port}`)
})