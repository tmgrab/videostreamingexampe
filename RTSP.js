//This module is responsible for parsing and replying to all RTSP commands for each client
var rtp = require('./rtp.js');
var client_port;


//This function creates a random number used for the session number
function createNewSessionNumber(){
	return Math.floor(Math.random()*1000000);//create a random number between 0-999999
}


this.rtspCommandParser = function(command, ipAddress, port){
	var cmd = command.toString();
	var clientCommand = cmd.split('\n');
	var ctrl = clientCommand[0].toString().split(' '); //ctrl corresponds to PLAY, PAUSE, etc commands
	var seq = clientCommand[1].toString().split(' '); //Sequence number, for example CSeq: 1
	switch(ctrl[0]){ //Simple switch statement based on the control message sent by the user
		case "SETUP":
				//set up a new session and add it to the table
				client_port = clientCommand[2].toString().split(' ')[3]; //extract the client port used for sending the UDP datagrams
				var sessionid = createNewSessionNumber(); //generate a new random session number for the client connection
				var video = ctrl.toString().split('/')[3].split(',')[0]; //extract the video the user wishes to play
				//Next we need to parse the input command to get the video the user wishes to play
				rtp.setupVideo(client_port, sessionid, video);
				return 'RTSP/1.0 200 OK\nCSeq: '+seq[1]+'\nSession: '+sessionid+'\r';
		case "PLAY":
				var session = clientCommand[2].toString().split('  ')[1];
				rtp.setTimer(parseInt(session));
				return 'RTSP/1.0 200 OK\nCSeq: '+seq[1]+'\nSession: '+session+'\r';
		case "PAUSE":
				var session = clientCommand[2].toString().split('  ')[1];
				rtp.setPause(parseInt(session));
				return 'RTSP/1.0 200 OK\nCSeq: '+seq[1]+'\nSession: '+session+'\r';
		case "TEARDOWN":
				var session = clientCommand[2].toString().split('  ')[1];
				rtp.tearDown(parseInt(session));
				return 'RTSP/1.0 200 OK\nCSeq: '+seq[1]+'\nSession: '+session+'\r';
	}
};


//exports.rtspCommandParser = rtspCommandParser;
