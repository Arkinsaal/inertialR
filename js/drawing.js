function drawPlayer() {

	var pHead = (player.heading)*constant.degsToRads;

    ctx.save();

	    ctx.strokeStyle = player.color;
        ctx.fillStyle = player.color;
		ctx.shadowColor = player.color;
		ctx.shadowBlur = 40;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.lineWidth = 3;
		ctx.translate(player.l-10, player.t-10);
		ctx.rotate(pHead);

		// core
		ctx.beginPath();
		ctx.shadowBlur = 0;
		ctx.arc(0, -2, 4, 0, 2*Math.PI, false);
		ctx.fill();

		// inner
		ctx.beginPath();
		ctx.shadowBlur = 0;
		ctx.arc(0, 6, 8, 0.75*Math.PI, (2*Math.PI)+(0.25*Math.PI), false);
		ctx.stroke();

		// outer
		ctx.beginPath();
		ctx.arc(-2, 0, 15, 1.54*Math.PI, (2*Math.PI)+(0.35*Math.PI), false);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(2, 0, 15, 0.65*Math.PI, 1.46*Math.PI, false);
		ctx.stroke();


		ctx.shadowBlur = 40;
		ctx.beginPath();
		ctx.arc(-6, -14, 3, Math.PI-1, 0, false);
		ctx.stroke();
		ctx.fill();

		ctx.beginPath();
		ctx.arc(6, -14, 3, -Math.PI, 1, false);
		ctx.stroke();
		ctx.fill();

		if (player.keys[38]) {
			engineTrailsArray.push(new EngineTrail([player.l-10, player.t-10], pHead, player.color));
		};
		/*if (keys[37] || keys[39]) {
		};*/
	ctx.restore();
};

function drawOpponents() {
	for (var j=0;j<opponents.length;j++) {
        ctx.save();
	        ctx.strokeStyle = opponents[j].color;
	        ctx.fillStyle = opponents[j].color;
			ctx.shadowColor = opponents[j].color;
			ctx.shadowBlur = 40;
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.lineWidth = 3;
			ctx.translate(opponents[j].l-10, opponents[j].t-10);
			ctx.rotate((opponents[j].heading)*constant.degsToRads);

			// outer
			ctx.beginPath();
			ctx.arc(-2, 0, 15, 1.54*Math.PI, (2*Math.PI)+(0.35*Math.PI), false);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(2, 0, 15, 0.65*Math.PI, 1.46*Math.PI, false);
			ctx.stroke();

			// inner
			ctx.beginPath();
			ctx.shadowBlur = 0;
			ctx.arc(0, 6, 8, 0.75*Math.PI, (2*Math.PI)+(0.25*Math.PI), false);
			ctx.stroke();

			// core
			ctx.beginPath();
			ctx.shadowBlur = 0;
			ctx.arc(0, -2, 4, 0, 2*Math.PI, false);
			ctx.stroke();
			ctx.fill();

			if (opponents[j].keys[38]) {
				engineTrailsArray.push(new EngineTrail([opponents[j].l-10, opponents[j].t-10], (opponents[j].heading)*constant.degsToRads, opponents[j].color));
			};

		ctx.restore();
	};
};

function drawCheckPoints() {

    ctx.save();
		ctx.strokeStyle = 'rgb(50,255,50)';
		ctx.lineWidth = 5;
		ctx.shadowColor = 'rgb(50,255,50)';
		ctx.shadowBlur = 20;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		for (var i=0; i < currentMatch.checkpoints.length; i++) {
			if (currentMatch.checkpoints[i].touched && currentMatch.checkpoints[i].r>0) {
				currentMatch.checkpoints[i].r -= delta * 0.2;
				if (currentMatch.checkpoints[i].r<0) currentMatch.checkpoints[i].r=0;
			};
			ctx.beginPath();
			ctx.arc(currentMatch.checkpoints[i].l, currentMatch.checkpoints[i].t, currentMatch.checkpoints[i].r, 0, 2 * Math.PI, false);
			ctx.closePath();
			ctx.stroke();
		};
	ctx.restore();
};

function drawObstacles() {
	for (var i=0; i < currentMatch.obstacles.length;i++) {
		if (currentMatch.obstacles[i].type=='blackhole') {
			ctx.save();
				var tO = currentMatch.obstacles[i];
				var grd=ctx.createRadialGradient(tO.l,tO.t,10,tO.l,tO.t,tO.r);
				grd.addColorStop(0,"black");
				grd.addColorStop(1,"transparent");
				ctx.beginPath();
			    ctx.fillStyle = grd;
				ctx.arc(tO.l, tO.t, tO.r, 0, 2 * Math.PI, false);
				ctx.closePath();
				ctx.fill();
			ctx.restore();
		} else {
			ctx.save();
			    ctx.fillStyle = "rgb(33,40,48)";
				ctx.lineWidth = 2;
			    ctx.strokeStyle = "rgb(100,100,100)";
		        ctx.fillRect(currentMatch.obstacles[i].l, currentMatch.obstacles[i].t, currentMatch.obstacles[i].r-currentMatch.obstacles[i].l, currentMatch.obstacles[i].b-currentMatch.obstacles[i].t);
				ctx.strokeRect(currentMatch.obstacles[i].l, currentMatch.obstacles[i].t, currentMatch.obstacles[i].r-currentMatch.obstacles[i].l, currentMatch.obstacles[i].b-currentMatch.obstacles[i].t);
			ctx.restore();
		}
	};
}

