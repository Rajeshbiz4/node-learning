// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var notificationSchema = new Schema({
  title: { type: String, required: true },
  notificatrion: { type: String, required: true },
  type: { type: String, required: true },
  created_at: Date,
  updated_at: Date,
});

// the schema is useless so far
// we need to create a model using it
var notifications = mongoose.model('notifications', notificationSchema);

// make this available to our users in our Node applications
module.exports = notifications;