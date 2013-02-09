var Client = require('./Client').Client;

class Room {
    private clients: Array = [];

	add(socket: socket, username: string){
		var a = new Client(username, socket); 
		this.clients.push(a);

		this.write("Welcome " + username, socket, 0);
		this.write("-------------------------------------------", socket, 0);
		this.write("                                           ", socket, 0);
		this.sendConnectedUsers(socket);
		this.write(username + " joined", socket, 1);

		console.log(socket.remoteAddress + " logged in as " + username);

		return this;
	}

	remove(socket: socket){
		var i = this.getIndexBySocket(socket);

		if(i !== undefined){
			var uname = this.clients[i].getName();
			this.clients.splice(i, 1);
			this.write(uname + " disconnected");
        	console.log(uname + " logged out");
		}else{
			console.log(socket.remoteAddress + " lost seesion");
		}

		return this;
	}

	write(msg: string, socket: socket, mode: number){
		if(mode == undefined) mode = 0;
		for(var i = 0; i < this.clients.length; i++) {
			if(socket == undefined){
				this.clients[i].write(msg, 2);
			}else{
				if(socket == this.clients[i].getSocket()){
					if(mode == 0){
						this.clients[i].write(msg, 2);
					}
				}else{
					if(mode == 1){
						this.clients[i].write(msg, 2);
					}
				}
			}
		}
	}

	sendConnectedUsers(socket: socket){
		var names = [];
		for(var i = 0; i < this.clients.length; i++) {
        	names.push(this.clients[i].getName());
		}
        this.write("Currently connected: " + this.clients.length + " Clients (" + names.join(", ") + ")", socket, 0);
	}

	changeUserName(socket: socket, newName: string){
		var i = this.getIndexBySocket(socket);
		var oldName = this.clients[i].getName();
		
		this.clients[i].setName(newName);
		this.write(oldName + " changed username to " + newName);
		return this;
	}

	sendNameHeader(socket: socket){
		var i = this.getIndexBySocket(socket);
		this.clients[i].write("",3);
	}

	getNameBySocket(socket: socket){
		var i = this.getIndexBySocket(socket);
		return this.clients[i].getName();
	}

	getIndexBySocket(socket: socket){
		for(var i = 0; i < this.clients.length; i++) {
			if(this.clients[i].getSocket() == socket){
				return i;
			}
		}
	}
}
exports.Room = Room;