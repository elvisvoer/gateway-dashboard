var util = require('util');
var io = require('socket.io-client'),
socket = io.connect('192.168.1.176', {
    port: 3700
});
socket.on('connect', function () { console.log("socket connected"); });



var net = require('net');
var server = net.createServer(function(c) { //'connection' listener
  console.log('server connected');
  c.on('end', function() {
    console.log('server disconnected');
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
	}
	socket.emit('send', { UID: uid, reader: reader });
	//console.log(da.toString() + 'Here'); 
  
  });
});
server.listen(8124, function() { //'listening' listener
  console.log('server bound');
});

