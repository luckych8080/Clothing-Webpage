const mongoose = require('mongoose');
const names = require('./names');
const Product = require('../models/product');

mongoose.connect('mongodb://localhost:27017/anythingsell');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error'));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Product.deleteMany({});
    for (let i = 0; i < 26; i++) {
        const price = Math.floor(Math.random() * 20) + 10;
        const product = new Product({
            name: `${names[i].names}`,
            price,
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis, nam! Excepturi ea amet tenetur illum eos porro esse non totam soluta nostrum unde ipsa, adipisci nihil asperiores iure reiciendis doloremque.',
            images: "https://images.unsplash.com/photo-1634624833042-d6a6fb7a0358?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=60"
        })
        await product.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})