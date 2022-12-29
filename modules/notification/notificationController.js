var express = require('express')
var router = express.Router()
var MongoClient = require('mongodb').MongoClient;
var myLogModule = require('../../utils/logger');
var url = 'mongodb://localhost:27017';

// Create new user
router.post('/create', function (req, res) {
    myLogModule.info('Notification Controller')
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        myLogModule.info('connection')
        if (err) throw err;
        var dbo = db.db("mydb");
        var notification = req.body.notification
        var title = req.body.title
        var type = req.body.type
        if (!notification || !title || !type) {
            response = { "error": true, "message": "Invalid paylaod, notification, type and tital is required " };
            return res.status(400).json(response)
        }
        var payload = {
            "notification": notification,
            "title": title,
            "type": type,
            "created_at": new Date(),
            "updated_at":new Date()
        }
        myLogModule.info('payload -- ' + JSON.stringify(payload))
        var myobj = payload
        dbo.collection("notifications").insertOne(myobj, function (err, result) {
            if (err) {
                myLogModule.error('error while user creating')
                res.status(400).json({ msg: 'error while Notification' })
            } else {
                myLogModule.info('Notification created')
                res.status(201).json({ msg: 'Notification created', data: myobj })
            }
            db.close();
        });
    });
})

// get All Notifications
router.get('/list', function (req, res) {
    myLogModule.info('Notification API-NotifcationList(notifcation/list)')
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
  
     dbo.collection("notifications").find({}).count(function(err, count){
          if(err){
            console.log('Error while fatching count')
          } else {
            dbo.collection("notifications").find({}, query).toArray(function (err, result) {
              if (err) throw err;
              if (result) {
                myLogModule.info('Notifcation Controller - Notifcation list fetched sucessfully')
                res.status(200).json({ 'data': result, msg: 'Notifcation list fetched sucessfully', total: count })
              } else {
                myLogModule.error('Notifcation Controller - NO data found')
                res.status(400).json({ data: err, msg: 'NO data found' })
              }
              db.close();
            });
          }
        })
    });
  })

module.exports = router