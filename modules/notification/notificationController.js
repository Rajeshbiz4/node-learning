var express = require('express')
var router = express.Router()
var MongoClient = require('mongodb').MongoClient;
var myLogModule = require('../../utils/logger');
var url = 'mongodb://127.0.0.1:27017/';

// Create new user
router.post('/create', function (req, res) {
    myLogModule.info('Notification Controller')
    MongoClient.connect(url, function (err, db) {
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
            "type": type
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

module.exports = router