/**
  * A TCP Chat Programm
  */
var CommandParser = require('./CommandParser').CommandParser;

class Chat{
	// The command parser
	commandParser: CommandParser = new CommandParser();

	/**
	  * Initialise variables
	  */
	constructor() {
	}

	/**
	  * Add a new Socket to Chatserver
	  */
	newConnection(socket: socket){
		var ip = socket.remoteAddress;
		var that = this;
		console.log("New connection from "+ ip);
		socket.write("Welcome to IDP AT Chat\r\n=======================\r\nUsername?:");


		// Event Hooks 
		socket.on('data', _readNewLine); 
		socket.on('end', _endConnection);
		function _readNewLine(data){
			that.commandParser.parse(data, socket);
		}
		function _endConnection(){
			that.commandParser.connectionLost(socket);
		}
	}
}

exports.Chat = Chat;