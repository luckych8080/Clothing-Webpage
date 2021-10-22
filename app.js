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
const reviewsRoutes = require('./routes/reviews');

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
app.use("/products/:id/reviews", reviewsRoutes);



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