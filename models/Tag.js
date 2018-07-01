const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;


const tagSchema = new Schema({
    _id: ShortId,   //Generating shortid instead of uuid
    name: String,
    description: String,
    added_dtm: { type: Date, default: Date.now },
    last_edited: Date
});

module.exports = mongoose.model('Tag', tagSchema);