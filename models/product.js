const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/h_400');
});

ImageSchema.virtual('showThumbnail').get(function () {
    return this.url.replace('/upload', '/upload/h_500');
});

ImageSchema.virtual('deleteThumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const productSchema = new Schema({
    name: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    size: String,
    wash: String,
    colour: String,
    material: String,
    category: {
        type: String,
        lowercase: true,
        enum: ['men', 'women', 'kids']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    // cart: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Cart'
    // }
});

productSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Product', productSchema);