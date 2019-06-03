const Game = require('./Game');

const { getNewGuid } = require('./services/helpers');

class GameManager {

  constructor() {
    this.games = {};

    this.createGame = this.createGame.bind(this);
    this.assignClientToGame = this.assignClientToGame.bind(this);
    this.removeClientFromGame = this.removeClientFromGame.bind(this);
    this.getGameList = this.getGameList.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  getGameList(data, callback) {
    callback(Object.values(this.games));
  }

  createGame(client, game) {
    const id = getNewGuid();

    console.log('Client', client.socket.id, 'is creating a new game. id =', id);

    this.games[id] = new Game(id, client, game);

    client.socket.broadcast.emit('gameAdded', this.games[id].serialize());
    client.socket.emit('joinedGame', this.games[id].serialize());
  }

  assignClientToGame(client, gameId) {
    console.log('Client', client.socket.id, 'has joined game', gameId);

    this.games[gameId].addPlayer(client);

    client.socket.join(`game_${gameId}`);
    client.socket.to(`game_${gameId}`).emit('joinedGame', client.details);
    client.socket.emit('joinedGame', this.games[gameId].serialize());
  }

  removeClientFromGame(client, gameId) {
    console.log('Client', client.socket.id, 'has left game', gameId);

    this.games[gameId].removePlayer(client);

    client.socket.leave(`game_${gameId}`);
    client.socket.to(`game_${gameId}`).emit('leftGame', client.details);
    client.socket.emit('leftGame', this.games[gameId].serialize());
  }

  startGame(client) {
    const game = Object.values(this.games).find(({ owner }) => owner === client.id);

    console.log('Starting game', game.id);

    client.socket.emit('startGame', game.serialize());
    client.socket.to(`game_${game.id}`).emit('startGame', game.serialize());
  }
}

module.exports = new GameManager();
