class Chatroom {
  clients: Array;
	constructor() {
		this.clients = [];	
	}
	login(socket: socket, username: string){
		var a = new Client(username, socket); 
		this.clients.push(a);
	}
	logout(socket: socket){
		var i = this.getIndexBySocket(socket);
		this.clients.splice(i, 1);
	}
	getAllUsers(){
		var ret = [];
		for(var i = 0; i < this.clients.length; i++) {
			ret.push(this.clients[i].getName());
		}
		return ret;
	}
	getUserCount(){
		return this.clients.length;
	}
	write(socket: socket, msg: string){
		for(var i = 0; i < this.clients.length; i++) {
			if(this.clients[i].getSocket() == socket){
				this.clients[i].write(msg);
			}
		}
	}
	writeAll(msg: string){
		for(var i = 0; i < this.clients.length; i++) {
				this.clients[i].write(msg);
		}
	}
	writeAllExcept(socket: socket, msg: string){
		for(var i = 0; i < this.clients.length; i++) {
			if(this.clients[i].getSocket() != socket){
				this.clients[i].write(msg);
			}
		}
	}
	getIndexBySocket(socket: socket){
		for(var i = 0; i < this.clients.length; i++) {
			if(this.clients[i].getSocket() == socket){
				return i;
			}
		}
	}
	sendNameHeader(socket: socket){
		for(var i = 0; i < this.clients.length; i++) {
			if(this.clients[i].getSocket() == socket){
				this.clients[i].sendNameHeader();
			}
		}
	}
}

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

exports.Chatroom = Chatroom;