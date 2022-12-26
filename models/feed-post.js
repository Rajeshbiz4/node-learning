// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var feedsSchema = new Schema({
  title: { type: String, required: true },
  detail_desc: { type: String, required: true },
  file: { type: String },
  status: { type: String, required: true }, // approved, pending
  created_at: Date,
  updated_at: Date,
});

// the schema is useless so far
// we need to create a model using it
var complaints = mongoose.model('feeds', feedsSchema);

// make this available to our users in our Node applications
module.exports = complaints;