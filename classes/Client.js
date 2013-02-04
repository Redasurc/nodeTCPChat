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
exports = Client;
