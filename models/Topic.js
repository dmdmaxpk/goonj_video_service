const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;


const topicSchema = new Schema({
    _id: ShortId,
    name: { type: String, trim: true },
    description: String,
    weightage: Number,      // From 1-10 based on high to low priority, 0=lowest and 10=highest
    added_dtm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Topic', topicSchema);