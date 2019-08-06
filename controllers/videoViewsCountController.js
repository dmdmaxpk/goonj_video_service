const mongoose = require('mongoose');
const Video = mongoose.model('Video');
const axios = require('axios');
const config = require('../config');


// TO INCREASE VIDEO VIEW COUNT
exports.post = async (req, res) => {

    let conditions = {_id: req.body.id};
    let update = {
        $inc: {
            "views_count" : 1
        }
    };
    let options = { new: true, upsert: true, setDefaultsOnInsert: true }

    const result = await Video.findOneAndUpdate(conditions, update, options);		// Updating values
	res.send({"views_count": result._views_count});
}

// READ
exports.get = async (req, res) => {

    let conditions = {_id: req.body.id};
	const result = await Video.findOne(conditions);
    res.send({"views_count": result._views_count});
}