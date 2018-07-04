const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;


const videoSchema = new Schema({
    _id: ShortId,   //Generating shortid instead of uuid
    title: String,
    description: String,
    program: String,
    source: String,
    feed: String,
    category: String,
    sub_category: String,
    added_dtm: { type: Date, default: Date.now },
    publish_dtm: Date,
    last_modified: Date,
    anchor: String,
    guests: Array,
    topics: Array,
    bit_rates: Array,
    duration: String,
    file_name: String,
    thumbnail: String,
    slug: String,
    pinned: Boolean,
    active: { type: Boolean, default: false },
    transcoding_status: { type: Boolean, default: false }

}, { strict: true })

module.exports = mongoose.model('Video', videoSchema);