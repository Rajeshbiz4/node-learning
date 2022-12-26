var express = require('express')
var router = express.Router()
var MongoClient = require('mongodb').MongoClient;
var myLogModule = require('../../utils/logger');
var url = process.env.MONGODB;
var mypassModule = require('../../utils/utils');
var ObjectID = require('mongodb').ObjectID;
// mongodb://localhost:27017

// Create new user
router.post('/create', function (req, res) {
  myLogModule.info('FeedsController API-create)');
  MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var payload = {
      "firstName": req.body.firstName,
      "title": req.body.title,
      "detail_desc": req.body.detail_desc,
      "file": req.body.file,
      "status":req.body.status, // approved, pending
      "created_at": new Date(),
      "updated_at": new Date(),
    }
    var myobj = payload
    dbo.collection("feeds").insertOne(myobj, function (err, result) {
      if (err) {
        myLogModule.error('error', err)
        res.status(400).send({ message: 'error', data: err })
      } else {
        myLogModule.info('Sucess')
        res.status(200).send({ message: 'document inserted', data: payload })
      }
      db.close();
    });
  });
})

// get All list
router.get('/list', function (req, res) {
  myLogModule.info('FeedsController API-list')
  var pageNo = parseInt(req.query.from)
  var size = parseInt(req.query.size)
  var query = {}
  if (pageNo < 0 || pageNo === 0) {
    response = { "error": true, "message": "invalid page number, should start with 1" };
    return res.status(400).json(response)
  }
  query.skip = size * (pageNo - 1)
  query.limit = size
  MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
 }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");

   dbo.collection("feeds").find({}).count(function(err, count){
        if(err){
          console.log('Error while fatching count')
        } else{
          dbo.collection("feeds").find({}, query).toArray(function (err, result) {
            if (err) throw err;
            if (result) {
              myLogModule.info('FeedsController - list fetched sucessfully')
              res.status(200).json({ 'data': result, msg: 'User list fetched sucessfully', total: count })
            } else {
              myLogModule.error('FeedsController - NO data found')
              res.status(400).json({ data: err, msg: 'NO data found' })
            }
            db.close();
          });
        }
      })
  });
})

// Update one document
router.put('/update', function (req, res) {
  myLogModule.info('FeedsController API-update')
  MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
 }, function (err, db) {
    var payload = {
      "_id": ObjectID(req.body.id)
    }
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = payload
    var newvalues = { $set: { firstName: "YO Rajesh updated" } }
    dbo.collection("feeds").updateOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      myLogModule.info('User update sucessfully');
      res.send(result);
      db.close();
    });
  });
})


module.exports = router