const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;


const videoSchema = new Schema({
    _id: { type: ShortId, alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', len: 4, retries: 4 },  // Generating shortid instead of uuid also neglecting special symbols
    title: { type: String, trim: true },
    description: String,
    program: { type: String, trim: true },
    source: { type: String, trim: true },       // Channel or the origin of the video
    feed: { type: String, index: true },        // Was used in old design, should be removed
    category: { type: String, index: true },
    sub_category: { type: String, index: true },
    sub_sub_category: { type: String, index: true },
    added_dtm: { type: Date, default: Date.now, index: true },
    publish_dtm: Date,                          // The time when the curators publish/active it after transcoding
    last_modified: Date,
    anchor: { type: String, index: true },
    guests: { type: Array, index: true },       // Was used in old design, should be removed
    topics: { type: Array, index: true },
    views_count: {type: Number, default: 0},
    duration: Number,                           // Duration of the video in seconds
    file_name: String,
    thumbnail: String,
    pinned: { type: Boolean, default: false, index: true },
    active: { type: Boolean, default: false, index: true },
    transcoding_status: { type: Boolean, default: false },
    is_premium: { type: Boolean, default: false},
    last_video: { type: String, ref: 'Video' },
    next_video: { type: String, ref: 'Video' },
    episode: { type: Number }
}, { strict: true })

module.exports = mongoose.model('Video', videoSchema);