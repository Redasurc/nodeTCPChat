class Client{
	username: string;
	socket: socket;
	constructor(name: string, socket: string) {
		this.username = name;
		this.socket = socket;	
	}
	setName(name: string){
		this.username = name;
	}
	setSocket(socket: socket){
		this.socket = socket;
	}
	getName(){
		return this.username;
	}
	getSocket(){
		return this.socket;
	}
	/**
	  * Send msg to client, removes the name: header and sends a new one
	  */
	write(msg: string){
		this.socket.write("\r" + msg + "\r\n");
		this.sendNameHeader();
	}
	/**
	  * Send msg to client without trying to change or remove name: header. also doesn't send a new one
	  */
	writeRaw(msg: string){
		this.socket.write(msg);
	}
	/**
	  * Sends a name: header to the client
	  */
	sendNameHeader(){
		this.socket.write("    "  + this.username + ": ");
	}
}