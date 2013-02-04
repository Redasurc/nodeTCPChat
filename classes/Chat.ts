/**
  * A TCP Chat Programm
  */
class Chat{
	// The Chatroom (a collection of Clients)
	chatroom: Chatroom;

	// The command parser
	commandParser: CommandParser;

	/**
	  * Initialise variables
	  */
	constructor() {
		this.chatroom = new Chatroom();
		this.commandParser = new CommandParser();	
	}

	/**
	  * Add a new Socket to the Chatserver
	  */
	newConnection(socket: socket){
    	var username = "";
    	var ip = socket.remoteAddress;

		console.log("New connection from "+ ip);
		socket.write("Welcome to IDP AT Chat\r\n=======================\r\nUsername?:");


		// Event Hooks 
		socket.on('data', _readNewLine(data) );
		socket.on('end', _endConnection );
	}

	_readNewLine(data: string){

	}

	_endConnection(){

	}
}