const mongoose = require('mongoose');
const {Schema} = mongoose;

const videoSchema = new Schema({
    //Original 36 in Old
    //New 21
    title: {
        type: String
    },
    category: {
        type: String
    },
    sub_category: {
        type: String
    },
    year: {
        type: Number
    },
    added_dtm: {
        type: Date
    },
    active: {
        type: Boolean
    },
    anchor: {
        type: String
    },
    bit_rates: {
        type: Array
    },
    description: {
        type: String
    },
    duration: {
        type: String
    },
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
    file_name: {
        type: String
    },
    guests: {
        type: Array
    },
    last_edited: {
        type: String
    },
    program: {
        type: String
    },
    publish_dtm: {
        type: Date
    },
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
    slug: {
        type: String
    },
    source: {
        type: String
    },
    tags: {
        type: Array
    },
    thumbnail: {
        type: String
    },
    topics: {
        type: Array
    },
    transcoding_status: {
        type: Boolean
    }
}, { strict: false })

module.exports = mongoose.model('Video', videoSchema);