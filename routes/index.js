const express = require('express');
const router = express.Router();

router.use('/video',    require('./videoRoutes'));
router.use('/category', require('./categoryRoutes'));
router.use('/program',  require('./programRoutes'));
router.use('/anchor',   require('./anchorRoutes'));
router.use('/guest',    require('./guestRoutes'));
router.use('/topic',    require('./topicRoutes'));
router.use('/channel',  require('./channelRoutes'));

module.exports = router;