function init() {
  	var canvas = document.getElementById('canvas');
  	var debugging = document.getElementById('debugging');
	var ctx = canvas.getContext("2d");

	var players = [];

	var player = new player();
	var opponents = [];


	var trackBlocks = [];
	var keys = [];

	var turnRate = 0.1;
	var turnRateDecel = 0.08;
	var accelRate = 0.1

	var friction = 0.995;

	var socket = io.connect();

	socket.on('connect_error', function (err) {
    	console.log('error', err);
    });
    socket.on('connect', function () {
    	console.log('connected');
    });

	socket.emit('connectMe', player);

	socket.on('playerPositions', displayOpponents);

	function displayOpponents(r) {
		for (var i=0; i<r.length;i++) {
			if (r[i].guid==player.guid) {
				r.splice(i,1);
				break;
			};
		};
		opponents = r;
	};


	canvas.width = window.innerWidth - 50;
	canvas.height = window.innerHeight - 50;

	$(document).keydown(function(e) {
	  	var tK = e.which;
	  	if (tK>= 37 && tK <= 40) keys[e.which]=true;
	});

	$(document).keyup(function(e) {
	  	var tK = e.which;
	  	if (tK>= 37 && tK <= 40) keys[e.which]=false;
	});

	function player() {
		this.l = (Math.random()*200)+50;
		this.t = (Math.random()*200)+50;
		this.speedH = 0;
		this.speedV = 0;
		this.heading = 0; 					// angle
		this.yaw = 0;

		this.guid = getNewGuid();
		this.name = "Ark";

		player.color = "rgb(255,255,255)";
	};

	function block(left, right, top, bottom) {
		this.l=left;
		this.t=top;
		this.r=right;
		this.b=bottom;
		this.active=false;
		this.color = "rgb(40,40,40)";
		//this.color = "rgb(" + Math.floor(Math.random()*100) + "," + Math.floor(Math.random()*100) + "," + Math.floor(Math.random()*100) + ")";
	};

	function fireAccelerationThrusters() {
		ctx.fillStyle="#0000FF";
		ctx.beginPath();
	    ctx.moveTo(-4,-10);
	    ctx.lineTo(-7,-20);
	    ctx.lineTo(-10,-10);
	    ctx.lineTo(10,-10);
	    ctx.lineTo(7,-20);
	    ctx.lineTo(4,-10);
		ctx.closePath();
	    ctx.fill();
	};

	function fireManeuveringThrusters(dir) {
		ctx.fillStyle="#0000FF";
		ctx.beginPath();
		if (dir) {
		    ctx.moveTo(10,-10);
		    ctx.lineTo(14,-8);
		    ctx.lineTo(10,-6);
		    ctx.lineTo(10,-10);
		    ctx.lineTo(-10,10);
		    ctx.lineTo(-14,8);
		    ctx.lineTo(-10,6);
		    ctx.lineTo(-10,10);
		} else {
		    ctx.moveTo(-10,-10);
		    ctx.lineTo(-14,-8);
		    ctx.lineTo(-10,-6);
		    ctx.lineTo(-10,-10);
		    ctx.lineTo(10,10);
		    ctx.lineTo(14,8);
		    ctx.lineTo(10,6);
		    ctx.lineTo(10,10);
		};
		ctx.closePath();
	    ctx.fill();
	}

	function verticalCollision(pl, tr) {
		return (
	        ((pl-24) < tr.t) ||
	        ((pl+4) > tr.b)
	    );
	};
	function horizontalCollision(pl, tr) {
		return (
	        ((pl-24) < tr.l) ||
	        ((pl+4) > tr.r)
	    );
	};

	//players.push(new player((Math.random()*200), (Math.random()*200)));

	trackBlocks.push(new block(0,canvas.width,0,canvas.height));

	function reset() {
	};

	var updatePlayer = function (player, deltaT) {

		if (keys[37]) player.yaw -= turnRate;
		if (keys[39]) player.yaw += turnRate;
		if (!keys[37] && player.yaw<0) player.yaw += turnRateDecel;
		if (!keys[39] && player.yaw>0) player.yaw -= turnRateDecel;
		if (keys[38]) {
			player.speedV += Math.cos(player.heading * Math.PI / 180) * accelRate * deltaT;
			player.speedH -= Math.sin(player.heading * Math.PI / 180) * accelRate * deltaT;
		};
		player.heading += player.yaw * deltaT;
		player.speedV = player.speedV*friction;
		player.speedH = player.speedH*friction;

		for (var i=0; i < trackBlocks.length; i++) {
			if (verticalCollision((player.t + player.speedV), trackBlocks[i])) {
				player.speedV = player.speedV*-0.3;
				player.speedH = player.speedH*0.3;
				player.yaw = (player.heading%45)*player.speedH/10;
			} else {
				player.t = player.t + player.speedV;
			};
			if (horizontalCollision((player.l + player.speedH), trackBlocks[i])) {
				player.speedV = player.speedV*0.3;
				player.speedH = player.speedH*-0.3;
				player.yaw = (player.heading%45)*player.speedV/10;
			} else {
				player.l = player.l + player.speedH;
			};
		};
	};

	var render = function () {
		ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );

		for (var i=0; i<trackBlocks.length;i++) {
	        ctx.fillStyle = trackBlocks[i].color;
      		ctx.lineWidth = 2;
	        ctx.strokeStyle = (trackBlocks[i].active)?"rgb(175,175,175)":"rgb(100,100,100)";
	        ctx.fillRect(trackBlocks[i].l, trackBlocks[i].t, trackBlocks[i].r-trackBlocks[i].l, trackBlocks[i].b-trackBlocks[i].t);
    		ctx.strokeRect(trackBlocks[i].l, trackBlocks[i].t, trackBlocks[i].r-trackBlocks[i].l, trackBlocks[i].b-trackBlocks[i].t);
		};

        ctx.fillStyle = player.color;

        ctx.save();
		ctx.translate(player.l-10, player.t-10);
		ctx.rotate(player.heading*Math.PI/180);
		ctx.strokeRect(-10, -10, 20, 20);
		ctx.strokeRect(-5, 0, 10, 10);


		if (keys[38]) {
			fireAccelerationThrusters();
		};
		if (keys[37] || keys[39]) {
			fireManeuveringThrusters(keys[37]);
		};
		ctx.restore();

		for (var j=0;j<opponents.length;j++) {
	        ctx.fillStyle = opponents[j].color;

	        ctx.save();
			ctx.translate(opponents[j].l-10, opponents[j].t-10);
			ctx.rotate(opponents[j].heading*Math.PI/180);
    		ctx.strokeRect(-10, -10, 20, 20);
    		ctx.strokeRect(-5, 0, 10, 10);
			ctx.restore();
		};
	};

	// The main game loop
	var main = function () {
		var now = Date.now();
		var delta = now - then;
		
		if (player) {
			updatePlayer(player, (delta/10));
			for (var i=0;i<opponents.length;i++) {
				updatePlayer(opponents[i], (delta/10));
			};
			render();
			socket.emit('hereIAm', player);
		};

		then = now;
		requestAnimationFrame(main);
	};

	var then = Date.now();
	main();
}

document.addEventListener("DOMContentLoaded", init, false);




function getNewGuid() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
};