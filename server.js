var express = require('express');
var bodyParser = require('body-parser');
var port = 8000;
var app = express();
// var router = express.Router();
var user_controller = require('./modules/user/userController.js')
var notification_controller = require('./modules/notification/notificationController.js')
var myVillage_controller = require('./modules/myVillage/myVillageController.js')

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});
app.use('/user', user_controller)
app.use('/notification', notification_controller)
app.use('/my-village', myVillage_controller)

app.listen(port, () => {
	console.log("Server listening on port " + port);
  });