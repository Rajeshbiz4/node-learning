// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  district: { type: String, required: true },
  taluka: { type: String, required: true },
  village: { type: String, required: true },
  created_at: Date,
  updated_at: Date,
});

// the schema is useless so far
// we need to create a model using it
var customers = mongoose.model('customers', userSchema);

// make this available to our users in our Node applications
module.exports = customers;