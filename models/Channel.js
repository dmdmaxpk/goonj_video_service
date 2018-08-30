const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;


const channelSchema = new Schema({
    _id: ShortId,
    name: String,
    slug: { type: String, index: true },
    description: String,
    category: String,
    thumbnail: String,
    logo: String,
    hls_link: String,
    seq: Number,
    active: Boolean,
    added_dtm: { type: Date, default: Date.now },
    last_modified: Date
});

module.exports = mongoose.model('Channel', channelSchema);