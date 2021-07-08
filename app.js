const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const mongoose = require('mongoose');
const fileupload = require('express-fileupload');
const config = require('./config');

const app = express();

// Middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(mongoSanitize());
app.use(fileupload());

// Connection to Database
mongoose.connect(config.mongoDB);
mongoose.connection.on('error', err => console.error(`Error: ${err.message}`));

// Import database models
require('./models/Video');
require('./models/Category');
require('./models/Program');
require('./models/Anchor');
require('./models/Guest');
require('./models/Topic');
require('./models/Channel');
require('./models/SubCategory');
require('./models/Banner');
require('./models/City');

// Import routes
app.use('/', require('./routes/index'));

// Start Server
let { port } = config;
app.listen(port, () => console.log(`APP running on port ${port}`));