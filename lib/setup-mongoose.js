/** Created by Gloria Anholt on 11/2/16. **/

const mongoose = require('mongoose');

// Set the URI to point to our database
const dbURI = 'mongodb://localhost/portland' || process.env.MONGODB_URI;

mongoose.Promise = Promise;
mongoose.connect( dbURI );

// CONNECTION EVENTS
mongoose.connection.on('connected', () => {
  console.log( 'Mongoose default connection open to ', dbURI );
});

mongoose.connection.on('error', (err) => {
  console.error( 'Mongoose default connection error: ', err );
});

mongoose.connection.on('disconnected', () => {
  console.log( 'Mongoose default connection disconnected' );
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log( 'Mongoose default connection disconnected through app termination' );
    process.exit(0);
  });
});

module.exports = mongoose.connection;