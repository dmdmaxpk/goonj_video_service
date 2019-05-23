const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;


const anchorSchema = new Schema({
    _id: ShortId,
    name: { type: String, trim: true },
    avatar: String,
    weightage: Number,      // Can setup from 1-10 based on high to low, then sort them accordingly, default can be 0
    added_dtm: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Anchor', anchorSchema);