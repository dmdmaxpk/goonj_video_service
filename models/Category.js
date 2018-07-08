const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const shortid = require('shortid');
const {Schema} = mongoose;


const subcatSchema = new Schema({ 
    _id: {
        type: String,
        'default': shortid.generate     //Because the mongoose shortid does not work on nested schemas
    },
    name: String,
    description: String,
    added_dtm: { type: Date, default: Date.now }
});

const categorySchema = new Schema({
    _id: ShortId,
    name: String,
    description: String,
    sub_categories: [subcatSchema],
    added_dtm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema);