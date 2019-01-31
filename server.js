var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')
var swagger = require("swagger-node-express");
var port = 8000;
var app = express();
// var router = express.Router();
var user_controller = require('./modules/user/userController.js')
var notification_controller = require('./modules/notification/notificationController.js')

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/user', user_controller)
app.use('/notification', notification_controller)

app.listen(port, () => {
	console.log("Server listening on port " + port);
  });