class Users {
  clients: Array;
	constructor() {
		this.clients = [];	
	}
	login(socket: socket, username: string){
		var a = new Client(); 
		a.setSocket(socket);
		a.setName(username);
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
				this.clients[i].getSocket().write("\r" + msg + "\r\n");
                this.clients[i].getSocket().write("    "  + this.clients[i].getName() + ": ");
			}
		}
	}
	writeAll(msg: string){
		for(var i = 0; i < this.clients.length; i++) {
				this.clients[i].getSocket().write("\r" + msg + "\r\n");
                this.clients[i].getSocket().write("    "  + this.clients[i].getName() + ": ");
		}
	}
	writeAllExcept(socket: socket, msg: string){
		for(var i = 0; i < this.clients.length; i++) {
			if(this.clients[i].getSocket() != socket){
				this.clients[i].getSocket().write("\r" + msg + "\r\n");
            	this.clients[i].getSocket().write("    "  + this.clients[i].getName() + ": ");
			}
		}
	}
	sendNameHeader(socket:socket){
		for(var i = 0; i < this.clients.length; i++) {
			if(this.clients[i].getSocket() == socket){
                this.clients[i].getSocket().write("    "  + this.clients[i].getName() + ": ");
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
}

class Client{
	username: string;
	socket: socket;
	constructor() {
		this.username = "";
		this.socket = null;	
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
}
