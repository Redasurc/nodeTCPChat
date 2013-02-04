// Config
PORT = 8000;


var net = require('net');
var fs = require('fs');
var vm = require('vm');

var includeInThisContext = function(path) {
    var code = fs.readFileSync(path);
    vm.runInThisContext(code, path);
}.bind(this);

includeInThisContext("./classes/Chat.js");
includeInThisContext("./classes/Chatroom.js");
includeInThisContext("./classes/Client.js");
includeInThisContext("./classes/CommandParser.js");


var chat = new Chat();
var s = net.Server(function(socket){
	chat.newConnection(socket);
});
s.listen(PORT);
console.log("Server started (listening on Port: " + PORT + ")");