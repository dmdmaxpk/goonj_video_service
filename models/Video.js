const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;


const videoSchema = new Schema({
    //Original 36 in Old
    //New 21
    _id: ShortId,   //Generating shortid instead of uuid
    title: String,
    description: String,
    program: String,
    source: String,
    category: String,
    sub_category: String,
    // year: { type: Number, default: new Date().getFullYear() },
    added_dtm: { type: Date, default: Date.now },
    // added_dtm: Date,    //It can be CMS side or here as default(time zone can be different)
    publish_dtm: Date,
    last_modified: Date,
    anchor: String,
    guests: Array,
    tags: Array,
    topics: Array,
    bit_rates: Array,
    duration: String,
    file_name: String,
    thumbnail: String,
    slug: String,
    active: { type: Boolean, default: false },
    transcoding_status: { type: Boolean, default: false }
    // enable_ads: {
    //     type: Boolean
    // },
    // admin_id: {
    //     type: String
    // },
    // enable_comments: {
    //     type: Boolean
    // },
    // enable_likes: {
    //     type: Boolean
    // },
    // enable_rating: {
    //     type: Boolean
    // },
    // enable_sharing: {
    //     type: Boolean
    // },
    // enable_view_count: {
    //     type: Boolean
    // },
    // pinned: {
    //     type: Number
    // },
    // progress: {
    //     type: String
    // },
    // publisher_id: {
    //     type: String
    // },
    // rating: {
    //     type: String
    // },
    // review_feedback: {
    //     type: String
    // },
    // platforms: {
    //     type: Array
    // },
    
}, { strict: false })

module.exports = mongoose.model('Video', videoSchema);