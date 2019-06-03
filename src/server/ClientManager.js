const GameManager = require('./GameManager');

class ClientManager {

  constructor() {
    this.clients = {};
  }

  setupClientActions(client) {
    const { socket } = client;

    // user disconnected, possibly unintentionally
    socket.on('disconnect', this.disconnectClient.bind(this, client));

    socket.on('leaveLobby', this.removeClient.bind(this, client));

    socket.on('gameList', GameManager.getGameList.bind(this));

    socket.on('createGame', GameManager.createGame.bind(this, client));
    socket.on('joinGame', GameManager.assignClientToGame.bind(this, client));
    socket.on('leaveGame', GameManager.removeClientFromGame.bind(this, client));
    socket.on('startGame', GameManager.startGame.bind(this, client));
  }

  addClient(socket) {
    console.log('Add Client');
    this.clients[socket.id] = {
      id: socket.handshake.query.userId,
      socket,
      details: {
        name: 'player',
      },
    };

    this.setupClientActions(this.clients[socket.id]);
  }

  // this is triggered when the connection to the user is lost. it may be unintentional,
  // so we should only clean up state if client is marked as ready for cleanup
  disconnectClient(client) {
    console.log('Client', client.socket.id, 'has disconnected');
    delete this.clients[client.socket.id];
  }

  // this is an intentional disconnect triggered by the client
  removeClient(client) {
    console.log('Remove Client');
    // remove client from game + lobby
    delete this.clients[client.socket.id];
  }
}

module.exports = new ClientManager();
