net = require('net');



// Config

var PORT = 8000;



var Users = (function () {
    function Users() {
        this.clients = [];
    }
    Users.prototype.login = function (socket, username) {
        var a = new Client();
        a.setSocket(socket);
        a.setName(username);
        this.clients.push(a);
    };
    Users.prototype.logout = function (socket) {
        var i = this.getIndexBySocket(socket);
        this.clients.splice(i, 1);
    };
    Users.prototype.getAllUsers = function () {
        var ret = [];
        for(var i = 0; i < this.clients.length; i++) {
            ret.push(this.clients[i].getName());
        }
        return ret;
    };
    Users.prototype.getUserCount = function () {
        return this.clients.length;
    };
    Users.prototype.write = function (socket, msg) {
        for(var i = 0; i < this.clients.length; i++) {
            if(this.clients[i].getSocket() == socket) {
                this.clients[i].getSocket().write("\r" + msg + "\r\n");
                this.clients[i].getSocket().write("    " + this.clients[i].getName() + ": ");
            }
        }
    };
    Users.prototype.writeAll = function (msg) {
        for(var i = 0; i < this.clients.length; i++) {
            this.clients[i].getSocket().write("\r" + msg + "\r\n");
            this.clients[i].getSocket().write("    " + this.clients[i].getName() + ": ");
        }
    };
    Users.prototype.writeAllExcept = function (socket, msg) {
        for(var i = 0; i < this.clients.length; i++) {
            if(this.clients[i].getSocket() != socket) {
                this.clients[i].getSocket().write("\r" + msg + "\r\n");
                this.clients[i].getSocket().write("    " + this.clients[i].getName() + ": ");
            }
        }
    };
    Users.prototype.sendNameHeader = function (socket) {
        for(var i = 0; i < this.clients.length; i++) {
            if(this.clients[i].getSocket() == socket) {
                this.clients[i].getSocket().write("    " + this.clients[i].getName() + ": ");
            }
        }
    };
    Users.prototype.getIndexBySocket = function (socket) {
        for(var i = 0; i < this.clients.length; i++) {
            if(this.clients[i].getSocket() == socket) {
                return i;
            }
        }
    };
    return Users;
})();
var Client = (function () {
    function Client() {
        this.username = "";
        this.socket = null;
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
    return Client;
})();







var LoginUsers = new Users();
var s = net.Server(function(socket){
  var username = "";

	socket.write("Welcome to IDP AT Chat\r\n=======================\r\nUsername?:");

	socket.on('data', function(d) {
		data = d.toString().replace("\r\n", "");
		if(username == ""){
			if(16 > data.length && data.length > 3){
				username = data;
				socket.write("Welcome " + username + "\r\n");
				LoginUsers.writeAll(username + " joined");

				LoginUsers.login(socket, username);
				LoginUsers.write(socket, "Currently connected: " + LoginUsers.getUserCount() + " Clients (" + LoginUsers.getAllUsers().join(", ") + ")");
				console.log(username + " connected");
				
				
			}else{
				socket.write("Username have to be between 3 and 16 chars\r\nUsername?:");
			}
		}else{
			if(data.charAt(0) == '/'){
				if(data == '/disconnect'){
					socket.end();
				}
			}else{
				LoginUsers.writeAllExcept(socket, "    " + username + ": " + data);
				LoginUsers.sendNameHeader(socket);
			}
		}
	});

	socket.on('end', function() {
		if(username != ""){
			LoginUsers.logout(socket);
			LoginUsers.writeAll(username + " disconnected");
			console.log(username + " disconnected");
		}
	});

});

s.listen(PORT);
console.log("Server started (listening on Port: " + PORT + ")");
