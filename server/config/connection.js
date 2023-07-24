// Load the Mongoose ORM
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/book', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'book'
});

module.exports = mongoose.connection;