const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;


const anchorSchema = new Schema({
    _id: ShortId,
    name: String,
    avatar: String,
    biodata: String,
    weightage: Number,      // Can setup from 1-10 based on high to low, then sort them accordingly, default can be 0
    is_host: Boolean,
    is_guest: Boolean,
    added_dtm: { type: Date, default: Date.now },
    last_edited: Date
})

module.exports = mongoose.model('Anchor', anchorSchema);