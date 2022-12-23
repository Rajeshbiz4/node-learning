var express = require('express');
var bodyParser = require('body-parser');
var port = 8000;
var app = express();
var multer  = require('multer')
const dotenv = require('dotenv');
dotenv.config();
// var router = express.Router();
var authenticateToken = require('./middleware/authenticateToken.js');
var user_controller = require('./modules/user/userController.js');
var notification_controller = require('./modules/notification/notificationController.js');
var myVillage_controller = require('./modules/myVillage/myVillageController.js');
var image_upload = require('./modules/imageUpload/imageUploadController.js');
var complaint_controller = require('./modules/complaint/complaintController.js');
var gramBody_controller = require('./modules/gram-body/gram-bodyController.js');
var auth_Controller = require('./modules/auth/authController.js');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});
app.use('/login', auth_Controller);
app.use('/user', authenticateToken, user_controller);
app.use('/notification',authenticateToken, notification_controller);
app.use('/my-village', authenticateToken, myVillage_controller);
app.use("/file", authenticateToken, image_upload);
app.use("/complaint", authenticateToken, complaint_controller);
app.use("/gram-body", authenticateToken, gramBody_controller);


// upload image to folder
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

app.post('/upload', upload.single('profile-file'), function (req, res, next) {
  const imgUrl = `http://localhost:8000/uploads/${req.file.filename}`;
  return res.send(imgUrl)
})

app.listen(port, () => {
	console.log("Server listening on port " + port);
  console.log(process.env.NODE_ENV)
  });