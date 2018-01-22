const express = require('express');

const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const objectId = require('mongodb').ObjectId;



//setup template engine

app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');

//serving static files
app.use(express.static(__dirname + '/public'));


// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//connecting to mongodb
const MongoClient = require('mongodb').MongoClient;
const mongoURL = 'mongodb://localhost:27017/techsperience-oek';

MongoClient.connect(mongoURL, function(err, database){
	if (err){
		console.log(err);
	}
	else {
	
	console.log("Connected Succsesfully to MongoDB")
	}
	oek = database.collection('oek');
	
});

//routes

app.get('/', function(req, res) {
	
	oek.find({}).toArray(function (err, docs){
		if (err){
			console.log(err);
		}
		res.render('index', {docs: docs});
	});
});


app.get('/table', function(req, res) {
	
	oek.find({}).toArray(function (err, docs){
		if (err){
			console.log(err);
		}
		res.render('table', {docs: docs});
	});
});







app.post('/oek/add', function(req, res) {
	
	oek.insert({firstname: req.body.firstname, lastname: req.body.lastname, gender: req.body.gender, date: req.body.date, email: req.body.email, pass: req.body.pass, education: req.body.education, ifields: req.body.ifields}, function(err, result){
		
		if (err) {
			console.log(err);
		}
		
		res.redirect('/');
		
	});
});

app.get('/table/edit/:id', function(req, res) {
	
	var id = objectId(req.params.id);
	oek.findOne({_id: id}, function(err, doc){
		if (err) {
			console.log(err);
		}
		res.render('edit', {doc: doc});	
	
	});
	
});


app.get('/table/delete/:id', function(req, res) {
	var id = objectId(req.params.id);
	oek.deleteOne({_id: id}, function(err, result){
		if (err) {
			console.log(err);
		} else {
		res.redirect('/table');
		}
	});
});



app.post('/table/update/:id', function(req, res) {
	var id = objectId(req.params.id);
	oek.updateOne({_id: id}, {$set: {firstname: req.body.firstname, lastname: req.body.lastname, gender: req.body.gender, date: req.body.date, email: req.body.email, pass: req.body.pass, education: req.body.education, ifields: req.body.ifields}}, function(err, result){
		if (err) {
			console.log(err);
		}
		res.redirect('/table');
	});
	
});





//running app

app.listen(3000, function(){
	console.log("Running at http://localhost:3000");
});



