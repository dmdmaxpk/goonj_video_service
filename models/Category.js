const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;


// Sub category can be removed as they were removed from frontend in new design (Just keeping in case they change their mind)
const categorySchema = new Schema({
    _id: ShortId,
    name: { type: String },
    sub_categories: Array,
    added_dtm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema);