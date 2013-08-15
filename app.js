/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , index = require('./routes/index')
    , http = require('http')
    , path = require('path')
    , sio = require('socket.io');


var app = express();

//start socket.io
var server = http.createServer(app);
var io = sio.listen(server);


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var config = {};

app.get('/', function(req,res){
	var longitude = req.query["longitude"];
	var latitude = req.query["latitude"];
	var username = req.query["username"];
	var message = req.query["message"];
	var to = req.query["to"];
	var unitid = req.query["unitid"];
	
	config.longitude = longitude;
	config.latitude = latitude;
	config.username = username;
	config.message = message;
	config.to = to;
	config.unitid = unitid;
	res.render('index', { title: 'Express' }); 
	
});
app.get('/users', user.list);




server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

var clients = {};

io.sockets.on('connection',function(socket){
	
	  clients[config.username] = {
      "socket": socket.id
    };
	
   console.log("Sending: " + config.latitude + " to " + config.to);
   if(clients[config.to]){
		io.sockets.socket(clients[config.to].socket).emit("update-location", config);
	}

});
