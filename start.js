const mongoose = require('mongoose');

// Connect to our Database:
mongoose.connect("mongodb://localhost:27017/mongoose");

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
app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});