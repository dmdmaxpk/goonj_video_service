const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Video = mongoose.model('Video');
const shortid = require('shortid');


// shortid
// shortid.generate().replace(/-/g, '~')

/* TEST ADD */
router.get('/testadd', function (req, res, next) {

	console.log(shortid.generate());
	let video = new Video(
		{ title: 'mongo 6',
		sID: shortid.generate(),
		slug: 'mongo-6',
		program: 'aaaaaaaaaaaaaaa',
		thumbnail: 'tst.jpg',
		file_name: 'tes_127.m4v',
		duration: '2:00',
		feed: 'home',
		anchor: 'Mohsin Shahnawaz Ranjha',
		category: 'technology',
		sub_category: 'military',
		source: '8XM',
		tags: [ 'Peshawar Zalmi', 'Karachi Kings', 'Pakistan Super League 3' ],
		topics: [ 'Zalmi', 'Kings', 'Super' ],
		guests:
		[ 'Murtaza Javed Abbasi',
		'Mian Javed Latif',
		'Ahmad Raza Khan Kasuri' ] }
 	);

	video.save(function (error) {
		console.log("Your data has been saved.");
		if (error) {
			console.error(error);
		}
	});

	res.send('respond with a resource');
});


// ------------CREATE-----------------------
router.post('/add', async (req, res, next) => {

	const postData = req.body;
	console.log(postData);

	postData.sID = shortid.generate();
	postData.year = new Date().getFullYear();
	postData.active = false;
	postData.transcoding_status = false;

	let video = new Video (postData);
	let videoAdd = await video.save();

	console.log("POSTED!!");
	res.send(videoAdd);

});


// ------------READ-----------------------
router.get('/view', async (req, res, next) => {

	// let sID = req.params.sID;
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
	
	let videos;
	if (_id || _id) {
		videos = await Video.findOne(query); 
		console.log("1st");
	}
	else {
		videos = await Video.find(query); 
		console.log("1st");
	}

	// console.log(videos);
	res.send(videos);

	// SAMPLES:
	// select only the adventures name and length
	// Video.findById(id, 'name length').exec(callback);

	// include all properties except for `length`
	// Video.findById(id, '-length').exec(function (err, video) {});

});


// ------------UPDATE-----------------------
router.put('/update/:id', async (req, res, next) => {

	//TODO: POST the form on the shortid
	// var query = { title: req.params.id };


	var query = { title: 'Test title' };
	console.log(query);
	
	//TODO: Only send the data that is edited from the CMS, event listners on edit boxes
	var body = {
		category: 'bbbbbb',
		sub_category: 'ddddddddd',
		sub_category1: 'eeeeeeeeeeeeeee'		//It adds the one also which is not in the tuple
	}

	const videos = await Video.update(query, body);
	console.log(videos);

	const postData = req.body;
	console.log(postData);

})


router.get('/delete/:sID', async (req, res, next) => {
	const videos = await Video.findOneAndRemove({
		// auid: req.params.id
		sID: 'B1ybkHd6f'
	});
});

module.exports = router;
