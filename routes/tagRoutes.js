const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController')


router.route('/')
    .get(tagController.get)
    .post(tagController.post)
    .put(tagController.put)
    .delete(tagController.delete);

    
module.exports = router;
