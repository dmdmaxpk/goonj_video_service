const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Topic = mongoose.model('Topic');


exports.post = async (req, res) => {

	let postData = req.body;
	postData.added_dtm = new Date();
	console.log(postData);

	const topic = new Topic (postData);
	const result = await topic.save();
	
	console.log(`Topic Added: ${result.title}`);
    res.send("Topic Added!");
}

exports.get = async (req, res) => {

	const { _id, title } = req.query;
	let query = {};

	if (title) query.title = title;	
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
	postBody.last_edited = new Date();
	console.log("Body: ", postBody);
	
	const result = await Topic.update(query, postBody);
	console.log("Resp: ", result);

	res.send("TOPIC UPDATED!!!");
}

exports.delete = async (req, res) => {
	const { _id } = req.query;
	const result = await Topic.findOneAndRemove( { _id } );
	console.log(result);
	if (result) {
		console.log(`Topic ID: ${_id}, Title: ${result.title} Deleted!`);
		res.send(`Topic ID: ${_id}, Title: ${result.title} Deleted!`);
	}
	else {
		console.log('No Topic with this ID found!');
		res.send('No Topic with this ID found!');
	}
}