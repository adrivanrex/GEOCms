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

//save the sockets
var allSockets = {};

//send to module
index.getAllSockets(allSockets);

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

app.get('/', routes.index);
app.get('/users', user.list);



server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

io.sockets.on('connection', function (socket) {
    
    //save the socket
    allSockets[socket.id] = socket;

    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log("Sent from client: " + data.my);
    });
    
    //handler to remove the socket from memory when it disconnects
    socket.on('disconnect', function() {
        delete allSockets[socket.id];
    });
});
