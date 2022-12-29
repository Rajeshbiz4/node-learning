var express = require('express')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var router = express.Router()
var MongoClient = require('mongodb').MongoClient;
var myLogModule = require('../../utils/logger');
var url = 'mongodb://localhost:27017';
var mypassModule = require('../../utils/utils');
var ObjectID = require('mongodb').ObjectID;
// mongodb://localhost:27017

// Authenticate user - Login API
router.post('/', function (req, res) {
  myLogModule.info('UserController API-authenticate')
  MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
 }, function (err, db) {
    var payload = {
      "mobile": req.body.mobile
    }
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = payload
    dbo.collection("customers").findOne(myquery, function (err, result) {
      if (err) throw err;
      if(req.body.password !== result.password){
        response = { "error": true, "message": 'Authentication failed. Invalid user or password.' };
        return res.send(response);
      } else {
        res.status(200).send( { data: result , token: jwt.sign({ mobile: result.mobile,  password: result.password },  process.env.TOCKEN_SECRET)});
      }
      db.close();
    });
  });
})

module.exports = router