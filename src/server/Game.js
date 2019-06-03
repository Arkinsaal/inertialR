const { getNewGuid, getCentroid, circleCollision } = require('./services/helpers');

const validateSettings = (settings) => {
  return settings;
};

const randomPosition = (outer, inner) => ([
  -outer + Math.random() * inner,
  outer - Math.random() * inner,
][Math.round(Math.random())]);

class Game {

  constructor(id, client, settings) {
    this.id = id;
    this.owner = client.id;
    this.settings = validateSettings(settings);

    this.players = {};
    this.boundary = {};
    this.checkPoints = {};
    this.blackHoles = [];

    this.setupGame();
  }

  // generate arena details, add event listeners for connecting to the gam
  setupGame() {
    this.generateBoundary();
    this.generateBlackHoles();
    this.generateCheckPoints();
  }

  // once game is over, remove remaining clients from the game, remove game from GameManager
  cleanUpGame() {

  }

  generateBoundary() {
    this.boundary = {
      left: 0,
      top: 0,
      radius: 4000,
      effectRadius: 2000,
      elasticity: 0.001,
    };
  }

  generateBlackHoles(count = 50) {
    const blackHoles = [];

    for (let i = 0; i < count; i++) {
      const newBlackHole = {
        left: randomPosition(1000, 900),
        top: randomPosition(1000, 900),
        radius: 100,
        gravity: 0.01,
      };

      const collisionCheck = circleCollision.bind(this, newBlackHole);

      const collisions = blackHoles.filter(collisionCheck);
      const toMerge = [...collisions, newBlackHole];

      const totalGravity = toMerge.reduce((reduced, { gravity }) => (reduced + gravity), 0);
      const totalArea = toMerge.reduce((reduced, { radius }) => reduced + (Math.PI * (radius ** 2)), 0);
      const radius = Math.sqrt(totalArea / Math.PI);
      const { left, top } = getCentroid(toMerge);

      collisions.forEach((collision) => {
        const index = blackHoles.indexOf(collision);

        blackHoles.splice(index, 1);
      });

      blackHoles.push({
        left,
        top,
        radius,
        gravity: totalGravity,
      });
    }

    return blackHoles;
  }

  generateCheckPoints() {
    const { checkPointCount = 4 } = this.settings;

    for (let i = 0; i < checkPointCount; i++) {
      const id = getNewGuid();

      this.checkPoints[id] = {
        left: randomPosition(1000, 600),
        top: randomPosition(1000, 600),
        radius: 70,
      };
    }
  }

  setupGameActions(player) {
    const { socket } = player.client;

    socket.on('updatePosition', this.updatePlayerPosition.bind(this.client));
  }

  addPlayer(client) {
    this.players[client.socket.id] = {
      client,
      position: {
        top: 0,
        left: 0,
        heading: 0,
      }
    };

    this.setupGameActions(this.players[client.socket.id]);
  }

  updatePlayerPosition(client, position) {
    this.addPlayer.players[client.socket.id].position = position;
  }

  removePlayer(client) {
    delete this.players[client.socket.id];
  }

  serialize() {
    return {
      id: this.id,
      owner: this.id,
      boundary: this.boundary,
      checkPoints: this.checkPoints,
      blackHoles: this.blackHoles,
    };
  }
}

module.exports = Game;
