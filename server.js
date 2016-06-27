var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

var server = http.createServer(function(req, res) {
	var filePath = false;

	if (req.url === '/') {
		filePath = 'public/index.html';
	} else {
		filePath = 'public' + req.url;
	}

	absPath = './' + filePath;
	serveStatic(res, cache, absPath);
});

server.listen(3000, function() {
	console.log('Server listen on port 3000');
});

function send404(res) {
	res.writeHead(404, { 'Content-Type': 'text/plain' });
	res.write('Error 404: resource not found.');
	res.end();
}

function sendFile(res, filePath, fileContent) {
	res.writeHead(200, { 'Content-Type': mime.lookup(path.basename(filePath)) });
	res.end(fileContent);
}

function serveStatic(res, cache, absPath) {
	if (cache[absPath]) {
		res.end(cache[absPath]);
	} else {
		fs.stat(absPath, function(err, Stats) {
			if (err) {
				send404(res);
			} else {
				fs.readFile(absPath, function (err, data) {
					if (err) {
						send404(res);
					} else {
						cache[absPath] = data;
						sendFile(res, absPath, data);
					}
				})
			}
		});
	}
}

