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
	this.l = (Math.random()*60) + 40;
	this.t = (Math.random()*60) + 40;
	this.speedH = 0;
	this.speedV = 0;
	this.heading = 0; 					// angle
	this.yaw = 0;
	this.keys = [];

	this.speedAdjust=0;

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
	this.blackholes = [
		new Blackhole(),
		new Blackhole()
	];
	this.trackBlocks = [
	];
};

function block(left, right, top, bottom) {
	this.l=left;// || (200 + (Math.random()*1000));
	this.t=top;// || (200 + (Math.random()*600));
	this.r=right;// || (this.l + 50 + (Math.random()*50));
	this.b=bottom;// || (this.t + 50 + (Math.random()*50));
	this.active=false;
	this.color = "rgb(33,40,48)";
	//this.color = "rgb(" + Math.floor(Math.random()*100) + "," + Math.floor(Math.random()*100) + "," + Math.floor(Math.random()*100) + ")";
};

function Checkpoint() {
	this.l = 200 + (Math.random()*1000);
	this.t = 200 + (Math.random()*600);
	this.r = 70;
	this.touched = false;
	this.txtAngle = Math.random()*6;
};

function EngineTrail(pos, heading, color) {
	this.l = pos[0];
	this.t = pos[1];
	this.heading = heading;
	this.speedV = (-2 + (Math.random()*4));
	this.speedH = (-2 + (Math.random()*4));
	this.engine = Math.round(Math.random()*1);
	this.r = 6;
	this.color = color;
};

function Blackhole(type, left, top, r, g) {
	this.type = type;
	this.l = left || 200 + (Math.random()*1000);
	this.t = top || 200 + (Math.random()*600);
	this.r = r || 100 + (Math.random()*50);
	this.gravity = g || 0.01;
};