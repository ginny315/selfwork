var proxy = require('http-proxy').createProxyServer({});
proxy.on(function(err,req,res){
	res.writeHead(500,{'Content-Type':'text/plain'});

});

var server = require('http').createServer(function(req,res){
	var host= req.headers.host;
	switch(host){
		case 'www.penmanbox.com':
			proxy.web(req,res,{target:'http://localhost:3000'});
		break;
		case 'penmanbox.com':
			proxy.web(req, res, { target:'http://localhost:4000'});
		break;
		default:
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end('Welcome to my server!');
	}
});

console.log("listening on port 3000")
server.listen(80);