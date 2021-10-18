const express = require('express');
const app = express();
const port = 8080;

app.get('/', function (req, res) {
    res.send('hello world')
})


app.listen(port, ()=>{
    console.log(`Serving on localhost:${port}`)
})