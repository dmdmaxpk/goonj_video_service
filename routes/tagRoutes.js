const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController')


router.route('/')
    .get(tagController.view)
    .post(tagController.add)
    .put(tagController.update)
    .delete(tagController.delete);

    
module.exports = router;
