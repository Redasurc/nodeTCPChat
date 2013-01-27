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
