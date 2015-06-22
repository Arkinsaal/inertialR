var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var inertialR = require('./server/inertialRServer');

var port = 80;
var router = express.Router();

var serverGameLoop = null;

var allClients = [];

app.use(express.static(__dirname + '/'));
app.use('/api', router);

router.use(function(req, res, next) {
	next();
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

io.on('connection', function(socket){

    allClients.push({
        socket: socket.id,
        player: null,
        game: null
    });
	// user connected
  	console.log('a user connected');

    socket.on('kickUser', function(player) {

    });

    socket.on('goToLobby', function(player) {
        allClients[findClient(socket)].player = player;
        inertialR.addPlayerToLobby(player, function() {
            io.emit('lobbyPlayersUpdate', inertialR.getLobbyPlayers());
            io.emit('lobbyGamesUpdate', inertialR.getActiveGames());
        });
    });

    socket.on('returnToLobby', function(game) {
        socket.leave(game);
        inertialR.disposeOfGame(game.guid);
        var clientIndex = findClient(socket),
            client  = allClients[clientIndex]; 
        inertialR.addPlayerToLobby(client.player, function() {
            io.emit('lobbyPlayersUpdate', inertialR.getLobbyPlayers());
            io.emit('lobbyGamesUpdate', inertialR.getActiveGames());
        });
    });

    socket.on('createGame', function(gameData) {
        inertialR.createNewGame(gameData, function() {
            io.emit('lobbyGamesUpdate', inertialR.getActiveGames());
        });
    });

    socket.on('requestJoinGame', function(data) {
        inertialR.joinGame(data.game, data.player, function(res) {
            socket.emit('gameJoinRequestResponse', res);                                // let the player know the result of their join request
            if (!res.error) {
                allClients[findClient(socket)].game = res.data.guid;                    // store game for socket
                socket.join(res.data.guid);                                             // join room of game
                socket.to(res.data.guid).emit('newOpponent', data.player);              // let everyone in game know player details
                socket.broadcast.emit('lobbyGamesUpdate', inertialR.getActiveGames());  // let everyone know of game update
            };
        });
    });

    socket.on('gameStart', function(match) {
        //if (!inertialR.getActiveGames()[match.guid].inProgress) gameLoop(match.guid);
        inertialR.getActiveGames()[match.guid].inProgress = true;
    });

    socket.on('gameFinish', function(data) {
        var activeGames = inertialR.getActiveGames()
        if (activeGames[data.game].winner==null) {
            activeGames[data.game].winner = data.player.guid;
            activeGames[data.game].inProgress = false;
            io.to(data.game).emit('winnerAnnounced', data.player);
        };
    });

  	socket.on('hereIAm', function(data) {
        //inertialR.updatePlayer(data);
        io.to(data.game).emit('playerPositions', data.player);
  	});

  	// user disconnected
  	socket.on('disconnect', function(e, r) {
        var clientIndex = findClient(socket),                                                                                                   // get client index for reference
            client  = allClients[clientIndex];                                                                                                  // get client for reference
        if (inertialR.getActiveGames()[client.game]) inertialR.getActiveGames()[client.game].players.splice(inertialR.getActiveGames()[client.game].players.indexOf(client.player), 1);      // remove player from active game
        io.to(client.game).emit('playerLeft', client.player);                                                                                   // tell all other players in game that a player has left
        io.emit('lobbyGamesUpdate', inertialR.getActiveGames());                                                                                // let everyone know of game update
        allClients.splice(clientIndex, 1);                                                                                                      // remove client from list   
        inertialR.removePlayerFromLobby(client.player);

        console.log('a user disconnected');
  	});
});

/*function gameLoop(guid) {
    serverGameLoop = setTimeout(function() {
        if (inertialR.getActiveGames()[guid].inProgress) {
            sendPositions(guid);
            gameLoop(guid);
        };
    }, 100);
};*/

function sendPositions(data) {
};

function findClient(socket) {
    var res=-1;
    allClients.forEach(function(val, index) {
        if (val.socket.toString()==socket.id.toString()) res=index;
    });
    return res;
};

/*router.route('/users')
	.post(function(req, res) {
		notes.createUser(req.body, function() {
			res.json({ message: 'user successfully added' });
		});
	});*/


http.listen(port);
console.log('Server up and running on port ' + port);