function drawBoundary() {
	for (var i=0; i < trackBlocks.length;i++) {
		ctx.save();
		    ctx.fillStyle = trackBlocks[i].color;
			ctx.lineWidth = 2;
		    ctx.strokeStyle = (trackBlocks[i].active)?"rgb(175,175,175)":"rgb(100,100,100)";
	        ctx.fillRect(trackBlocks[i].l, trackBlocks[i].t, trackBlocks[i].r-trackBlocks[i].l, trackBlocks[i].b-trackBlocks[i].t);
			ctx.strokeRect(trackBlocks[i].l, trackBlocks[i].t, trackBlocks[i].r-trackBlocks[i].l, trackBlocks[i].b-trackBlocks[i].t);
		ctx.restore();
	};
};

function drawStartFinish() {
	ctx.save();
		ctx.beginPath();
		ctx.arc(startFinish.l, startFinish.t, startFinish.r, 0, 2 * Math.PI, false);
		ctx.strokeStyle = "#fff";
		ctx.lineWidth = 5;
		ctx.shadowColor = "#fff";
		ctx.shadowBlur = 200;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.stroke();
		ctx.fillStyle = ctx.createPattern(imageObj, 'repeat');
		ctx.fill();
	ctx.restore();
};

function drawEngineTrails() {
	ctx.shadowBlur = 60;
	ctx.lineWidth = 2;
	for (var i=0; i<engineTrailsArray.length; i++) {
		var thisTrail = engineTrailsArray[i];
		ctx.save();
			ctx.strokeStyle = thisTrail.color;
			ctx.shadowColor = thisTrail.color;
			ctx.globalAlpha = 1 - (thisTrail.r * 0.03);
			ctx.translate(thisTrail.l, thisTrail.t);
			ctx.rotate(thisTrail.heading);
			if (i%2==0) {
				ctx.translate(-6, -10);
			}
			else ctx.translate(6, -10);
			ctx.beginPath();
			ctx.arc(0, 0, thisTrail.r, trailArcStartStop[0], trailArcStartStop[1], false);
		    ctx.stroke();
		ctx.restore();
		thisTrail.r+=((0.1*delta)*(thisTrail.r*0.1));
		if ((1 - (thisTrail.r * 0.03)) < 0) engineTrailsArray.splice(engineTrailsArray.indexOf(thisTrail), 1);
	}
};

function drawScoreBoard(game, player, opponents) {

	ctx.strokeStyle = "rgb(100,100,100)";
	ctx.fillStyle = player.color;
	ctx.strokeRect(canvas.width - 200, 0, 200, 100);

	ctx.font="16px Arial";
	ctx.fillText(player.lap + " / " + game.laps,canvas.width - 180,20);
	ctx.fillText(player.lapTimes[0]/1000 + "s",canvas.width - 180,40);
};

function createGameListElement(game) {
	if (!game.winner && !game.inProgress) {
		var gameEntry = "" +
			"<div class='lobbyGame'>" +
				"<div class='lobbyGameName'>" + game.name + "</div>" +
				"<div class='lobbyGamePlayers'>" + game.players.length + " / " + game.requiredPlayers + "</div>" +
				"<div class='joinGameButton' " + " onclick='joinGame(" + '"' + game.guid + '"' + ")'" + ">Join</div>"
			"</div>";

		return gameEntry;
	};
};

function updateGamesList(data) {
	var gamesList = $('<div></div>');;
	Object.keys(data).forEach(function(key) {
		if (data[key].players.length < data[key].requiredPlayers) {
			gamesList.append($(createGameListElement(data[key])));
		};
	});
	$('#gamesList').html(gamesList);
}

function drawPlayerScoreEntry(pl) {
	var playerEntry = "" +
		"<div id='" + pl.guid + "' class='playerScoreEntry' style='color: " + pl.color + "'>" +
			"<div id='" + pl.guid + "1" + "' class='playerScoreEntry--lap'>" +
				"<div class='playerScoreEntry--name'>" + pl.name + "</div>" +
				"<div class='playerScoreEntry--lapNumber'>1</div>" +
				"<div class='playerScoreEntry--checkpoints'><div class='checkpointHolder'></div></div>" +
				"<div class='playerScoreEntry--time'>0.000</div>" +
			"</div>" +
		"</div>";
	$('#playerProgressPanel').append($(playerEntry));
};

function addToPlayerScoreEntry(pl) {
	if ($("#" + pl.guid + "" + pl.lap).length==0) {
		var lapEntry = "" +
			"<div id='" + pl.guid + "" + pl.lap + "' class='playerScoreEntry--lap'>" +
				"<div class='playerScoreEntry--name'></div>" +
				"<div class='playerScoreEntry--lapNumber'>" + pl.lap + "</div>" +
				"<div class='playerScoreEntry--checkpoints'><div class='checkpointHolder'></div></div>" +
				"<div class='playerScoreEntry--time'>0.000</div>" +
				"<div class='clear'></div>" +
			"</div>";
		$('#' + pl.guid).append($(lapEntry));
	};
	$("#" + pl.guid + "" + pl.lap + " .playerScoreEntry--time").eq(0).html(pl.lapTimes[0]/1000 + "s");
	var checkPointEle = $("#" + pl.guid + "" + pl.lap + " .checkpointHolder").eq(0).html("");
	var newEle = "";
	for (var i=0; i<pl.touchedCount; i++) {
		newEle += "<div class='checkpointEntry'></div>";
	};
	$("#" + pl.guid + "" + pl.lap + " .checkpointHolder").eq(0).append($(newEle));
};

function playerTouchedCheckpoint(pl) {
	if ($("#" + pl.guid + "" + pl.lap).length==1) {
		$("#" + pl.guid + "" + pl.lap + " .checkpointHolder").eq(0).append("<div class='checkpointEntry'></div>");
	};
}