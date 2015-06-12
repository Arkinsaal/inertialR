
var playersInLobby = [];
var activeGames = {};

module.exports = {
	getPlayers: function(game) {
		return activeGames[game].players;
	},
	getLobbyPlayers: function() {
		return playersInLobby;
	},
	getActiveGames: function() {
		return activeGames;
	},
	updatePlayer: function(data, callback) {
		if (activeGames[data.game]!=undefined) {
			var thisPlayers = activeGames[data.game].players;
			var pIndex = thisPlayers.indexOf(data.player)
			for (var i=0; i< thisPlayers.length;i++) {
				if (thisPlayers[i].guid == data.player.guid) thisPlayers[i] = data.player;
			};
		};
	},
	addPlayerToLobby: function(data, callback) {
		var found=false;
		for (var i=0; i<playersInLobby.length;i++) {
			if (playersInLobby[i].guid==data.guid) found=true;
		};
		if (!found) {
			playersInLobby.push(data);
		};
		callback();
	},
	createNewGame: function(game, callback) {
		activeGames[game.guid] = game;
		callback();
	},
	joinGame: function(game, player, callback) {
		if (activeGames[game]!=undefined) {
			if (activeGames[game].players.length < activeGames[game].requiredPlayers) {
				activeGames[game].players.push(player);

				for (var j=0; j<playersInLobby.length;j++) {
					if (playersInLobby[j].guid==player.guid) {
						playersInLobby.splice(j, 1);
					};
				};
				callback({
					data: activeGames[game],
					error: null
				});
				return;
			} else {
				callback({
					data: game,
					error: 'gameIsFull'
				});
			};
		};
		callback({
			data: game,
			error: 'gameNotFound'
		});
	},
	disposeOfGame: function(game) {
		if (activeGames[game] && activeGames[game].players.length==0) {
			delete activeGames[game];
		}
	}
};


function getNewGuid() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
};