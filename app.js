const express = require('express');
const port = 8080;
const ejsMate = require('ejs-mate');
const path = require('path');


const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); 

app.get('/', function (req, res) {
    res.send('hello world')
})

app.get('/collections/all-products', (req, res) => {
    res.render('collections/allproducts');
})







app.get('/login', (req, res)=>{
    res.render('users/login')
})

app.post('/login', (req, res)=>{
    res.render('users/login')
})


app.get('/register', (req, res)=>{
    res.render('users/register')
})

app.listen(port, () => {
    console.log(`Serving on localhost:${port}`)
})