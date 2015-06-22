var canvas = null,
	ctx = null;

var engineTrailsArray = [];
var blackholeParticleArray = [];
var trailArcStartStop = [(Math.PI + (0.25*Math.PI)), ((2*Math.PI) - (0.25*Math.PI))];

var gamesPlayed = 0;

var socket = null;

var forceStop = false;

var selectedGame = null;

var then = null,
	now = null,
	delta = null,
	sendDelta = 0;

var player = new Player();
var currentMatch = new Game('freeRun', 1, "Unlimited");

var opponents = [],
	trackBlocks = [],
	keys = [];

trackBlocks.push(new block(0,1300,0,900));

var startFinish = {
	l: 0,
	t: 0,
	r: 200,
	touchedCount:0,
	txtAngle: Math.PI*2
};

var constant = {
	turnRate: 0.2,
	turnRateDecel: 0.9,
	accelRate: 0.1,
	friction: 0.995,
	degsToRads: 0.0174532925
};

var imageObj = new Image();
	imageObj.addEventListener('load', function() {
		init();
	});
	imageObj.src = '../rs/flagTexture.png';


var updateEntity = function (entity, deltaT, opp) {

	var reduce = true;

	if (player.keys[37]) {
		entity.yaw -= constant.turnRate;
		reduce=false;
	};
	if (player.keys[39]) {
		entity.yaw += constant.turnRate;
		reduce=false;
	};

	if (reduce) entity.yaw = entity.yaw*constant.turnRateDecel;

	entity.heading += entity.yaw * deltaT;
	entity.speedV = entity.speedV*constant.friction;
	entity.speedH = entity.speedH*constant.friction;

	var newL = entity.l + entity.speedH,
		newT = entity.t + entity.speedV;

    if (verticalCollision(newT, newL, trackBlocks[0])) {
        entity.speedV = entity.speedV*-0.3;
        entity.speedH = entity.speedH*0.3;
        entity.yaw = (entity.heading%45)*entity.speedH/20;
		entity.speedAdjust=0;
    } else {
        entity.t = newT;
    };
    if (horizontalCollision(newL, newT, trackBlocks[0])) {
        entity.speedV = entity.speedV*0.3;
        entity.speedH = entity.speedH*-0.3;
        entity.yaw = (entity.heading%45)*entity.speedV/20;
		entity.speedAdjust=0;
    } else {
        entity.l = newL;
    };

	for (var i=0; i<currentMatch.blackholes.length; i++) {
		handleBlackhole(entity, currentMatch.blackholes[i], deltaT);
	};
	for (var i=0; i<currentMatch.checkpoints.length; i++) {
		handleCheckpoint(entity, currentMatch.checkpoints[i]);
	};

	if (entity.touchedCount==currentMatch.checkpoints.length && circleCollision(entity, startFinish)) {
		if (entity.lap==currentMatch.laps) {
			socket.emit('gameFinish', {
				game: currentMatch.guid,
				player: player
			});
		} else {
			entity.lap++;
			entity.touchedCount=0;
			entity.lapTimes.unshift(0);

			for (var i=0; i<currentMatch.checkpoints.length; i++) {
				currentMatch.checkpoints[i].touched = false;
			};
		};
	};

	if (entity.keys[38]) {
		var headingRads = entity.heading * constant.degsToRads,
			accelChange = (constant.accelRate + entity.speedAdjust) * deltaT
		entity.speedAdjust+=(0.0001*deltaT);
		entity.speedV += Math.cos(headingRads) * accelChange;
		entity.speedH -= Math.sin(headingRads) * accelChange;
	} else {
		entity.speedAdjust=0;
	};
};

function enterLobby() {

	var pN = $('#userNameInput').val();

	if (pN) {
		player.name = pN;
		$('#userLogin').hide();
		$('#lobby').show();
		connectUserToLobby();
	};

};

function connectUserToLobby() {
	//socket = io.connect('http://ec2-52-25-122-253.us-west-2.compute.amazonaws.com/');
	socket = io.connect('http://localhost');

    socket.on('connect', function () {
    	console.log('connected');
		socket.emit('goToLobby', player);
    });

    socket.on('lobbyPlayersUpdate', function(data) {
    	var userList = "";
    	for (var i=0; i< data.length;i++) {
    		userList += "<div class='lobbyUser' style='color: " + data[i].color + "'>" + data[i].name + "<div>";
    	};
    	$('#userList').html(userList);
    });
	socket.on('lobbyGamesUpdate', function(data) {
		updateGamesList(data);
    });

    socket.on('gameJoinRequestResponse', function(data) {
    	if (data.error==null) {
	    	currentMatch = data.data;
	    	resetPlayerPosSpeed(player);
	    	opponents = currentMatch.players;
			for (var i=0; i<opponents.length;i++) {
				drawPlayerScoreEntry(opponents[i]);
				if (opponents[i].guid==player.guid) opponents.splice(i, 1);
			};
			$('#lobby').hide();
			$('#playerProgressPanel').show();
			init();
    	} else {
    		switch (data.error) {
    			case "gameIsFull":
					//updateGamesList(data);
    				break;
    			case "gameNotFound":
					//updateGamesList(data);
    				break;
    		}
    	};
    });
};

