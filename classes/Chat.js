var CommandParser = require('./CommandParser').CommandParser;
var Chat = (function () {
    function Chat() {
        this.commandParser = new CommandParser();
    }
    Chat.prototype.newConnection = function (socket) {
        var ip = socket.remoteAddress;
        var that = this;
        console.log("New connection from " + ip);
        socket.write("Welcome to IDP AT Chat\r\n=======================\r\nUsername?:");
        socket.on('data', _readNewLine);
        socket.on('end', _endConnection);
        function _readNewLine(data) {
            that.commandParser.parse(data, socket);
        }
        function _endConnection() {
            that.commandParser.connectionLost(socket);
        }
    };
    return Chat;
})();
exports.Chat = Chat;
