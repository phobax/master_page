// load library
var restify = require("restify");
var PORT = 8000;


var server = restify.createServer();

server.get ("/*",
            restify.plugins.serveStatic({
              directory: __dirname,
              default: 'index.html'
           }));

server.listen (PORT, function() {
	console.log("%s listening at %s", server.name, server.url);
});
