var Chat = (function () {
    function Chat() {
        this.chatroom = new Chatroom();
        this.commandParser = new CommandParser();
    }
    Chat.prototype.newConnection = function (socket) {
        var username = "";
        var ip = socket.remoteAddress;
        console.log("New connection from " + ip);
        socket.write("Welcome to IDP AT Chat\r\n=======================\r\nUsername?:");
        socket.on('data', _readNewLine(data));
        socket.on('end', _endConnection);
    };
    Chat.prototype._readNewLine = function (data) {
    };
    Chat.prototype._endConnection = function () {
    };
    return Chat;
})();
