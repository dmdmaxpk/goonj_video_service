const mongoose = require('mongoose');
const Topic = mongoose.model('Topic');


exports.post = async (req, res) => {

	let postData = req.body;
	console.log(postData);

	const topic = new Topic (postData);
	const result = await topic.save();
	
	console.log(`Topic Added: ${result.name}`);
    res.send("Topic Added!");
}

exports.get = async (req, res) => {

	const { _id, name } = req.query;
	let query = {};

	if (name) query.name = name;	
	if (_id) query._id = _id;

	console.log(query);
	
	let result;
	if (_id) {
		result = await Topic.findOne(query); 
		console.log("1st: Finding 1 topic");
	}
	else {
		result = await Topic.find(query).sort({weightage:-1});; 		// Sort by highest weightage
		console.log("2nd: Finding all topics");
	}

	res.send(result);
}

exports.put = async (req, res) => {

	const query = { _id: req.query._id };
	console.log("Query: ", query);
	
	let postBody = req.body;
	console.log("Body: ", postBody);
	
	const result = await Topic.updateOne(query, postBody);

	if (result.nModified == 0) {
		console.log('No Topic with this ID found!');
		res.send('No Topic with this ID found!');
	}
	else {
		console.log(`TOPIC Updated!`);
		res.send(`TOPIC Updated!`);
	}

}

exports.delete = async (req, res) => {
	const { _id } = req.query;
	const result = await Topic.findOneAndRemove( { _id } );
	console.log(result);
	if (result) {
		console.log(`Topic ID: ${_id}, Name: ${result.name} Deleted!`);
		res.send(`Topic ID: ${_id}, Name: ${result.name} Deleted!`);
	}
	else {
		console.log('No Topic with this ID found!');
		res.send('No Topic with this ID found!');
	}
}