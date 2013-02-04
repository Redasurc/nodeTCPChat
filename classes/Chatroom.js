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
exports = Chatroom;
