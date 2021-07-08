const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;

const CitySchema = new Schema({
    _id: ShortId,
    city: String,
    lat: String,
    lng: String,
    province: String
});

module.exports = mongoose.model('City', CitySchema);