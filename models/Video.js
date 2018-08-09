const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;


const videoSchema = new Schema({
    _id: { type: ShortId, alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', len: 4, retries: 4 },  //Generating shortid instead of uuid
    title: String,
    description: String,
    program: String,
    source: String,
    feed: { type: String, index: true },
    category: String,
    sub_category: String,
    added_dtm: { type: Date, default: Date.now, index: true },
    publish_dtm: Date,
    last_modified: Date,
    anchor: { type: String, index: true },
    guests: Array,
    topics: { type: Array, index: true },
    duration: Number,
    file_name: String,
    thumbnail: String,
    pinned: { type: Boolean, default: false, index: true },
    active: { type: Boolean, default: false, index: true },
    transcoding_status: { type: Boolean, default: false }

}, { strict: true })

module.exports = mongoose.model('Video', videoSchema);