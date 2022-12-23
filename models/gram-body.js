// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var gramBodySchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobile: { type: String, required: true },
  position: { type: String },
  type: { type: String, required: true },
  education: { type: String, required: true },
  ward : { type: String, required: true },
  age: { type: String },
  created_at: Date,
  updated_at: Date,
});

// the schema is useless so far
// we need to create a model using it
var gramBody = mongoose.model('gramBody', gramBodySchema);

// make this available to our users in our Node applications
module.exports = gramBody;