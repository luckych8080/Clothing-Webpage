const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SizeSchema = new Schema({
    s: Boolean,
    m: Boolean,
    l: Boolean,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("Size", SizeSchema);