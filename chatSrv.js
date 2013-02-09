// Config
PORT = 8000;


var net = require('net');
var Chat = require('./classes/Chat').Chat;


var chat = new Chat();
var s = net.Server(function(socket){
	chat.newConnection(socket);
});
s.listen(PORT);
console.log("Server started (listening on Port: " + PORT + ")");