function setupGame() {
	$('#gameListHolder').hide();
	$('#gameSetupHolder').show();
}

function createNewGame() {
	var gN = $('#gameName').val(),
		rP = $('#players').val(),
		l = $('#laps').val(),
		cP = $('#checkpoints').val();
	if (gN && rP && l && cP) {
		var newGame = new Game(gN, rP, l);
		newGame.checkpoints = [];
		for (var i=0; i<cP; i++) {
			newGame.checkpoints.push(new Checkpoint());
		};
		newGame.guid = getNewGuid();
		socket.emit('createGame', newGame);
		$('#gameListHolder').show();
		$('#gameSetupHolder').hide();
		joinGame(newGame.guid);
	};
};

function joinGame(guid) {
	socket.emit('requestJoinGame', {
		game: guid,
		player: player
	});

	socket.on('playerLeft', function(player) {
		opponents.forEach(function(val, index) {
			if (val.guid == player.guid) opponents.splice(index, 1);
		});
	});

	socket.on('winnerAnnounced', finishEvent);
};

function returnToLobby() {
	$('#lobby').show();
	$('#playerProgressPanel').hide();
	$('#finish').hide();
	$('#playerProgressPanel').html('' +
        '<div class="medHeader">Lap Times</div>' +
        '<div id="progressHeader">' +
            '<div>Player</div>' +
            '<div>Lap</div>' +
            '<div>Checkpoints</div>' +
            '<div>Time</div>' +
            '<div class="clear"></div>' +
        '</div>'
    );
	socket.emit('returnToLobby', currentMatch);
	resetPlayerPosSpeed(player);
	currentMatch = new Game('freeRun', 1, "Unlimited");
	opponents = [];
	beginEvent();
};

function finishEvent(pl) {
	currentMatch.inProgress = false;
	forceStop = true;
	currentMatch.winner = pl;
	$('#winnerText').html(pl.name + " Wins!");
	$('#finish').show();
};

function beginEvent() {
	bgctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
	drawStartFinish();
	drawObstacles();
	function countDown(count) {
		if (count==0) {
			$('#countdown').html("GO!");
			then = Date.now();
			forceStop = false;
			main();
			setTimeout(function() {
				$('#countdown').hide();
			}, 500);
		} else {
			$('#countdown').html(count);
			setTimeout(function() {
				count--;
				countDown(count);
			}, 1000);
		};
	};
	if (currentMatch.requiredPlayers==(opponents.length+1)) {
		if (currentMatch.guid) socket.emit('gameStart', currentMatch);
		currentMatch.inProgress = true;
		$('#waitingForPlayers').hide();
		forceStop = false;
		player.touchedCount=0;
		if (currentMatch.guid) {
			countDown(3);
			forceStop = true;
			$('#countdown').show();
		} else {
			then = Date.now();
			forceStop = false;
			main();
		};
	};
};

var render = function () {
	ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );

	drawCheckPoints();

	drawOpponents();

	drawPlayer();
	drawEngineTrails();
};

// The main game loop
var main = function () {
	if (!forceStop) {
		now = Date.now();
		delta = now - then;
		sendDelta += delta;
		
		if (player) {
			updateEntity(player, (delta/10));
			if (!currentMatch.winner) player.lapTimes[0]+=delta;
			for (var i=0;i<opponents.length;i++) {
				updateEntity(opponents[i], (delta/10), true);
			};
			render();
			if (currentMatch.guid && sendDelta > 200) {
				socket.emit(currentMatch.guid).emit('hereIAm', {
					game: currentMatch.guid,
					player: player
				});
				sendDelta=0;
				addToPlayerScoreEntry(player);
			};
		};

		then = now;
		requestAnimationFrame(main);
	} else {
		forceStop=false;
	};
};

function init() {
	$('#waitingForPlayers').show();

	forceStop = true;

  	bgCanvas = document.getElementById('backgroundCanvas');
	bgctx = bgCanvas.getContext("2d");

  	canvas = document.getElementById('canvas');
	ctx = canvas.getContext("2d");

	canvas.width = bgCanvas.width = 1300;
	canvas.height = bgCanvas.height = 900;

	if (currentMatch.guid) {
	    socket.on('newOpponent', registerOpponent);
		socket.on('playerPositions', updateOpponents);
	};

	function updateOpponents(r) {
		if (r.guid!=player.guid) {
			for (var i=0; i<opponents.length;i++) {
				if (opponents[i].guid==r.guid) {
					opponents[i] = r;
					addToPlayerScoreEntry(opponents[i]);
				};
			};
		};
	};

	function registerOpponent(opp) {
		if (opp.guid!=player.guid) {
			opponents.push(opp);
			beginEvent();
			drawPlayerScoreEntry(opp);
		};
	};

	$(document).keydown(function(e) {
	  	var tK = e.which;
	  	if (tK>= 37 && tK <= 40) player.keys[e.which]=true;
	});

	$(document).keyup(function(e) {
	  	var tK = e.which;
	  	if (tK>= 37 && tK <= 40) player.keys[e.which]=false;
	});

	render();
	beginEvent();
};