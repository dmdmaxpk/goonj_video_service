const mongoose = require('mongoose');
const Banner = mongoose.model('Banner');
const S3UploadService = require('../services/CloudStorageService')
const config = require('../config')
var rs = require("randomstring");
const mimeType = require('mime-types');

let s3UploadService = new S3UploadService();

// CREATE
exports.post = async (req, res) => {

	if (!req.files){
		res.send({status: false, message: 'Please upload a file'});
		return;
	}

	let file = req.files.file;
	let filename = getFileName(file);

	let postData = {};
	postData.file = file;
	postData.filename = filename;
	postData.bucket = config.s3ConfigObj.s3Bucket;
	postData.folderPath = config.s3ConfigObj.s3folderPath;

	let response = await s3UploadService.uploadFile(postData);
	if (response.status){
		// Saving document
		let banner = new Banner (postData);
		await banner.save();
	}

	res.send({status: response.status, file_path: response.file_path, message: response.message});
}

// READ
exports.get = async (req, res) => {

	let { _id, name, active } = req.query;
	const query = {};

	if (_id) query._id = _id;
	if (name) query.name = name;
	if (active) query.active = JSON.parse(active);		// Conversion of string to Boolean

	let result;
	if (_id || name)
		result = await Banner.findOne(query);
	else
		result = await Banner.find(query);

	result = computeData(result);
	res.send(result);
}

function computeData(result){
	let banners = [];
	if (result){
		for (let res of result){
			let url = config.s3ConfigObj.s3BasePath + res.folderPath + '/' + res.filename;
			banners.push(url);
		}
	}
	return {banners: banners};
}

function getFileName(file) {
	let mt = mimeType.lookup(file.name);
	let extension = mimeType.extension(mt);
	let timeInMillis = new Date().getTime();
	let random = rs.generate();

	let finalName = timeInMillis + "_" + random +"."+ extension;
	return finalName;
}