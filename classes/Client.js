var Client = (function () {
    function Client(name, socket) {
        this.username = name;
        this.socket = socket;
    }
    Client.prototype.setName = function (name) {
        this.username = name;
        return this;
    };
    Client.prototype.getName = function () {
        return this.username;
    };
    Client.prototype.getSocket = function () {
        return this.socket;
    };
    Client.prototype.write = function (msg, mode) {
        if(mode == undefined) {
            mode = 0;
        }
        switch(mode) {
            case 0:
                this.socket.write(msg + "\r\n");
                break;
            case 1:
                this.write(msg, 0);
                this.write("", 3);
                break;
            case 2:
                this.write("\r" + msg, 0);
                this.write("", 3);
                break;
            case 3:
                this.write("    " + this.username + ": ", 0);
                break;
            default:
                throw new Exception('Invalid write mode: ' + mode + '. Must be 0,1,2 or 3');
        }
        return this;
    };
    return Client;
})();
exports.Client = Client;
