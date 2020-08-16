let fs = require('fs');
let http = require('http');
let https = require('https');
let httpProxy = require('http-proxy');

isHttps = true;

let options = {
  ssl: {
    key: fs.readFileSync('valid-key.pem'),
    cert: fs.readFileSync('valid-cert.pem')
  }
};
proxyServer = httpProxy.createProxyServer({target:'http://127.0.0.1:9000'});
proxyServer.listen(8000);

if (isHttps) {
    server = https.createServer(options.ssl, function(req, res) {
        console.log(`https request`);
        proxyServer.web(req, res, { target: req.url });
        proxyServer.on('error', function(e) {
            console.log("Error in proxy call");
        });
        proxyServer.listen(443);
   });
} else {
    server = http.createServer(function (req, res) {
        console.log(req.url);
        proxyServer.web(req, res, { target: req.url });
        proxyServer.on('error', function(e) {
            console.log("Error in proxy call");
        });
    });
}
server.listen(9000);