var util = require('util'),
    spawn = require('child_process').spawn,
    exec = require('child_process').exec,
    child;
var listener;

var children = [];

var io = require('socket.io-client'),
socket = io.connect('127.0.0.1', {
    port: 3700
});
socket.on('connect', function () { console.log("socket.io connected to server"); });
socket.on('restart', function () {
    child.kill('SIGINT');
    for(var i = 0; i<children.length; i++) 
    {  
        process.kill(Number(children[i]), 'SIGINT');
    }
    console.log("restart!!!");
});

var net = require('net');
var server = net.createServer(function(c) { //'connection' listener
  console.log('online');
  c.on('end', function() {
    console.log('client disconnected');
  });
  c.on('data', function(da){
	var input = da.toString().split('\n'); 
	var i = 0;
	var reader, uid;
        for(i = 0; i<input.length; i++)
        {
	   if(input[i].indexOf("number") != -1) //found reader line
	   {
		//split line for finding the number
		var temp = input[i].split(':');
		// charAt(1) to avoid space
		reader = temp[1].charAt(1);
	   }
	   else if(input[i].indexOf("UID") != -1)
	   {
		var temp = input[i].split(':');
		uid = temp[1];
	   }
	   else if(input[i].indexOf("Fork") != -1)
	   {

		var temp = input[i].split(':');
		children.push(temp[1]);
	   }	
	}
	socket.emit('send', { UID: uid, reader: reader });
	console.log(da.toString()); 
  
  });

});
server.listen(8124, function() { //'listening' listener
  console.log('server bound');
  child = spawn('./lt-volt-rfid', []);
});

