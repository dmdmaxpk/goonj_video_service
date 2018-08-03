const mongoose = require('mongoose');
const config = require('./config');

// Connect to our Database:
mongoose.connect(config.mongoDB);

mongoose.connection.on('error', (err) => {
  console.error(`Error: ${err.message}`);
});

// import models
require('./models/Video');
require('./models/Category');
require('./models/Program');
require('./models/Anchor');
require('./models/Guest');
require('./models/Topic');
require('./models/Channel');

// Start our app!
const app = require('./app');
app.set('port', config.port);

const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});