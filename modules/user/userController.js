var express = require('express')
var router = express.Router()
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017/';

// Create new user
router.post('/create', function (req, res) {
  console.log('--USER_CREATE--')
  console.log(req.body)
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
   var payload = {
      "name": req.body.name,
      "mobile": req.body.mobile,
      "district":req.body.district,
      "taluka":req.body.taluka,
      "village":req.body.village,
    }
    var myobj = payload
    dbo.collection("customers").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("document inserted");
      db.close();
    });
  });
  res.send('document inserted')
})

// get All list
router.get('/list', function (req, res) {
  console.log('--USER_LIST--')
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("customers").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log("customers", result);
      if(result){
            res.send(result)
          } else {
            res.send('NO data found')
          }
      db.close();
    });
  });
})

// Update one document
router.post('/update', function (req, res) {
  console.log('--USER_UPDATE--')
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
    console.log("1 document updated");
    res.send("1 document updated")
    db.close();
  });
  });
})



 
module.exports = router