const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;


const topicSchema = new Schema({
    _id: ShortId,
    name: String,
    description: String,
    weightage: Number,      // From 1-10 based on high to low priority, 0=lowest and 10=highest
    valid: Boolean,
    added_dtm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Topic', topicSchema);