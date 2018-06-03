const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;


const topicSchema = new Schema({
    _id: ShortId,
    name: String,
    description: String,
    // keywords: Array,     // No need, replaced by description
    weightage: Number,      // From 1-10 based on high to low priority, 0=lowest and 10=highest
    valid: Boolean,
    added_dtm: Date,
    last_edited: Date
});

module.exports = mongoose.model('Topic', topicSchema);