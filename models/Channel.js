const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;


const channelSchema = new Schema({
    _id: ShortId,
    name: String,
    slug: { type: String, index: true },    // For sharing videos from web to app and vice versa
    description: String,                    // Was used in old design
    category: String,
    thumbnail: String,
    logo: String,                           // Was used in old design, now only thumbnail is working
    hls_link: String,
    seq: Number,                            // Sequence for frontend
    active: Boolean,
    added_dtm: { type: Date, default: Date.now },
    last_modified: Date
});

module.exports = mongoose.model('Channel', channelSchema);