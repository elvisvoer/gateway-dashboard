var express = require("express");
var app = express();
var port = 3700;
var spawn = require('child_process').spawn,
    exec = require('child_process').exec,
    child;

 
app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("page");
});

app.use(express.static(__dirname + '/public')); 
var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
    socket.on('doRestart', function (data) {
	console.log('Restarting...');
        io.sockets.emit('restart', { }); 
    });
});

console.log("Listening on port " + port);
child = spawn('node', ['index.js'] , { cwd: './readData' });

child.stdout.on('data', function (data) {
	console.log('Child says: ' + data);
});

