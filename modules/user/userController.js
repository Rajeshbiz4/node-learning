var express = require('express')
var router = express.Router()
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017/';

// respond with "hello world" when a GET request is made to the homepage
router.post('/create', function (req, res) {
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
// define the about route
router.get('/list', function (req, res) {

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("customers").findOne({ name:"Rajesh Pandhare"}, function(err, result) {
      if (err) throw err;
      console.log(result);
      if(result){
        res.send(result)
      } else {
        res.send('NO data found')
      }
      db.close();
    });
  });
})

module.exports = router