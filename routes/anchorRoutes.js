const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/anchorController')


router.route('/')
    .get(categoryController.get)
    .post(categoryController.post)
    .put(categoryController.put)
    .delete(categoryController.delete);


module.exports = router;
