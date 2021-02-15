const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');


router.route('/')
    .get(bannerController.get)
    .post(bannerController.post)

module.exports = router;
