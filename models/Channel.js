const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;


const channelSchema = new Schema({
    _id: ShortId,
    name: { type: String, index: true },
    slug: { type: String, index: true },
    description: String,
    language: String,
    category: String,
    country: String,
    thumbnail: String,
    logo: String,
    hls_link: String,
    https_link: String,
    seq: Number,
    active: Boolean,
    added_dtm: { type: Date, default: Date.now },
    last_modified: Date
});

module.exports = mongoose.model('Channel', channelSchema);