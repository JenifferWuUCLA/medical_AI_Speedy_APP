
// Dependencies
var express = require('express');

// Express
var app = express();

app.use(express.static(__dirname + '/public'));

// Start server
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080
, ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
app.listen(port, ip, function() {
  console.log('Express server listening on %d', port);
});
