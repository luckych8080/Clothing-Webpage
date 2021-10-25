const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    image: String,
    price: Number,
    description: String,
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