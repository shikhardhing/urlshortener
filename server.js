var express = require('express');
var proces=require('process');
/*var mysql = require('mysql');*/
var app = express();
app.set('port', (process.env.PORT || 5000));
/*var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'shikhar',
  password : 'password',
  database : 'myDB'
});
connection.connect();*/
var mongoose = require('mongoose')
var url="mongodb://shikhar97:(xyz123)@ds145315.mlab.com:45315/qwerty";
//var url = 'mongodb://localhost:27017/urldb'
mongoose.connect(url)
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
	console.log("connected")
})
var urlschemas=mongoose.Schema({
	num: Number,
	url:String
})
var urlRecords=mongoose.model('urlschemas',urlschemas)


app.get('/new/:original_url(http://*.*)', function (req, res) {
	/*connection.query("SELECT * FROM urltable WHERE url='"+req.params.original_url+"'",function(err,results,fields){
		if(err) throw err;
		if(!!results[0]){
			res.send(results[0]);
		}
		else{
			connection.query("SELECT MAX(num) FROM urltable ",function(err,results,fields){
				if(err) throw err;
				var r=results[0]["MAX(num)"]+1;
				connection.query("INSERT INTO urltable VALUES("+r+",'"+req.params.original_url+"')",function(err,results2,fields){
					if(err) throw err;
					console.log("inserted at"+r);
					res.send(r+req.params.original_url);
				});
			});
		}	
	});*/
	urlRecords.find({url:req.params.original_url},function(err,records){
		if(err) throw err
		console.log(records)
		if(!!records[0]){
			res.send(records[0])
		}
		else{
			urlRecords.find().sort('-num').exec(function(err,number){
				if(err) throw err
				console.log(number)
				if(!!number[0])
					r=number[0]["num"]+1
				else
					r=1
				record=new urlRecords({num:r,url:req.params.original_url})
				record.save(function(err){
					if(err) throw err
					res.send(r+" "+req.params.original_url)
				})
			})
		}
	})
});
app.get('/:id([0-9]+)', function (req, res) {
	/*connection.query("SELECT * FROM urltable WHERE num='"+req.params.id+"'",function(err,results,fields){
		if(err) throw err;
		if(!!results[0])
			res.redirect(results[0]["url"]);
		else
			res.send("Add /new/http://example.com after the url to create a shortened URL");
	});*/
	urlRecords.find({num:req.params.id},function(err,results){
		if(err) throw err;
		console.log(results)
		if(!!results[0])
			res.redirect(results[0]["url"]);
		else
			res.send("Add /new/http://example.com after the url to create a shortened URL");
	});
});
app.get('/*', function (req, res) {
	res.send("Add /new/http://example.com after the url to create a shortened URL");
});		


var server = app.listen(app.get('port'), function () {
	var host = 'localhost';
	var port = server.address().port;
	console.log("Listening at http://%s:%s", host, port);
});

//CREATE TABLE urltable (num int,url varchar(30));
