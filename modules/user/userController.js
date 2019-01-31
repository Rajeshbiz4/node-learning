var express = require('express')
var router = express.Router()
var MongoClient = require('mongodb').MongoClient;
var myLogModule = require('../../utils/logger');
var User = require('../../models/user.js');
var url = 'mongodb://127.0.0.1:27017/';

// Create new user
router.post('/create', function (req, res) {
  myLogModule.info('UserController API-UserList(user/create)')
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var payload = {
      "name": req.body.name,
      "mobile": req.body.mobile,
      "district": req.body.district,
      "taluka": req.body.taluka,
      "village": req.body.village,
    }
    myLogModule.info('payload -- ' + JSON.stringify(payload))
    var myobj = payload
    dbo.collection("customers").insertOne(myobj, function (err, result) {
      if (err) {
        myLogModule.error('error')
        res.status(400).send({ message: 'error', data: err })
      } else {
        myLogModule.info('Sucess')
        res.status(200).send({ message: 'document inserted', data: result })
      }
      db.close();
    });
  });
})

// get All list
router.get('/list', function (req, res) {
  myLogModule.info('UserController API-UserList(user/list)')
  console.log('parms--', req.query)
  var pageNo = parseInt(req.query.from)
  var size = parseInt(req.query.size)
  var query = {}
  if (pageNo < 0 || pageNo === 0) {
    response = { "error": true, "message": "invalid page number, should start with 1" };
    return res.status(400).json(response)
  }
  query.skip = size * (pageNo - 1)
  query.limit = size
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");

   dbo.collection("customers").find({}).count(function(err, count){
        if(err){
          console.log('Error while fatching count')
        } else{
          dbo.collection("customers").find({}, query).toArray(function (err, result) {
            if (err) throw err;
            if (result) {
              myLogModule.info('UserController - User list fetched sucessfully')
              res.status(200).json({ 'data': result, msg: 'User list fetched sucessfully', total: count })
            } else {
              myLogModule.error('UserController - NO data found')
              res.status(400).json({ data: err, msg: 'NO data found' })
            }
            db.close();
          });
        }
      })
  });
})

// Update one document
router.post('/update', function (req, res) {
  myLogModule.info('UserController API-UserList(user/update)')
  MongoClient.connect(url, function (err, db) {
    var payload = {
      "name": req.body.name
    }
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = payload
    var newvalues = { $set: { name: "YO Rajesh" } }
    dbo.collection("customers").updateOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      myLogModule.info('User update sucessfully')
      res.send("1 document updated")
      db.close();
    });
  });
})

module.exports = router