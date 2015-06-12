function resetPlayerPosSpeed(pl) {
	pl.l = (Math.random()*130) + 30;
	pl.t = (Math.random()*130) + 30;
	pl.speedH = 0;
	pl.speedV = 0;
	pl.heading = 0;
	pl.yaw = 0;
	pl.lap=1;
	pl.lapTimes = [0];
	pl.touchedCount = 0;
}

function Player(name, color) {
	this.l = (Math.random()*130) + 30;
	this.t = (Math.random()*130) + 30;
	this.speedH = 0;
	this.speedV = 0;
	this.heading = 0; 					// angle
	this.yaw = 0;
	this.keys = [];

	this.guid = getNewGuid();
	this.name = name || "freeRun";

	this.lap=1;
	this.lapTimes = [0];
	this.touchedCount = 0;

	this.color = color || "rgb(125,249,255)";
};

function Game(name, plCount, laps) {
	this.guid = null;
	this.name = name || "New Game";
	this.laps = laps || 10;
	this.started = false;
	this.countDownClock = null;
	this.players = [];
	this.requiredPlayers = plCount || 1;
	this.checkpoints = [
		new Checkpoint(),
		new Checkpoint(),
		new Checkpoint(),
		new Checkpoint()
	];
	this.inProgress = false;
	this.winner = null;
	this.startFinish = {
		l: 0,
		t: 0,
		r: 200
	};
	this.constants = {
		turnRate: 0.2,
		turnRateDecel: 0.3,
		accelRate: 0.1,
		friction: 0.995,
		degsToRads: 0.0174532925
	};
	this.obstacles = [
		new Obstacle('blackhole')
	];
};

function block(left, right, top, bottom) {
	this.l=left;
	this.t=top;
	this.r=right;
	this.b=bottom;
	this.active=false;
	this.color = "rgb(33,40,48)";
	//this.color = "rgb(" + Math.floor(Math.random()*100) + "," + Math.floor(Math.random()*100) + "," + Math.floor(Math.random()*100) + ")";
};

function Checkpoint() {
	this.l = 200 + (Math.random()*1000);
	this.t = 200 + (Math.random()*600);
	this.r = 70;
	this.touched = false;
};

function EngineTrail(pos, heading, color) {
	this.l = pos[0];
	this.t = pos[1];
	this.heading = heading;
	this.r = 4;
	this.color = color;
};

function Obstacle(type, left, top, r, g) {
	this.type = type || 'planet';
	this.l = left || 200 + (Math.random()*1000);
	this.t = top || 200 + (Math.random()*600);
	if (this.type=='blackhole') {
		this.r = r || 50 + (Math.random()*50);
		this.gravity = g || 0.05;	
	} else if (this.type=='block') {
		this.r = this.l + 50 + (Math.random()*200);
		this.b = this.t + 50 + (Math.random()*200);
	};
};