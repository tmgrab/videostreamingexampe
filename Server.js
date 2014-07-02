var net = require('net');
var rtsp = require('./rtsp');


var HOST = '127.0.0.1';
var PORT = 3000;


//create a TCP connection which is used for sending RTSP information
net.createServer(function(sock){
	console.log('Client '+sock.remoteAddress + ':'+sock.remotePort+' is connected\n' );
	sock.on('data', function(data){


		console.log('Client '+ sock.remoteAddress+':'+sock.remotePort+' request' + ':\n' +data);
		sock.write(rtsp.rtspCommandParser(data,sock.remoteAddress,sock.remotePort));
	});


	sock.on('close', function(data){
		console.log('Closed: '+sock.remoteAddress + ' ' + sock.remotePort);
	});
}).listen(PORT,HOST);


console.log('Server listening on ' + HOST +':'+PORT);
