var express = require('express')
var router = express.Router()
var MongoClient = require('mongodb').MongoClient;
var myLogModule = require('../../utils/logger');
var url = process.env.MONGODB;
var ObjectID = require('mongodb').ObjectID;

// Create new complaint
router.post('/create', function (req, res) {
  myLogModule.info('ComplaintController API-create)');
  MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
 }, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var payload = {
      "firstName": req.body.firstName,
      "lastName": req.body.lastName,
      "title": req.body.title,
      "detail_desc": req.body.detail_desc,
      "imageurl": req.body.imageurl || '',
      "status": 'logged',
      "resolution": "",
      created_at: new Date(),
      updated_at: new Date(),
    }
    var myobj = payload
    dbo.collection("complaints").insertOne(myobj, function (err, result) {
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
  myLogModule.info('ComplaintController API-list)')
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

   dbo.collection("complaints").find({}).count(function(err, count){
        if(err){
          console.log('Error while fatching count')
        } else{
          dbo.collection("complaints").find({}, query).toArray(function (err, result) {
            if (err) throw err;
            if (result) {
              myLogModule.info('ComplaintController - list fetched sucessfully')
              res.status(200).json({ 'data': result, msg: ' list fetched sucessfully', total: count })
            } else {
              myLogModule.error('ComplaintController - NO data found')
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
  myLogModule.info('ComplaintController API-update)')
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
    var newvalues = { $set: {  
    "status": req.body.status,
    "resolution": req.body.resolution,
    updated_at: new Date(), 
    } 
 }
    dbo.collection("complaints").updateOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      myLogModule.info('complaint update sucessfully');
      res.send(result);
      db.close();
    });
  });
})

// Remove one document
router.delete('/delete', function (req, res) {
  myLogModule.info('UserController API-Delete(user/Delete)')
  var id = parseInt(req.query.id)
  if (!id) {
    response = { "error": true, "message": "invalid page user id" };
    return res.status(400).json(response)
  }

  MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
 }, function (err, db) {
    var payload = {
      "_id":  id
    }
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = payload
    var newvalues = { $set: { name: "YO Rajesh" } }
    dbo.collection("complaints").deleteOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      myLogModule.info('User deleted sucessfully')
      res.send("1 document deleted")
      db.close();
    });
  });
})


module.exports = router