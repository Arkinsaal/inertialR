function drawPlayer() {

	var pHead = (player.heading)*constant.degsToRads;

	ctx.save();
	    ctx.strokeStyle = player.color;
        ctx.fillStyle = player.color;
		ctx.shadowColor = player.color;
		ctx.shadowBlur = 40;
		ctx.lineWidth = 3;
		ctx.translate(player.l-10, player.t-10);
		ctx.rotate(pHead);

		// core
		ctx.beginPath();
		ctx.arc(0, -2, 4, 0, 2*Math.PI, false);
		ctx.fill();

		// inner
		ctx.beginPath();
		ctx.arc(0, 6, 8, 0.75*Math.PI, (2*Math.PI)+(0.25*Math.PI), false);
		ctx.stroke();

		// outer
		ctx.beginPath();
		ctx.arc(2, 0, 15, 0.65*Math.PI, 1.46*Math.PI, false);
		ctx.arc(-2, 0, 15, 1.54*Math.PI, (2*Math.PI)+(0.35*Math.PI), false);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(-6, -14, 5, Math.PI-1, 0, false);
		ctx.fill();

		ctx.beginPath();
		ctx.arc(6, -14, 5, -Math.PI, 1, false);
		ctx.fill();

		if (player.keys[38]) {
			engineTrailsArray.push(new EngineTrail([player.l-10, player.t-10], pHead, player.color));
		};
	ctx.restore();
};

function drawOpponents() {
	for (var j=0;j<opponents.length;j++) {
		var thisOpponent = opponents[j],
			opHead = thisOpponent.heading*constant.degsToRads,
			opL = thisOpponent.l-10,
			opT = thisOpponent.t-10;
        ctx.save();
	        ctx.strokeStyle = thisOpponent.color;
	        ctx.fillStyle = thisOpponent.color;
			ctx.shadowColor = thisOpponent.color;
			ctx.shadowBlur = 40;
			ctx.lineWidth = 3;
			ctx.translate(opL, opT);
			ctx.rotate(opHead);

			// core
			ctx.beginPath();
			ctx.arc(0, -2, 4, 0, 2*Math.PI, false);
			ctx.fill();

			// inner
			ctx.beginPath();
			ctx.arc(0, 6, 8, 0.75*Math.PI, (2*Math.PI)+(0.25*Math.PI), false);
			ctx.stroke();

			// outer
			ctx.beginPath();
			ctx.arc(2, 0, 15, 0.65*Math.PI, 1.46*Math.PI, false);
			ctx.arc(-2, 0, 15, 1.54*Math.PI, (2*Math.PI)+(0.35*Math.PI), false);
			ctx.stroke();

			ctx.beginPath();
			ctx.arc(-6, -14, 5, Math.PI-1, 0, false);
			ctx.fill();

			ctx.beginPath();
			ctx.arc(6, -14, 5, -Math.PI, 1, false);
			ctx.fill();

			if (thisOpponent.keys[38]) {
				engineTrailsArray.push(new EngineTrail([opL, opT], opHead, thisOpponent.color));
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
			var cP = currentMatch.checkpoints[i];
			if (cP.touched && cP.r>0) {
				cP.r -= delta * 0.2;
				if (cP.r<0) cP.r=0;
			} else if (!cP.touched && cP.r < 70) {
				cP.r += delta * 0.4;
				if (cP.r>70) cP.r=70;
			};
			ctx.beginPath();
			ctx.arc(cP.l, cP.t, cP.r, 0, 2 * Math.PI, false);
			ctx.closePath();
			ctx.stroke();
			if (cP.r>20) drawTextAlongArc(ctx, 'Checkpoint', cP.l, cP.t, cP.r - 10, (Math.PI/2), cP.txtAngle, 'rgb(0,255,0)');
			cP.txtAngle+=0.01;
		};
	ctx.restore();
};

function drawObstacles() {
	for (var i=0; i < currentMatch.blackholes.length;i++) {
		var bH = currentMatch.blackholes[i];
		bgctx.save();
			var tO = currentMatch.blackholes[i];
			var grd=bgctx.createRadialGradient(tO.l,tO.t,10,tO.l,tO.t,tO.r);
			grd.addColorStop(0,"black");
			grd.addColorStop(1,"transparent");
			bgctx.beginPath();
		    bgctx.fillStyle = grd;
			bgctx.arc(tO.l, tO.t, tO.r, 0, 2 * Math.PI, false);
			bgctx.closePath();
			bgctx.fill();
		bgctx.restore();
	};

};

function drawStartFinish() {
	bgctx.save();
		bgctx.beginPath();
		bgctx.arc(startFinish.l, startFinish.t, startFinish.r, 0, 2 * Math.PI, false);
		bgctx.strokeStyle = "#fff";
		bgctx.lineWidth = 5;
		bgctx.stroke();
		bgctx.fillStyle = ctx.createPattern(imageObj, 'repeat');
		bgctx.fill();

		bgctx.beginPath();
		bgctx.arc(startFinish.l, startFinish.t, (startFinish.r - 40), 0, 2 * Math.PI, false);
		bgctx.stroke();
		bgctx.shadowColor = "#fff";
		bgctx.shadowBlur = 200;
		bgctx.shadowOffsetX = 0;
		bgctx.shadowOffsetY = 0;
		bgctx.fillStyle = "rgb(33,40,48)";
		bgctx.fill();
		drawTextAlongArc(bgctx, 'Start / Finish', startFinish.l, startFinish.t, startFinish.r - 50, (Math.PI/4), startFinish.txtAngle, "#fff");
	bgctx.restore();
};

function drawEngineTrails() {
	ctx.shadowBlur = 60;
	for (var i=engineTrailsArray.length-1; i>=0; i--) {
		var thisTrail = engineTrailsArray[i];
		thisTrail.l += thisTrail.speedH;
		thisTrail.t += thisTrail.speedV;
		ctx.save();
        	ctx.fillStyle = thisTrail.color;
			ctx.shadowColor = thisTrail.color;
			ctx.globalAlpha = thisTrail.r;
			ctx.translate(thisTrail.l, thisTrail.t);
			ctx.rotate(thisTrail.heading);
			if (thisTrail.engine==0) ctx.translate(-6, -20);
			else ctx.translate(6, -20);
			ctx.beginPath();
			ctx.arc(0, 0, thisTrail.r, 0, Math.PI*2, false);
		    ctx.fill();
		ctx.restore();
		thisTrail.r-=0.01*delta;
		if (thisTrail.r < 0) engineTrailsArray.splice(engineTrailsArray.indexOf(thisTrail), 1);

		for (var j=0; j<currentMatch.blackholes.length; j++) {
			handleBlackhole(thisTrail, currentMatch.blackholes[j], 2);
		};
	};
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