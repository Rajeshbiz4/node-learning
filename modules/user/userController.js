var express = require('express')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var router = express.Router()
var MongoClient = require('mongodb').MongoClient;
var myLogModule = require('../../utils/logger');
var url = process.env.MONGODB;
var mypassModule = require('../../utils/utils');
var ObjectID = require('mongodb').ObjectID;
// mongodb://localhost:27017

// Create new user
router.post('/create', function (req, res) {
  myLogModule.info('UserController API-UserList(user/create)', req.body);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var payload = {
      "firstName": req.body.firstName,
      "lastName": req.body.lastName,
      "mobile": req.body.mobile,
      "password": mypassModule(5),
      // "district": req.body.district,
      // "taluka": req.body.taluka,
      // "village": req.body.village,
      created_at: new Date(),
      updated_at: new Date(),
    }
    myLogModule.info('payload -- ' + JSON.stringify(payload))
    var myobj = payload
    dbo.collection("customers").insertOne(myobj, function (err, result) {
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
  myLogModule.info('UserController API-UserList(user/list)')
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
router.put('/update', function (req, res) {
  myLogModule.info('UserController API-UserList(user/update)')
  MongoClient.connect(url, function (err, db) {
    var payload = {
      "_id": ObjectID(req.body.id)
    }
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = payload
    var newvalues = { $set: { firstName: "YO Rajesh updated" } }
    dbo.collection("customers").updateOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      myLogModule.info('User update sucessfully');
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

  MongoClient.connect(url, function (err, db) {
    var payload = {
      "_id":  id
    }
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = payload
    var newvalues = { $set: { name: "YO Rajesh" } }
    dbo.collection("customers").deleteOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      myLogModule.info('User deleted sucessfully')
      res.send("1 document deleted")
      db.close();
    });
  });
})


// Authenticate user - Login API
router.post('/authenticate', function (req, res) {
  myLogModule.info('UserController API-authenticate')
  MongoClient.connect(url, function (err, db) {
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
        res.status(200).send( { data: result , token: jwt.sign({ mobile: result.mobile, firstName: result.firstName, lastName: result.lastName, password: result.password, _id: result._id }, 'RESTFULAPIs') });
      }
      db.close();
    });
  });
})


// change password
router.put('/change-password', function (req, res) {
  myLogModule.info('UserController API-change-password(user/update)')
  MongoClient.connect(url, function (err, db) {
    var payload = {
      "_id": ObjectID(req.body.id)
    }
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = payload
    var newvalues = { $set: { password: req.body.password } }
    dbo.collection("customers").updateOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      myLogModule.info('password update sucessfully');
      res.send(result);
      db.close();
    });
  });
})

module.exports = router