
	var trackBlocks = [];

	var players = [];

	var updateTimers = {};

	module.exports = {
		getPlayers: function() {
			return players;
		},
		addPlayer: function(player, callback) {
			players.push(player);
			removePlayerTimer(player);
			callback();
		},
		updatePlayer: function(data, callback) {
			for (var i=0; i< players.length; i++) {
				if (players[i].guid==data.guid) players[i]=data;
				removePlayerTimer(data);
			};
			callback();
		}
	};

	

	function removePlayerTimer(player) {
		clearTimeout(updateTimers[player.guid]);
		updateTimers[player.guid] = setTimeout(function() {
			players.splice(players.indexOf(player),1);
		},10000);
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