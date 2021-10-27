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
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
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