const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagSchema = new Schema({
    // email: {
    //     type: String,
    //     required: true,
    //     unique: true
    // }

});

module.exports = mongoose.model('Tag', TagSchema);