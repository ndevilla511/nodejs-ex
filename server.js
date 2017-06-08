//  OpenShift sample Node application

require('./api/data/db.js');

var express = require('express'),
    fs      = require('fs'),
    app     = express(),
    path    = require('path'),
    bodyParser = require('body-parser'),
    eps     = require('ejs'),
    morgan  = require('morgan'),
    routes  = require('./api/routes');
    
Object.assign=require('object-assign');

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'));

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';


// Define the port to run on
app.set('port', port);

// Add middleware to console log every request
app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
});

// Set static directory before defining routes
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '/index.html'));
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

// Enable parsing of posted forms
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Add some routing
app.use('/api', routes);


// Listen for requests
var server = app.listen(app.get('port'), ip, function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});



module.exports = app ;
