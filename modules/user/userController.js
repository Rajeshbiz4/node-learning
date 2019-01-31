var express = require('express')
var router = express.Router()
var MongoClient = require('mongodb').MongoClient;
var myLogModule = require('../../utils/logger');
var url = 'mongodb://127.0.0.1:27017/';

// Create new user
router.post('/create', function (req, res) {
  myLogModule.info('UserController API-UserList(user/create)')
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
   var payload = {
      "name": req.body.name,
      "mobile": req.body.mobile,
      "district":req.body.district,
      "taluka":req.body.taluka,
      "village":req.body.village,
    }
    myLogModule.info('payload -- ' + JSON.stringify(payload))
    var myobj = payload
    dbo.collection("customers").insertOne(myobj, function(err, res) {
      if (err) {
        myLogModule.error('error while user creating')
      } else {
        myLogModule.error('error while user creating')
        res.send('document inserted')
      }
      db.close();
    });
  });
})

// get All list
router.get('/list', function (req, res) {
  myLogModule.info('UserController API-UserList(user/list)')
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("customers").find({}).toArray(function(err, result) {
      if (err) throw err;
      if(result){
            myLogModule.info('UserController - User list fetched sucessfully')
            res.send(result)
          } else {
            myLogModule.error('UserController - NO data found')
            res.send('NO data found')
          }
      db.close();
    });
  });
})

// Update one document
router.post('/update', function (req, res) {
  myLogModule.info('UserController API-UserList(user/update)')
  MongoClient.connect(url, function(err, db) {
    var payload = {
      "name": req.body.name
    }
    if (err) throw err;
  var dbo = db.db("mydb");
  var myquery = payload
  var newvalues = { $set: {name: "YO Rajesh" }}
  dbo.collection("customers").updateOne(myquery, newvalues, function(err, result) {
    if (err) throw err;
    myLogModule.info('User update sucessfully')
    res.send("1 document updated")
    db.close();
  });
  });
})

module.exports = router