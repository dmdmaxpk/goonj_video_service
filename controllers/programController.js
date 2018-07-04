const mongoose = require('mongoose');
const Program = mongoose.model('Program');


exports.post = async (req, res) => {

    const postData = req.body;
	console.log(postData);

	let program = new Program (postData);
	let result = await program.save();
	
	console.log(`Program Added: ${result.name}`);
    res.send("Program Added!");
}

exports.get = async (req, res) => {

	let { _id, name } = req.query;
	const query = {};

	if (name) query.name = name;	
	if (_id) query._id = _id;

	console.log(query);
	
	let result;
	if (_id) {
		result = await Program.findOne(query); 
		console.log("1st: Finding 1 program");
	}
	else {
		result = await Program.find(query).sort({_id:-1});
		console.log("2nd: Finding all programs");
	}

	res.send(result);
}

exports.put = async (req, res) => {

	const query = { _id: req.query._id };
	console.log("Query: ", query);
	
	let postBody = req.body;
	postBody.last_edited = new Date();
	console.log("Body: ", postBody);
	
	const result = await Program.updateOne(query, postBody);

	if (result.nModified == 0) {
		console.log('No program with this ID found!');
		res.send('No program with this ID found!');
	}
	else {
		console.log('Program Updated!');
		res.send('Program Updated!');
	}
}

exports.delete = async (req, res) => {
	const { _id } = req.query;
	const result = await Program.findOneAndRemove( { _id } );
	console.log(result);
	if (result) {
		console.log(`Program ID: ${_id}, Name: ${result.name} Deleted!`);
		res.send(`Program ID: ${_id}, Name: ${result.name} Deleted!`);
	}
	else {
		console.log('No program with this ID found!');
		res.send('No program with this ID found!');
	}
}