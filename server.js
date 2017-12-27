var io = require('socket.io')(8080);
var PythonShell = require('python-shell');

io.on('connection', function (socket) {
  socket.on('opendoor', function (data) {
    console.log('Signal received!');

    PythonShell.run('switchController.py', function (err) {
      if (err) throw err;
      console.log('finished');
    });

  });
});

var http = require('http');
var fs = require("fs");

http.createServer(function(request, response) {

	if(request.url === "/"){
		sendFileContent(response, "public/index.html", "text/html");
	}
	else if(/^\/[a-zA-Z0-9\/]*.js$/.test(request.url.toString())){
		sendFileContent(response, "public/"+request.url.toString().substring(1), "text/javascript");
	}
	else if(/^\/[a-zA-Z0-9\/]*.css$/.test(request.url.toString())){
		sendFileContent(response, "public/"+request.url.toString().substring(1), "text/css");
	}
	else{
		console.log("Requested URL is: " + request.url);
		response.end();
	}
}).listen(80);

function sendFileContent(response, fileName, contentType){
	fs.readFile(fileName, function(err, data){
		if(err){
			response.writeHead(404);
			response.write("Not Found!");
		}
		else{
			response.writeHead(200, {'Content-Type': contentType});
			response.write(data);
		}
		response.end();
	});
}
