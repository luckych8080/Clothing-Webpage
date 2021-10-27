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
            author: '6176f4d375c257552087f711',
            name: `${names[i].names}`,
            price,
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis, nam! Excepturi ea amet tenetur illum eos porro esse non totam soluta nostrum unde ipsa, adipisci nihil asperiores iure reiciendis doloremque.',
            images: [
                {
                    url: 'https://res.cloudinary.com/dszgvnjt0/image/upload/v1635334980/RedWay/mylmrmc9nqlute9ljn1t.jpg',                                  filename: 'RedWay/mylmrmc9nqlute9ljn1t'
                }
            ]
        })
        await product.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})