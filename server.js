require('rootpath')();
//const express = require("express");
//const app = express();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
let {PythonShell} = require('python-shell');
var MongoClient = require('mongodb').MongoClient;
var async = require("async");
const crypto = require("crypto");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
mongoose.Promise = require('bluebird');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

app.use(express.static(path.join(__dirname, './public')));


// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});


// Middlewares
app.use(express.json());
app.set("view engine", "ejs");

// DB
const mongoURI = "mongodb://localhost:27017/samples";
const mongoURE = "mongodb://localhost:27017/samples";

// connection
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const con = mongoose.createConnection(mongoURE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// init gfs
let gfs;
conn.once("open", () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "samples"
  });
});

let gos;
conn.once("open", () => {
  // init stream
  gos = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "fs"
  });
});

// Storage
//const storage = new GridFsStorage({ url : mongoURI})
//const storage = new GridFsStorage({
//  url: mongoURI,
//  file: (req, file) => {
//    return new Promise((resolve, reject) => {
//      crypto.randomBytes(16, (err, buf) => {
//        if (err) {
//          return reject(err);
//        }
//        const filename = buf.toString("hex") + path.extname(file.originalname);
//        const fileInfo = {
//          filename: filename,
//          bucketName: "uploads"
//        };
//        resolve(fileInfo);
//      });
//    });
//  }
//});

const storage = new GridFsStorage({  
    url: mongoURI,  
    file: (req, file) => {    
           return {      
                bucketName: 'samples',       
                //Setting collection name, default name is fs      
                filename: file.originalname     
                //Setting file name to original name of file    
         }  
   }
});


const upload = multer({
  storage
});

// get / page
app.get("/upload", (req, res) => {
  if(!gfs) {
    console.log("some error occured, check connection to db");
    res.send("some error occured, check connection to db");
    process.exit(0);
  }
  gfs.find().toArray((err, files) => {
    // check if files
    if (!files || files.length === 0) {
      return res.render("upload", {
        files: false
      });
    } else {
      const f = files
        .map(file => {
          if (
            file.contentType === "image/png" ||
            file.contentType === "image/jpeg"
          ) {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
          return file;
        })
        .sort((a, b) => {
          return (
            new Date(b["uploadDate"]).getTime() -
            new Date(a["uploadDate"]).getTime()
          );
        });

      return res.render("upload", {
        files: f
      });
    }

    // return res.json(files);
  });
});








app.get("/FTS",function(req,res) {
	MongoClient.connect("mongodb://localhost:27017/samples", function(err, db) {
		
    db.collection("samples.files", function(err, collection){
    collection.find().toArray(function (err,allproducts) {
        if (err) {
            console.log(err);
        } else {
            //Find Collection And Assign It To Object
            products=allproducts;             
        }
		db.collection("feature_file.files", function(err, collection){
		collection.find().toArray(function(err, allOrders) {	
		
		console.log(allproducts, allOrders)
		 if (err) {
            console.log(err);
        } else {
            //find order collection and sort it in desending order and assign it to order object  
            orders=allOrders;
            res.render("FTS",{users:products , colors:orders});
        }
		
    });
    
		});
	});
    });

});
});









app.post("/upload", upload.single("file"), (req, res) => {
  // res.json({file : req.file})
  res.redirect("/upload");
});



app.get("/OUT",function(req,res) {
	MongoClient.connect("mongodb://localhost:27017/samples", function(err, db) {
		
    db.collection("samples.files", function(err, collection){
    collection.find().toArray(function (err,allproducts) {
        if (err) {
            console.log(err);
        } else {
            //Find Collection And Assign It To Object
            products=allproducts;             
        }
		db.collection("Outlier_File.files", function(err, collection){
		collection.find().toArray(function(err, allOrders) {	
		
		 if (err) {
            console.log(err);
        } else {
            //find order collection and sort it in desending order and assign it to order object  
            orders=allOrders;
			
            
        }
		res.render("OUT",{users:products , colors:orders});
    });
    
		});
	});
    });

});
});




app.get("/files/:filename", (req, res) => {
  gfs.find(
    {
      filename: req.params.filename
    },
    (err, file) => {
      if (!file) {
        return res.status(404).json({
          err: "no files exist"
        });
      }

      return res.json(file);
    }
  );
});

app.get("/image/:filename", (req, res) => {
  // console.log('id', req.params.id)
  const file = gfs
    .find({
      filename: req.params.filename
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "no files exist"
        });
      }
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    });
});

// files/del/:id
// Delete chunks from the db
app.post("/files/del/:id", (req, res) => {
  gfs.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
    if (err) return res.status(404).json({ err: err.message });
    res.redirect("/upload");
  });
});




app.get('/calc', (req, res) => {
	var myText = req.query.mytext;
		console.log(myText)
	var options = {
  mode: 'text',
  pythonPath: 'python',
  pythonOptions: ['-u'],
  scriptPath: './Script',
  args: ['./Script/Asthma_Prediction_Model_Dataset_57F_1368Ids_cleaned.csv', 'Asthma_10YR', 'Study_ID', myText]
};
    PythonShell.run('Feature_Selection_RFE.py', options, function (err, results) {
  if (err) 
    throw err;
  // Results is an array consisting of messages collected during execution
  console.log('results: %j', results);
  return res.redirect('/FTS');
  console.log('finished');
    
});
});


app.get('/outlier', (req, res) => {
	var myText = req.query.mytext;
		console.log(myText)
	var options_out = {
  mode: 'text',
  pythonPath: 'python',
  pythonOptions: ['-u'],
  scriptPath: './Script',
  args: ['./Script/Asthma_Prediction_Model_Dataset_1368Ids_uncleaned.csv', myText]
};
    PythonShell.run('outlier.py', options_out, function (err, results) {
  if (err) 
    throw err;
  // Results is an array consisting of messages collected during execution
  console.log('results: %j', results);
  return res.redirect('/OUT');
  console.log('finished');
    
});
});
 
 var rename;
app.post('/outl', (req, res) => {
  res.redirect("/OUT");
  rename = req.body.fname
  //console.log(req.body.fname)
});


// start server
var server = app.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);

});