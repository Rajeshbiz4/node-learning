var express = require('express')
var router = express.Router()
var MongoClient = require('mongodb').MongoClient;
var myLogModule = require('../../utils/logger');
var User = require('../../models/user.js');
var url = 'mongodb://127.0.0.1:27017/';
var mypassModule = require('../../utils/utils');
// mongodb://localhost:27017



// get All list
router.get('/info', function (req, res) {
  myLogModule.info('myVillageController API-info');
  var query = {}
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");

   dbo.collection("myVillage").find({}).count(function(err, count){
        if(err){
          console.log('Error while fatching myVillage details')
        } else{
          dbo.collection("myVillage").find({}, query).toArray(function (err, result) {
            if (err) throw err;
            if (result) {
              myLogModule.info('myVillageController - myVillage details fetched sucessfully')
              res.status(200).json({ 'data': result, msg: 'myVillage details fetched sucessfully', total: count })
            } else {
              myLogModule.error('myVillageController - NO data found')
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
  myLogModule.info('myVillageController API update)')
  MongoClient.connect(url, function (err, db) {
    var payload = {
      "_id": "63a535f5efcc0ed2aa8e6d49",
    }
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = payload
    var newvalues = { $set: {
        "title": req.body.title,
        "description": req.body.description,
        "image": req.body.image,
        "updated_at": new Date(),
      } 
    }
    dbo.collection("myVillage").updateOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      myLogModule.info('myVillage details update sucessfully')
      res.send({myquery, newvalues, result});
      db.close();
    });
  });
})



module.exports = router