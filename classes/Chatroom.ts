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