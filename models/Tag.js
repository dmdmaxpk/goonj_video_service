const mongoose = require('mongoose');
var ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;


const tagSchema = new Schema({
    _id: ShortId,   //Generating shortid instead of uuid
    title: String,
    description: String,
    added_dtm: Date,
    last_edited: Date
})

module.exports = mongoose.model('Tag', tagSchema);