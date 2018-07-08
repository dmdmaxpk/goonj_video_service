const mongoose = require('mongoose');
const Anchor = mongoose.model('Anchor');


exports.post = async (req, res) => {

	let postData = req.body;
	console.log(postData);

	const anchor = new Anchor (postData);
	const result = await anchor.save();
	
	console.log(`Anchor Added: ${result.name}`);
    res.send("Anchor Added!");
}

exports.get = async (req, res) => {

	const { _id, name } = req.query;
	let query = {};

	if (name) query.name = name;	
	if (_id) query._id = _id;

	console.log(query);
	
	let result;
	if (_id) {
		result = await Anchor.findOne(query); 
		console.log("1st: Finding 1 anchor");
	}
	else {
		result = await Anchor.find(query).sort({weightage:-1});; 		// Sort by highest weightage
		console.log("2nd: Finding all anchors");
	}

	res.send(result);
}

exports.put = async (req, res) => {

	const query = { _id: req.query._id };
	console.log("Query: ", query);
	
	let postBody = req.body;
	console.log("Body: ", postBody);
	
	const result = await Anchor.updateOne(query, postBody);
	if (result.nModified == 0) {
		console.log('No Anchor with this ID found!');
		res.send('No Anchor with this ID found!');
	}
	else {
		console.log(`Anchor Updated!`);
		res.send(`Anchor Updated!`);
	}
}

exports.delete = async (req, res) => {
	const { _id } = req.query;
	const result = await Anchor.findOneAndRemove( { _id } );
	console.log(result);
	if (result) {
		console.log(`Anchor ID: ${_id}, Name: ${result.name} Deleted!`);
		res.send(`Anchor ID: ${_id}, Name: ${result.name} Deleted!`);	
	}
	else {
		console.log('No Anchor with this ID found!');
		res.send('No Anchor with this ID found!');
	}
}