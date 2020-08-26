const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const shortid = require('shortid');
const {Schema} = mongoose;

const subcatSchema = new Schema({ 
    _id: { type: ShortId, 'default': shortid.generate },
    name: { type: String  },
    description: String,
    sub_categories: Array,
    added_dtm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SubCategory', subcatSchema);