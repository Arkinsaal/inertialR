var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var initialR = require('./server/inertialRServer');

var port = 3000;
var router = express.Router();

var serverGameLoop = null;

app.use(express.static(__dirname + '/'));
app.use('/api', router);

router.use(function(req, res, next) {
	next();
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

io.on('connection', function(socket){
	// user connected
  	console.log('a user connected');

  	socket.on('connectMe', function(data) {
  		console.log('connecting player');
  		initialR.addPlayer(data, function() {
  		});
  	});

  	socket.on('hereIAm', function(data) {
  		initialR.updatePlayer(data, function() {
  		});
  	});

  	// user disconnected
  	socket.on('disconnect', function(e, r) {
  		console.log('a user disconnected');
  	});
});

function gameLoop() {
    serverGameLoop = setTimeout(function() {
        sendPositions();
        gameLoop();
    }, 100);
};
    gameLoop();

function sendPositions() {
	io.emit('playerPositions', initialR.getPlayers());
};

/*router.route('/users')
	.post(function(req, res) {
		notes.createUser(req.body, function() {
			res.json({ message: 'user successfully added' });
		});
	});*/


http.listen(port);