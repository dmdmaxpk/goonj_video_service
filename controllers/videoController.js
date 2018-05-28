const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Video = mongoose.model('Video');
const shortid = require('shortid');


// shortid
// shortid.generate(). OR replace(/-|_/g, '~')

exports.post = async (req, res) => {

    let postData = req.body;
	console.log(postData);

	postData.sID = shortid.generate();
	postData.year = new Date().getFullYear();
	postData.active = false;
	postData.transcoding_status = false;

	let video = new Video (postData);
	let result = await video.save();

	//After saving it to DB, send the tuple for transcoding service:
	//axios
	
	console.log(`Video Added: ${result.title}`);
    res.send("Video Added!");
}

exports.get = async (req, res) => {

	let { _id, sID, title, category, duration, added_dtm, sub_category, active, feed } = req.query;
	const query = {};

	if (title) query.title = title;	
	if (category) query.category = category;
	if (duration) query.duration = duration;
	if (added_dtm) query.added_dtm = added_dtm;
	if (feed) query.feed = feed;
	if (sID) query.sID = sID;
	if (_id) query._id = _id;
	if (active) query.active = active;

	console.log(query);
	
	let result;
	if (_id || sID) {
		result = await Video.findOne(query); 
		console.log("1st");
	}
	else {
		result = await Video.find(query).sort({_id:-1});; 		// _id field has a date embedded in it, so we can use that to order 
		console.log("2nd");
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

	const query = { sID: req.query.sID };
	console.log("Query: ", query);
	
	let postBody = req.body;
	postBody.last_edited = new Date();
	console.log("Body: ", postBody);
	
	const result = await Video.update(query, postBody);
	console.log("Result: ", result);

	res.send("VIDEO UPDATED!!!");
}

exports.delete = async (req, res) => {
	const { sID } = req.query;
	const result = await Video.findOneAndRemove( { sID } );
	
	if (result) {
		console.log(`Video sID: ${sID} Deleted!`);
		res.send(`Video sID: ${sID} Deleted!`);
	}
	else {
		console.log('No video with this ID found!');
		res.send('No video with this ID found!');
	}
}