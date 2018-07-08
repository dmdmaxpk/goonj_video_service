const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;


const channelSchema = new Schema({
    _id: ShortId,
    name: String,
    description: String,
    language: String,
    category: String,
    country: String,
    thumbnail: String,
    logo: String,
    hls_link: String,
    https_link: String,
    seq: Number,  
    valid: Boolean,
    added_dtm: Date,
    last_modified: Date
});

module.exports = mongoose.model('Channel', channelSchema);