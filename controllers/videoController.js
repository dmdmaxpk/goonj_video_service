const mongoose = require('mongoose');
const Video = mongoose.model('Video');
const axios = require('axios');
const config = require('../config');
const VideoRepository = require('../repos/VideoRepository');
videoRepository = new VideoRepository();


// CREATE
exports.post = async (req, res) => {

    let postData = req.body;

	// Saving document
	console.log("Post Data",postData);
	let video = new Video (postData);
	console.log("video",video);
	let result = await video.save();
	
	console.log(`Video Added: ${result._id}`);
	
	// Adding operator name for transcoding service:
	result._doc.operator = 'telenor';	// _doc (field in object, IDK!!)
	// After saving it to DB, sending tuple to transcoding service:
	axios.post(config.transcodeServiceUrl, result)
		.then( response => console.log(response.data) )
		.catch( error => console.log(error) )

    res.send(`Video Added: ${result._id}`);
}

// READ
exports.get = async (req, res) => {

	let { _id, title, category, sub_category, sub_sub_category, added_dtm, active, feed, anchor, topics, pinned, skip, limit } = req.query;
	const query = {};

	if (_id) query._id = _id;
	if (title) query.title = title;	
	if (category) query.category = category;
	if (sub_category) query.sub_category = sub_category;
	if (sub_sub_category) query.sub_sub_category = sub_sub_category;

	if (anchor) query.anchor = { $in: anchor.split(',') } 
	if (topics) query.topics = { $in: topics.split(',') } 
	if (added_dtm) query.added_dtm = added_dtm;
	if (feed) query.feed = feed;
	if (active) query.active = active;
	if (pinned) query.pinned = JSON.parse(pinned);		// Conversion of string to Boolean

	let result;
	
	// Single document
	if (_id) {
		result = await Video.findOne(query); 
		console.log(`GET Video by ID=${_id}`);
	}
	// All documents
	else {
		result = await Video.find(query).sort({ added_dtm: -1 }).limit(Number(limit) || 16);  		// Sorting by added_dtm && Applying limit if provided otherwise default 16
	}

	res.send(result);
}

// UPDATE
exports.put = async (req, res) => {

	const query = { _id: req.query._id };
	console.log("query",query);
	let postBody = req.body;
	postBody.last_modified = new Date();	// Adding last_modified on video update
	
	const result = await Video.updateOne(query, postBody);		// Updating values
	
	if (result.nModified == 0) {
		console.log('No Video with this ID found!');
		res.send('No Video with this ID found!');
	}
	else {
		console.log(`Video Updated!`);
		res.send(`Video Updated!`);
	}
}

// DELETE
exports.delete = async (req, res) => {

	const query = { _id: req.query._id };

	const result = await Video.findOneAndRemove( query );	// Removing document based on the _id provided
	
	if (result) {
		console.log(`Video _id: ${query._id} Deleted!`);
		res.send(`Video _id: ${query._id} Deleted!`);
	}
	else {
		console.log('No video with this ID found!');
		res.send('No video with this ID found!');
	}
}


// Get recommended videos by file name
exports.getRecommended = async (req, res) => {
	let query = req.query;
	let recommended = [], alreadyFetchedIds = [query._id];
	let result = await Video.findOne({_id: query._id});
	if (result) {

		let queryParams;
			//Fetch Last Two Records
		queryParams = prepareQuery(result);
		let lastTwoRecords = await getPrevious(result, queryParams);
		if (lastTwoRecords.length > 0) {
			recommended = recommended.concat(lastTwoRecords);

			let ids = getIds(lastTwoRecords);
			alreadyFetchedIds = alreadyFetchedIds.concat(ids);
		}

		//Fetch Next Two Records
		queryParams = prepareQuery(result);
		let nextTwoRecords = await getNextVideos(result, queryParams);
		if (nextTwoRecords.length > 0) {
			recommended = recommended.concat(nextTwoRecords);

			let ids = getIds(nextTwoRecords);
			alreadyFetchedIds = alreadyFetchedIds.concat(ids);
		}
	}

	console.log('alreadyFetchedIds: ', alreadyFetchedIds);

	//Fetch Next Highly Recommended Data
	let otherRecommendedVideos = await getHighlyRecommendedVideos(alreadyFetchedIds);
	if (otherRecommendedVideos.length > 0)
		recommended = recommended.concat(otherRecommendedVideos);

	res.send({code: 1, recommended: recommended, message: 'Recommended VODs'});
}

function prepareQuery(result){
	let queryParams = {};
	let category = result.category;
	queryParams.category = category;
	if(category === 'featured' || category === 'viral' || category === 'corona'){
		//
	}
	else if (category === 'comedy' || category === 'news' || category === 'sports' || category === 'education' || category === 'premium' || category === 'entertainment'){
		queryParams.source = result.source;
	}
	else if (category === 'programs' || category === 'food'){
		queryParams.source = result.source;
		queryParams.sub_category = result.sub_category;
		queryParams.anchor = result.anchor;
	}
	else if (category === 'drama'){
		queryParams.source = result.source;
		queryParams.sub_category = result.sub_category;
	}

	return queryParams;
}

async function getPrevious(result, queryParams){
	queryParams.last_modified = {$lt: new Date(result.last_modified)};
	console.log('getPrevious - queryParams: ', queryParams);

	let lastTwoRecords = await videoRepository.getViewerInterestedData( queryParams, 1, 2 );
	console.log('lastTwoRecords: ', lastTwoRecords);

	if (lastTwoRecords.length === 0){
		if(queryParams.hasOwnProperty('anchor')){
			delete queryParams.anchor;
			lastTwoRecords = await getNextVideos(result, queryParams);
		}
		else if(queryParams.hasOwnProperty('program')){
			delete queryParams.program;
			lastTwoRecords = await getNextVideos(result, queryParams);
		}
		else if(queryParams.hasOwnProperty('source')){
			delete queryParams.source;
			lastTwoRecords = await getNextVideos(result, queryParams);
		}
	}

	return lastTwoRecords;
}

async function getNextVideos(result, queryParams){
	queryParams.last_modified = {$gt: new Date(result.last_modified)};
	console.log('nextTwoRecords - queryParams: ', queryParams);

	let nextTwoRecords = await videoRepository.getViewerInterestedData( queryParams, 1,5 );
	console.log('nextTwoRecords: ', nextTwoRecords);

	if (nextTwoRecords.length === 0){
		if(queryParams.hasOwnProperty('anchor')){
			delete queryParams.anchor;
			nextTwoRecords = await getNextVideos(result, queryParams);
		}
		else if(queryParams.hasOwnProperty('program')){
			delete queryParams.program;
			nextTwoRecords = await getNextVideos(result, queryParams);
		}
		else if(queryParams.hasOwnProperty('source')){
			delete queryParams.source;
			nextTwoRecords = await getNextVideos(result, queryParams);
		}
	}

	return nextTwoRecords;
}

async function getHighlyRecommendedVideos(alreadyFetchedIds){
	let today = new Date();
	let otherRecommendedVideos = await videoRepository.getOtherHighRecommendedData( today, alreadyFetchedIds, -1,20);
	console.log('otherRecommendedVideos: ', otherRecommendedVideos.length);

	return otherRecommendedVideos;
}

function getIds(records){
	let ids = [];
	if (records) for (const record of records) ids.push(record._id);
	return ids;
}
