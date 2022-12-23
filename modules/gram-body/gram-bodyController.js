var express = require('express')
var router = express.Router()
var MongoClient = require('mongodb').MongoClient;
var myLogModule = require('../../utils/logger');
var url = process.env.MONGODB;
var ObjectID = require('mongodb').ObjectID;


// Create new gram officer
router.post('/create', function (req, res) {
  myLogModule.info('gram-bodyController API-create)');
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var payload = {
      "firstName": req.body.firstName,
      "lastName": req.body.lastName,
      "mobile": req.body.mobile,
      "position": req.body.position,
      "education":req.body.education,
      "type" : req.body.education,  // GramPanchayat body or Government servent
      "ward" : req.body.ward,
      "age":req.body.age,
      "created_at": new Date(),
      "updated_at": new Date(),
    }
    var myobj = payload
    dbo.collection("gramBody").insertOne(myobj, function (err, result) {
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
  myLogModule.info('gram-bodyController API-list)')
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

   dbo.collection("gramBody").find({}).count(function(err, count){
        if(err){
          console.log('Error while fatching count')
        } else{
          dbo.collection("gramBody").find({}, query).toArray(function (err, result) {
            if (err) throw err;
            if (result) {
              myLogModule.info('gram-bodyController - list fetched sucessfully')
              res.status(200).json({ 'data': result, msg: ' list fetched sucessfully', total: count })
            } else {
              myLogModule.error('gram-bodyController - NO data found')
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
  myLogModule.info('gram-bodyController API-update)')
  MongoClient.connect(url, function (err, db) {
    var payload = {
      "_id": ObjectID(req.body.id)
    }
    if (err) throw err;
    var dbo = db.db("mydb"); 
    var myquery = payload
    var newvalues = { $set: {  
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "mobile": req.body.mobile,
        "position": req.body.position,
        "education":req.body.education,
        "type" : req.body.education,  // GramPanchayat body or Government servent
        "ward" : req.body.ward,
        "age":req.body.age,
        "updated_at": new Date(),
    } 
 }
    dbo.collection("gramBody").updateOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      myLogModule.info('gramBody update sucessfully');
      res.send(result);
      db.close();
    });
  });
})

// Remove one document
router.delete('/delete', function (req, res) {
  myLogModule.info('gramBodyController API-Delete(user/Delete)')
  var id = parseInt(req.query.id)
  if (!id) {
    response = { "error": true, "message": "invalid user id" };
    return res.status(400).json(response)
  }

  MongoClient.connect(url, function (err, db) {
    var payload = {
      "_id":  id
    }
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = payload
    var newvalues = { $set: { name: "YO Rajesh" } }
    dbo.collection("gramBody").deleteOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      myLogModule.info('User deleted sucessfully')
      res.send("1 document deleted")
      db.close();
    });
  });
})


module.exports = router