const express = require('express');
const router = express.Router();
const channelViewsCountController = require('../controllers/channelViewsCountController')


router.route('/')
    .post(channelViewsCountController.post);


module.exports = router;
