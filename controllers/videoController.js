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

	let { _id, title, category, sub_category, sub_sub_category, source, program, added_dtm, active, feed, anchor, topics, pinned, sort_mode, skip, limit } = req.query;
	const query = {};

	if (_id) query._id = _id;
	if (title) query.title = title;	
	if (category) query.category = category;
	if (sub_category) query.sub_category = sub_category;
	if (sub_sub_category) query.sub_sub_category = sub_sub_category;
	if (source) query.source = source;
	if (program) query.program = program;

	if (anchor) query.anchor = { $in: anchor.split(',') } 
	if (topics) query.topics = { $in: topics.split(',') } 
	if (added_dtm) query.added_dtm = added_dtm;
	if (feed) query.feed = feed;
	if (active) query.active = active;
	if (pinned) query.pinned = JSON.parse(pinned);		// Conversion of string to Boolean

	let result;
	if (sort_mode === 'view_count'){
		result = await Video.find(query).sort({ views_count: -1 }).limit(Number(limit) || 10);
	}
	else{
		// Single document
		if (_id) {
			result = await Video.findOne(query);
			console.log(`GET Video by ID=${_id}`);
		}
		// All documents
		else {
			result = await Video.find(query).sort({ pinned: -1, added_dtm: -1 }).limit(Number(limit) || 16);  		// Sorting by added_dtm && Applying limit if provided otherwise default 16
		}
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
	let queryParams = {}, recommended = [], alreadyFetchedIds = [query._id];
	let result = await Video.findOne({_id: query._id});
	if (result) {

		//Fetch Last Two Records
		queryParams = prepareQuery(result, 'prev');
		let lastTwoRecords = await getPrevious(result, queryParams);
		console.log('lastTwoRecords:length: ', lastTwoRecords.length)

		if (lastTwoRecords.length > 0) {
			recommended = recommended.concat(lastTwoRecords);

			let ids = getIds(lastTwoRecords);
			alreadyFetchedIds = alreadyFetchedIds.concat(ids);
		}

		//Fetch Next Two Records
		queryParams = prepareQuery(result, 'next');
		let nextTwoRecords = await getNextVideos(result, queryParams);
		console.log('nextTwoRecords:length: ', nextTwoRecords.length)

		if (nextTwoRecords.length > 0) {
			recommended = recommended.concat(nextTwoRecords);

			let ids = getIds(nextTwoRecords);
			alreadyFetchedIds = alreadyFetchedIds.concat(ids);
		}
	}

	//Fetch Next Highly Recommended Data
	queryParams = prepareQuery(result, 'topRated');
	let otherRecommendedVideos = await getHighlyRecommendedVideos(queryParams, alreadyFetchedIds, 20);
	console.log('otherRecommendedVideos:length: ', otherRecommendedVideos.length)
	if (otherRecommendedVideos.length > 0)
		recommended = recommended.concat(otherRecommendedVideos);

	// Finally return the response
	res.send(recommended);
}

function prepareQuery(result, type){
	let queryParams = {};
	if (type === 'topRated') queryParams.source = result.source;
	else {
		let category = result.category;
		queryParams.category = category;
		if (category === 'featured' || category === 'viral') {
			queryParams.source = result.source;
			queryParams.feed = result.feed;
		} else if (category === 'corona' || category === 'viral') {
			queryParams.source = result.source;
		} else if (category === 'comedy' || category === 'news' || category === 'sports' || category === 'education' || category === 'premium' || category === 'entertainment') {
			queryParams.source = result.source;
		} else if (category === 'programs' || category === 'food') {
			queryParams.source = result.source;
			queryParams.program = result.program;
			queryParams.anchor = result.anchor;
		} else if (category === 'drama') {
			queryParams.source = result.source;
			queryParams.sub_category = result.sub_category;
		}
	}
	return queryParams;
}

async function getPrevious(result, queryParams){
	queryParams.last_modified = {$lt: new Date(result.last_modified)};
	let lastTwoRecords = await videoRepository.getViewerInterestedDataPrevious( queryParams, -1, 1, 2 );

	if (lastTwoRecords.length === 0){
		if(queryParams.hasOwnProperty('anchor')){
			delete queryParams.anchor;
			lastTwoRecords = await getPrevious(result, queryParams);
		}
		else if(queryParams.hasOwnProperty('program')){
			delete queryParams.program;
			lastTwoRecords = await getPrevious(result, queryParams);
		}
		else if(queryParams.hasOwnProperty('sub_category')){
			delete queryParams.sub_category;
			lastTwoRecords = await getPrevious(result, queryParams);
		}
		else if(queryParams.hasOwnProperty('source')){
			delete queryParams.source;
			lastTwoRecords = await getPrevious(result, queryParams);
		}
		else if(queryParams.hasOwnProperty('feed')){
			delete queryParams.feed;
			lastTwoRecords = await getPrevious(result, queryParams);
		}
	}

	return lastTwoRecords;
}

async function getNextVideos(result, queryParams){
	queryParams.last_modified = {$gt: new Date(result.last_modified)};
	let nextTwoRecords = await videoRepository.getViewerInterestedDataNext( queryParams, 1, 5);

	if (nextTwoRecords.length === 0){
		if(queryParams.hasOwnProperty('anchor')){
			delete queryParams.anchor;
			nextTwoRecords = await getNextVideos(result, queryParams);
		}
		else if(queryParams.hasOwnProperty('program')){
			delete queryParams.program;
			nextTwoRecords = await getNextVideos(result, queryParams);
		}
		else if(queryParams.hasOwnProperty('sub_category')){
			delete queryParams.sub_category;
			nextTwoRecords = await getNextVideos(result, queryParams);
		}
		else if(queryParams.hasOwnProperty('source')){
			delete queryParams.source;
			nextTwoRecords = await getNextVideos(result, queryParams);
		}
		else if(queryParams.hasOwnProperty('feed')){
			delete queryParams.feed;
			nextTwoRecords = await getNextVideos(result, queryParams);
		}
	}

	return nextTwoRecords;
}

async function getHighlyRecommendedVideos(queryParams, alreadyFetchedIds, limit){
	let otherRecommended = [], today = new Date();
	let otherRecommendedVideos = await videoRepository.getOtherHighRecommendedData( queryParams, today, alreadyFetchedIds, -1, limit);
	otherRecommended = otherRecommended.concat(otherRecommendedVideos);

	if (otherRecommendedVideos.length < limit){
		if(queryParams.hasOwnProperty('source'))
			delete queryParams.source;

		if (otherRecommendedVideos.length > 0){
			let ids = getIds(otherRecommendedVideos);
			alreadyFetchedIds = alreadyFetchedIds.concat(ids);
		}

		limit = Number(limit) - Number(otherRecommendedVideos.length);
		otherRecommendedVideos = await getHighlyRecommendedVideos(queryParams, alreadyFetchedIds, limit);
		if (otherRecommendedVideos.length > 0)
			otherRecommended = otherRecommended.concat(otherRecommendedVideos);
	}

	return otherRecommended;
}

function getIds(records){
	let ids = [];
	if (records) for (const record of records) ids.push(record._id);
	return ids;
}
