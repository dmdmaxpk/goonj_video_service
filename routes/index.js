const express = require('express');
const router = express.Router();

router.use('/video', require('./videoRoutes'));

module.exports = router