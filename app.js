// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        31 Ago 2016
// * Description: Main app server file
//

// Load Require
var express = require('express'),
 path = require('path'),
 bodyParser = require('body-parser'),
 http = require('http'),
 dispatcher = require('httpdispatcher');

// Global variable declaration
var app = express();

//app.use(express.static(__dirname)); // Current directory is root
app.use(express.static(path.join(__dirname, '/')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    next();
});

// Load app configuration
var configuration = require('./config.js');
app.configSettings = configuration.getConfiguration();
app.procedures = configuration.getProcedures();
app.constants = configuration.getConstants();

// Load all server routes
var  serverInit = require('./api/init.js')(app);
serverInit.routes.init();

var server = http.createServer(app);

//Lets start our server
server.listen(app.configSettings.port, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: " + app.configSettings.urlServer);
});
