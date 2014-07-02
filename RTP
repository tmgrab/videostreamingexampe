//RTP module implementation
var fs = require('fs');
var dgram = require('dgram');
var rtpPacket = require('./RTPpacket');
var message = new Buffer(' ');
var clientList = []; //Holds the list of currently streaming clients
var timer = require('timers');


//This timer function is used for sending a frame at a ver consistant rate (100ms) for each client
this.setTimer = function(sessionid){ 
	//set the client control message to play
	clientList[sessionid].control = "play";
	clientList[sessionid].timerID = timer.setInterval(function(){
		sendVideo(sessionid);
	},100);
}
var client = dgram.createSocket('udp4'); //create a new UDP socket


//The setup function is called when the server receives a RTSP setup instruction and is responsible for loading the video and creating a new client object
var setupVideo = function(client_port, sessionid, video){
	fs.readFile('./'+video, function (err, data) { //read the file based on the users selection
		if(err){
			throw err;
		}
		message = new Buffer(data.length); //create a new buffer object and put the raw file data into it
		message = data;
		//create the client object and store it in the array, Doing this will allow multiple clients to use the server at a time independently 
		//start corresponds to the users current position in the file
		clientList[sessionid] = {"port":client_port,"video":video,"start":0, "timestamp":0, "message":message,"control":"play","TimerID":null};
	});
}
//This function extracts the header and the frame, and creates a new packet sending it over a UDP connection
var sendVideo = function (sessionid){
	//first check if the video is paused, if it is return
		if(clientList[sessionid].control=="pause"){
			return;
		}
	//read the file 
		var frameHeader = new Buffer(5);
		frameHeader = clientList[sessionid].message.slice(clientList[sessionid].start, clientList[sessionid].start+5); //get the length of the next frame of video


		//extract the fram data based on the value retreived from the header
		var payload = clientList[sessionid].message.slice(clientList[sessionid].start+5, clientList[sessionid].start+5+parseInt(frameHeader.toString()));
		var frame = new Buffer(parseInt(frameHeader.toString())); 
		frame = rtpPacket.createPacket(payload,clientList[sessionid].timestamp);//using RTPpacket create a new packet object which creates a ready to send packet
		clientList[sessionid].start += 5+parseInt(frameHeader.toString(), 10); //increment the users current position in the video file


		//increment the timestamp
		clientList[sessionid].timestamp += 100 //we are sending a frame every 100ms so update the clients timestamp


		client.send(frame, 0, frame.length, clientList[sessionid].port,'localhost'); //send the frame to the client over a UDP connection


		//if we reach the end of the file restart the video position, this will create a video loop
		if(clientList[sessionid].start >= clientList[sessionid].message.length){
			clientList[sessionid].start=0;
		}
		prevFrame = frameHeader;


};


var setPause = function(sessionid){
	clientList[sessionid].control = "pause";
	timer.clearInterval(clientList[sessionid].timerID); //to pause simple stop sending timer events
}


var tearDown = function(sessionid){
	timer.clearInterval(clientList[sessionid].timerID);
	clientList[sessionid] = null;//on a teardown remove the client from the list of currently active clients
}


exports.tearDown = tearDown;
exports.sendVideo = sendVideo;
exports.setupVideo = setupVideo;
exports.setPause = setPause;

 
 


 
   

Status
 API
 Training
 Shop
 Blog
 About
 
