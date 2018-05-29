const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Tag = mongoose.model('Tag');


exports.add = async (req, res) => {

    const postData = req.body;
	console.log(postData);

	let tag = new Tag (postData);
	let result = await tag.save();
	
	console.log(`Tag Added: ${result.title}`);
    res.send("Tag Added!");
}

exports.view = async (req, res) => {

	let { _id, title } = req.query;
	const query = {};

	if (title) query.title = title;	
	if (_id) query._id = _id;

	console.log(query);
	
	let result;
	if (_id) {
		result = await Tag.findOne(query); 
		console.log("1st: Finding 1 tag");
	}
	else {
		result = await Tag.find(query).sort({_id:-1});; 		// _id field it has a date embedded in it ... so you can use that to order by 
		console.log("2nd: Finding all tags");
	}

	res.send(result);
}

exports.update = async (req, res) => {

	const query = { _id: req.query._id };
	console.log("Query: ", query);
	
	let postBody = req.body;
	postBody.last_edited = new Date();
	console.log("Body: ", postBody);
	
	const result = await Tag.update(query, postBody);
	console.log("Resp: ", result);

	res.send("TAG UPDATED!!!");
}

exports.delete = async (req, res) => {
	const { _id } = req.query;
	const result = await Tag.findOneAndRemove( { _id } );
	console.log(result);
	if (result) {
		console.log(`Tag ID: ${_id}, Title: ${result.title} Deleted!`);
		res.send(`Tag ID: ${_id}, Title: ${result.title} Deleted!`);
	}
	else {
		console.log('No tag with this ID found!');
		res.send('No tag with this ID found!');
	}
}