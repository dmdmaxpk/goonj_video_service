const express = require('express');
const router = express.Router();

router.use('/video', require('./videoRoutes'));
router.use('/category', require('./categoryRoutes'));

module.exports = router