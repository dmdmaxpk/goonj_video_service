const mongoose = require('mongoose');
const Channel = mongoose.model('Channel');


exports.post = async (req, res) => {

    const postData = req.body;
	console.log(postData);

	let channel = new Channel (postData);
	let result = await channel.save();
	
	console.log(`Channel Added: ${result.name}`);
    res.send(`Channel Added: ${result.name}`);
}

exports.get = async (req, res) => {

	let { _id, name, active } = req.query;
	const query = {};

	if (name) query.name = name;	
	if (_id) query._id = _id;
	if (active) query.active = JSON.parse(active);		// Conversion of string to Boolean

	console.log(query);
	
	let result;
	if (_id) {
		result = await Channel.findOne(query); 
		console.log("1st: Finding 1 channel");
	}
	else {
		result = await Channel.find(query).sort({seq:1});; 		// Sorting it by seq
		console.log("2nd: Finding all channel");
	}

	res.send(result);
}

exports.put = async (req, res) => {

	const query = { _id: req.query._id };
	console.log("Query: ", query);
	
	let postBody = req.body;
	postBody.last_modified = new Date();
	console.log("Body: ", postBody);
	
	const result = await Channel.updateOne(query, postBody);

	if (result.nModified == 0) {
		console.log('No channel with this ID found!');
		res.send('No channel with this ID found!');
	}
	else {
		console.log('Channel Updated!');
		res.send('Channel Updated!');
	}
}

exports.delete = async (req, res) => {
	const { _id } = req.query;
	const result = await Channel.findOneAndRemove( { _id } );
	console.log(result);
	if (result) {
		console.log(`Channel ID: ${_id}, Name: ${result.name} Deleted!`);
		res.send(`Channel ID: ${_id}, Name: ${result.name} Deleted!`);
	}
	else {
		console.log('No channel with this ID found!');
		res.send('No channel with this ID found!');
	}
}