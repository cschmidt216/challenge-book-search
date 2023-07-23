const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/googlebooks',
  {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  }
);

module.exports = mongoose.connection;