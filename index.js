var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);
var sentiment = require('sentiment');
var test = 0;
var clientId = 0;
var counter = 0;
var redTaken = 0;



app.use('/',express.static(__dirname + '/'));

// app.get('/', function(req
// 	,res){

// 	res.sendFile(path.join(__dirname,'index.html'));

// });

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
		console.log('user diconnected');
	});
});

io.on('connection', function(socket){
	socket.on('move', function(msg){
		io.emit('moveShip', msg);
		console.log(msg);
		
	});
});

io.on('connection', function(socket){
	socket.on('shoot', function(msg){
		socket.emit('shootShip', msg);
		console.log(msg);
	});
});

io.on('connection', function(socket){
	socket.on('assignmentRequest', function(){
		var team;
		if(redTaken == 0){
		    redTaken = 1;
		    team = 'red';
		}
		else{
		    team = 'blue';
		}
		socket.emit('assignment', team);
		
		console.log(team);
	});
});

http.listen(80, function(){
	console.log('listening on *:80');
})
