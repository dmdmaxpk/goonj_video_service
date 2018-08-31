const mongoose = require('mongoose');
const Video = mongoose.model('Video');
const axios = require('axios');
const config = require('../config');

exports.post = async (req, res) => {

    let postData = req.body;

	let video = new Video (postData);
	let result = await video.save();
	
	console.log(`Video Added: ${result._id}`);
	
	// Adding operator name for transcoding service:
	result._doc.operator = 'telenor';	// _doc (field in object, IDK!!)

	//After saving it to DB, sending tuple to transcoding service:
	axios.post(config.transcodeServiceUrl, result)
	.then( response => console.log(response.data))
	.catch( error => console.log(error))

    res.send(`Video Added: ${result._id}`);
}

exports.get = async (req, res) => {

	let { _id, title, category, sub_category, added_dtm, active, feed, anchor, topics, pinned, skip, limit } = req.query;
	const query = {};

	if (_id) query._id = _id;
	if (title) query.title = title;	
	if (category) query.category = category;
	if (sub_category) query.sub_category = sub_category;
	if (anchor) query.anchor = { $in: anchor.split(',') } 
	if (topics) query.topics = { $in: topics.split(',') } 
	if (added_dtm) query.added_dtm = added_dtm;
	if (feed) query.feed = feed;
	if (active) query.active = active;
	if (pinned) query.pinned = JSON.parse(pinned);		// Conversion of string to Boolean

	console.log(query);
	
	let result;

	// TODO: Skip and Limit queries e.g: https://www.codementor.io/arpitbhayani/fast-and-efficient-pagination-in-mongodb-9095flbqr
	
	if (_id) {		//If _id then findOne
		result = await Video.findOne(query); 
		console.log(`GET Video by ID=${_id}`);
	}
	else {
		result = await Video.find(query).sort({added_dtm:-1}).limit(Number(limit) || 16);  		// Sorting by added_dtm && Applying limit if provided otherwise default 16
		console.log(`GET All Videos`);
	}

	res.send(result);
	
	// SAMPLES:
	// select only the adventures name and length
	// Video.findById(id, 'name length').exec(callback);

	// include all properties except for `length`
	// Video.findById(id, '-length').exec(function (err, video) {});

	// FOR PREFERENCE:
	// The following example retrieves all documents from the inventory collection where status equals either "A" or "D": (IN AN ARRAY)
	// db.inventory.find( { status: { $in: [ "A", "D" ] } } )

	// AND in Mongo:
	// The following example retrieves all documents in the inventory collection where the status equals "A" and qty is less than ($lt) 30:
	// db.inventory.find( { status: "A", qty: { $lt: 30 } } )

	// OR in Mongo:
	// The following example retrieves all documents in the collection where the status equals "A" or qty is less than ($lt) 30:
	// db.inventory.find( { $or: [ { status: "A" }, { qty: { $lt: 30 } } ] } )
}

exports.put = async (req, res) => {

	const query = { _id: req.query._id };
	console.log("Query: ", query);
	
	let postBody = req.body;
	postBody.last_modified = new Date();
	console.log("Body: ", postBody);
	
	const result = await Video.updateOne(query, postBody);
	
	if (result.nModified == 0) {
		console.log('No Video with this ID found!');
		res.send('No Video with this ID found!');
	}
	else {
		console.log(`Video Updated!`);
		res.send(`Video Updated!`);
	}
}

exports.delete = async (req, res) => {

	const query = { _id: req.query._id };

	const result = await Video.findOneAndRemove( query );
	
	if (result) {
		console.log(`Video _id: ${query._id} Deleted!`);
		res.send(`Video _id: ${query._id} Deleted!`);
	}
	else {
		console.log('No video with this ID found!');
		res.send('No video with this ID found!');
	}
}