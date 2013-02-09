var Client = require('./Client').Client;
var Room = (function () {
    function Room() {
        this.clients = [];
    }
    Room.prototype.add = function (socket, username) {
        var a = new Client(username, socket);
        this.clients.push(a);
        this.write("Welcome " + username, socket, 0);
        this.write("-------------------------------------------", socket, 0);
        this.write("                                           ", socket, 0);
        this.sendConnectedUsers(socket);
        this.write(username + " joined", socket, 1);
        console.log(socket.remoteAddress + " logged in as " + username);
        return this;
    };
    Room.prototype.remove = function (socket) {
        var i = this.getIndexBySocket(socket);
        if(i !== undefined) {
            var uname = this.clients[i].getName();
            this.clients.splice(i, 1);
            this.write(uname + " disconnected");
            console.log(uname + " logged out");
        } else {
            console.log(socket.remoteAddress + " lost seesion");
        }
        return this;
    };
    Room.prototype.write = function (msg, socket, mode) {
        if(mode == undefined) {
            mode = 0;
        }
        for(var i = 0; i < this.clients.length; i++) {
            if(socket == undefined) {
                this.clients[i].write(msg, 2);
            } else {
                if(socket == this.clients[i].getSocket()) {
                    if(mode == 0) {
                        this.clients[i].write(msg, 2);
                    }
                } else {
                    if(mode == 1) {
                        this.clients[i].write(msg, 2);
                    }
                }
            }
        }
    };
    Room.prototype.sendConnectedUsers = function (socket) {
        var names = [];
        for(var i = 0; i < this.clients.length; i++) {
            names.push(this.clients[i].getName());
        }
        this.write("Currently connected: " + this.clients.length + " Clients (" + names.join(", ") + ")", socket, 0);
    };
    Room.prototype.changeUserName = function (socket, newName) {
        var i = this.getIndexBySocket(socket);
        var oldName = this.clients[i].getName();
        this.clients[i].setName(newName);
        this.write(oldName + " changed username to " + newName);
        return this;
    };
    Room.prototype.sendNameHeader = function (socket) {
        var i = this.getIndexBySocket(socket);
        this.clients[i].write("", 3);
    };
    Room.prototype.getNameBySocket = function (socket) {
        var i = this.getIndexBySocket(socket);
        return this.clients[i].getName();
    };
    Room.prototype.getIndexBySocket = function (socket) {
        for(var i = 0; i < this.clients.length; i++) {
            if(this.clients[i].getSocket() == socket) {
                return i;
            }
        }
    };
    return Room;
})();
exports.Room = Room;
