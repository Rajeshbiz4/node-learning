const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage").GridFsStorage;
var MongoClient = require('mongoose');
var crypto = require('crypto');
var path = require('path');

var url = 'mongodb://127.0.0.1:27017/mydb';
const promise = MongoClient.connect(url, { useNewUrlParser: true });

const conn = MongoClient.connection;
let gfs;

conn.once('open',() => {
//   gfs = Grid(conn, MongoClient.mongo);
//   gfs.collection('uploads');
});


//create storage object
const storage = new GridFsStorage({
  db: promise,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        console.log("filename", filename);
        console.log("fileInfo", fileInfo);
        resolve(fileInfo);
      });
    });
  }
});
// const upload = multer({ storage });

module.exports = multer({ storage });