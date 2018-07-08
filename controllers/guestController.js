const mongoose = require('mongoose');
const Guest = mongoose.model('Guest');


exports.post = async (req, res) => {

	let postData = req.body;
	console.log(postData);

	const guest = new Guest (postData);
	const result = await guest.save();
	
	console.log(`Guest Added: ${result.name}`);
    res.send("Guest Added!");
}

exports.get = async (req, res) => {

	const { _id, name } = req.query;
	let query = {};

	if (name) query.name = name;	
	if (_id) query._id = _id;

	console.log(query);
	
	let result;
	if (_id) {
		result = await Guest.findOne(query); 
		console.log("1st: Finding 1 guest");
	}
	else {
		result = await Guest.find(query).sort({weightage:-1});; 		// Sort by highest weightage
		console.log("2nd: Finding all guests");
	}

	res.send(result);
}

exports.put = async (req, res) => {

	const query = { _id: req.query._id };
	console.log("Query: ", query);
	
	let postBody = req.body;
	console.log("Body: ", postBody);
	
	const result = await Guest.updateOne(query, postBody);
	if (result.nModified == 0) {
		console.log('No Guest with this ID found!');
		res.send('No Guest with this ID found!');
	}
	else {
		console.log(`Guest Updated!`);
		res.send(`Guest Updated!`);
	}
}

exports.delete = async (req, res) => {
	const { _id } = req.query;
	const result = await Guest.findOneAndRemove( { _id } );
	console.log(result);
	if (result) {
		console.log(`Guest ID: ${_id}, Name: ${result.name} Deleted!`);
		res.send(`Guest ID: ${_id}, Name: ${result.name} Deleted!`);	
	}
	else {
		console.log('No Guest with this ID found!');
		res.send('No Guest with this ID found!');
	}
}