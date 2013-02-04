net = require('net');



// Config

PORT = 8000;



var Chatroom = (function () {
    function Chatroom() {
        this.clients = [];
    }
    Chatroom.prototype.login = function (socket, username) {
        var a = new Client(username, socket);
        this.clients.push(a);
    };
    Chatroom.prototype.logout = function (socket) {
        var i = this.getIndexBySocket(socket);
        this.clients.splice(i, 1);
    };
    Chatroom.prototype.getAllUsers = function () {
        var ret = [];
        for(var i = 0; i < this.clients.length; i++) {
            ret.push(this.clients[i].getName());
        }
        return ret;
    };
    Chatroom.prototype.getUserCount = function () {
        return this.clients.length;
    };
    Chatroom.prototype.write = function (socket, msg) {
        for(var i = 0; i < this.clients.length; i++) {
            if(this.clients[i].getSocket() == socket) {
                this.clients[i].write(msg);
            }
        }
    };
    Chatroom.prototype.writeAll = function (msg) {
        for(var i = 0; i < this.clients.length; i++) {
            this.clients[i].write(msg);
        }
    };
    Chatroom.prototype.writeAllExcept = function (socket, msg) {
        for(var i = 0; i < this.clients.length; i++) {
            if(this.clients[i].getSocket() != socket) {
                this.clients[i].write(msg);
            }
        }
    };
    Chatroom.prototype.getIndexBySocket = function (socket) {
        for(var i = 0; i < this.clients.length; i++) {
            if(this.clients[i].getSocket() == socket) {
                return i;
            }
        }
    };
    Chatroom.prototype.sendNameHeader = function (socket) {
        for(var i = 0; i < this.clients.length; i++) {
            if(this.clients[i].getSocket() == socket) {
                this.clients[i].sendNameHeader();
            }
        }
    };
    return Chatroom;
})();
var Client = (function () {
    function Client(name, socket) {
        this.username = name;
        this.socket = socket;
    }
    Client.prototype.setName = function (name) {
        this.username = name;
    };
    Client.prototype.setSocket = function (socket) {
        this.socket = socket;
    };
    Client.prototype.getName = function () {
        return this.username;
    };
    Client.prototype.getSocket = function () {
        return this.socket;
    };
    Client.prototype.write = function (msg) {
        this.socket.write("\r" + msg + "\r\n");
        this.sendNameHeader();
    };
    Client.prototype.writeRaw = function (msg) {
        this.socket.write(msg);
    };
    Client.prototype.sendNameHeader = function () {
        this.socket.write("    " + this.username + ": ");
    };
    return Client;
})();
exports.Chatroom = Chatroom;






var Chatroom = new Chatroom();
var s = net.Server(function(socket){
    var username = "";
    var ip = socket.remoteAddress;
    console.log("New connection from "+ ip);
	socket.write("Welcome to IDP AT Chat\r\n=======================\r\nUsername?:");

	socket.on('data', function(d) {
		data = d.toString().replace("\r\n", "");
		if(username == ""){
			if(16 > data.length && data.length > 3){
				username = data;
				socket.write("Welcome " + username + "\r\n");
                Chatroom.writeAll(username + " joined");

                Chatroom.login(socket, username);
                showMembers();
				Chatroom.write(socket, "-------------------------------------------");
                Chatroom.write(socket, "                                           ");
                console.log(ip + " logged in as " + username);
				
				
			}else{
				socket.write("Username have to be between 3 and 16 chars\r\nUsername?:");
			}
		}else{
			if(data.charAt(0) == '/'){
                switch(data){
                    case "/disconnect":
                    case "/exit":
                    case "/close":
                        finSock();
                        socket.end();
                        break;
                    case "/online":
                    case "/o":
                        showMembers();
                        break;
                    default: 
                        Chatroom.write(socket, "Command invalid");
                }
			}else{
                Chatroom.writeAllExcept(socket, "    " + username + ": " + data);
                Chatroom.sendNameHeader(socket);
			}
		}
	});
    function showMembers(){
        Chatroom.write(socket, "Currently connected: " + Chatroom.getUserCount() + " Clients (" + Chatroom.getAllUsers().join(", ") + ")");
    }
    function finSock() {
        if(username != ""){
            Chatroom.logout(socket);
            Chatroom.writeAll(username + " disconnected");
            console.log(username + " logged out");
            username = "";
        }
    }
	socket.on('end', function() {
        if(username != ""){
            finSock();
        }
        console.log( ip + " disconnected");
    });

});

s.listen(PORT);
console.log("Server started (listening on Port: " + PORT + ")");
