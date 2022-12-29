var express = require('express')
var router = express.Router()
var MongoClient = require('mongodb').MongoClient;
var myLogModule = require('../../utils/logger');
var url = 'mongodb://localhost:27017';


// get All menu list
router.get('/list', function (req, res) {
  myLogModule.info('UserController API-UserList(user/list)')
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");

   dbo.collection("customers").find({}).count(function(err, count){
        if(err){
          console.log('Error while fatching count')
        } else{
            const menu = [
                { key : 'ग्रामपंचायत' , logoName : 'uploads/menu/home_icon.png'},
                { key : 'ग्रामपंचायत समिती' , logoName : 'uploads/menu/home_icon.png'},
                { key : 'अधिकारी ' , logoName : 'uploads/menu/home_icon.png'},
                { key : 'संदेश ' , logoName : 'uploads/menu/home_icon.png'},
                { key : 'बातमीपत्र ' , logoName : 'uploads/menu/home_icon.png'},
                { key : 'सूचना-तक्रारी' , logoName : 'uploads/menu/home_icon.png'},
                { key : 'हवामान' , logoName : 'uploads/menu/home_icon.png'},
                { key : 'नकाशा' , logoName : 'uploads/menu/home_icon.png'},
                { key : 'संपर्क' , logoName : 'uploads/menu/home_icon.png'},
                { key : 'कृषी' , logoName : 'uploads/menu/home_icon.png'},
                { key : 'शेतकरी' , logoName : 'uploads/menu/home_icon.png'},
                { key : 'ऍग्रोवन' , logoName : 'uploads/menu/home_icon.png'}
            ]
              myLogModule.info('menuController - menu list fetched sucessfully')
              res.status(200).json({ 'data': menu, msg: 'menu list fetched sucessfully' })
            db.close();
        }
      })
  });
})


module.exports = router