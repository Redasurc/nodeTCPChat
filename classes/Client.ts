class Client{
	/** Changeable username */
	private username: string;
	/** Socket defined by Constructor, unchangeable */
	private socket: socket;

	constructor(name: string, socket: string) {
		this.username = name;
		this.socket = socket;
	}

	setName(name: string){
		this.username = name;
		return this;
	}

	getName(){
		return this.username;
	}

	getSocket(){
		return this.socket;
	}
	/**
	  * Send msg to client
	  *   Mode: 0: Raw write without nameheader
	  *         1: Raw write with nameheader
	  *         2: Clear line, write and send nameheader
	  *			3: Send new nameheader
	  */
	write(msg: string, mode: number){
		if(mode == undefined) mode = 0;
		switch(mode){
			case 0: 
				this.socket.write(msg + "\r\n");
				break;
			case 1:
				this.write(msg, 0);
				this.write("", 3);
				break;
			case 2:
				this.write("\r" + msg, 0);
				this.write("", 3);
				break;
			case 3:
				this.write("    "  + this.username + ": ",0);
				break;
			default:
				throw new Exception('Invalid write mode: ' + mode + '. Must be 0,1,2 or 3');

		}
		return this;
	}
}
exports.Client = Client;