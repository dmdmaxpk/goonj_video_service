const mongoose = require('mongoose');
const City = mongoose.model('City');

// READ
exports.get = async (req, res) => {

	let { _id, city, province } = req.query;
	const query = {};

	if (_id) query._id = _id;
	if (city) query.city = city;
	if (province) query.province = province;		// Conversion of string to Boolean

	let result;
	if (_id || city)
		result = await City.findOne(query);
	else
		result = await City.find(query).sort({city: 1});

	res.send(result);
}