const express = require('express');
const port = 8080;
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const path = require('path');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/red1947';

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error'));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); 

app.get('/', function (req, res) {
    res.send('hello world')
})

app.get('/products/all-products', (req, res) => {
    res.render('products/allproducts');
})







// app.get('/login', (req, res)=>{
//     res.render('users/login')
// })

// app.post('/login', (req, res)=>{
//     res.render('users/login')
// })


// app.get('/register', (req, res)=>{
//     res.render('users/register')
// })

app.listen(port, () => {
    console.log(`Serving on localhost:${port}`)
})