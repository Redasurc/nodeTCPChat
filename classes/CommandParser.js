var Room = require('./Room').Room;
var CommandParser = (function () {
    function CommandParser() {
        this.room = new Room();
    }
    CommandParser.prototype.parse = function (command, socket) {
        command = command.toString().replace("\r\n", "");
        if(this.room.getIndexBySocket(socket) === undefined) {
            if(16 > command.length && command.length > 3) {
                this.room.add(socket, command);
            } else {
                socket.write("Username have to be between 3 and 16 chars\r\nUsername?:");
            }
        } else {
            if(command.charAt(0) == '/') {
                switch(command) {
                    case "/disconnect":
                    case "/exit":
                    case "/close":
                        break;
                    case "/online":
                    case "/o":
                        this.room.sendConnectedUsers(socket);
                        break;
                    default:
                        this.room.write("Command invalid", socket, 0);
                }
            } else {
                this.room.write("    " + this.room.getNameBySocket(socket) + ": " + command, socket, 1);
                this.room.sendNameHeader(socket);
            }
        }
        return this;
    };
    CommandParser.prototype.connectionLost = function (socket) {
        this.room.remove(socket);
        return this;
    };
    return CommandParser;
})();
exports.CommandParser = CommandParser;
