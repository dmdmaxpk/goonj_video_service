const mongoose = require('mongoose');
const City = mongoose.model('City');

// READ
exports.get = async (req, res) => {

	let { _id, name, province } = req.query;
	const query = {};

	if (_id) query._id = _id;
	if (name) query.name = name;
	if (province) query.province = province;		// Conversion of string to Boolean

	let result;
	if (_id || name)
		result = await City.findOne(query);
	else
		result = await City.find(query).sort({city: 1});

	res.send(result);
}