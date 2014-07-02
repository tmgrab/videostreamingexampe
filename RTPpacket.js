//RTPpacket File
//This file is used to create RTP packets, then wrap it in a UDP datagram
//var packet = require('buffer');


var sequence = Math.floor(Math.random()*65536);


var createPacket = function(payload,timestamp){
	//create the header based on the specification outlined in the assignment document
	this.packet = new Buffer(12+payload.length); //the packet will contain 12-bytes plus whatever the payload was 
	this.packet[0] = 0x80;
	this.packet[1] = 0x1A;
	this.packet.writeUInt16BE(sequence,2); //write 16-bits
	this.packet.writeUInt32BE(timestamp,4); //write 32-bits
	this.packet.writeUInt32BE(0,8);


	payload.copy(this.packet,12,0)//combine the payload with the header data


	sequence++;
	if(sequence == 65535){ //if we hit the last sequence number provide a wrap around
		sequence = 0; //provide the wrap around
	}


	return this.packet;
};


exports.createPacket = createPacket;
