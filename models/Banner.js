const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;

const BannerSchema = new Schema({
    _id: ShortId,
    thumbnail: String,
    name: String,
    active: { type: Boolean, default: true } ,
    added_dtm: { type: Date, default: Date.now },
    last_modified: Date
});

module.exports = mongoose.model('Banner', BannerSchema);