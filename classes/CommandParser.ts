var Room = require('./Room').Room;

class CommandParser{
    public room: Room;
	constructor(){
        this.room = new Room();
	}
	parse(command: string, socket: socket){
        command = command.toString().replace("\r\n", "");

        //If isn't logged in
		if(this.room.getIndexBySocket(socket) === undefined){
			if(16 > command.length && command.length > 3){
				this.room.add(socket, command);				
			}else{
				socket.write("Username have to be between 3 and 16 chars\r\nUsername?:");
			}
		}else{
			if(command.charAt(0) == '/'){
                switch(command){
                    case "/disconnect":
                    case "/exit":
                    case "/close":
                        //socket.end();
                        break;
                    case "/online":
                    case "/o":
                        this.room.sendConnectedUsers(socket);
                        break;
                    default: 
                        this.room.write("Command invalid", socket, 0);
                }
			}else{
                this.room.write("    " + this.room.getNameBySocket(socket) + ": " + command, socket, 1);
                this.room.sendNameHeader(socket);
			}
		}
        return this;
	}
    connectionLost(socket: Socket){
        this.room.remove(socket);
        return this;
    }
}
exports.CommandParser = CommandParser;