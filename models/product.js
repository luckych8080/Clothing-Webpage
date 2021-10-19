const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

const productSchema = new Schema({
    name: String,
    images: String,
    price: Number,
    description: String,
    location: String,
    size: {
        type: Schema.Types.ObjectId,
        ref: 'Size'
    },
    color: String,
    // author: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User'
    // },
    tag: {

    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

module.exports = mongoose.model('Products', productSchema);