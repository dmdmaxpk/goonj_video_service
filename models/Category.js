const mongoose = require('mongoose');
var ShortId = require('mongoose-shortid-nodeps');
const shortid = require('shortid');
const {Schema} = mongoose;

const subcatSchema = new Schema({ 
    _id: {
        type: String,
        'default': shortid.generate     //Because the mongoose shortid does not work on nested schemas
    },
    title: String,
    description: String,
    added_dtm: Date,
    last_edited: Date
});

const categorySchema = new Schema({
    _id: ShortId,
    title: String,
    description: String,
    sub_categories: [subcatSchema],
    added_dtm: Date,
    last_edited: Date
})
module.exports = mongoose.model('Category', categorySchema);