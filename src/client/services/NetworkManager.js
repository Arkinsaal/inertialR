import io from 'socket.io-client';

const baseUrl = 'http://localhost';


// socket IO to send keystrokes to server. respond with movement?
// is anti-cheat even required at this stage?

// =======================================================================================================
// WebRTC ~4 players together
// cheat detection can be added later by tracking inputs and sending chunks to server for checking?
// =======================================================================================================

class NetworkManager {
  socket = null;
  listeners = {};

  constructor(game) {
    this.game = game;
  }

  connect(userId) {
    this.socket = io(`${baseUrl}?userId=${userId}`);
  }

  disconnect() {
    this.socket.close();
  }

  listen = (event, action) => {
    if (!this.socket) return;

    this.socket.on(event, action);
  }

  send = (event, body, callback) => {
    return new Promise(() => {
      this.socket.emit(event, body, (response, errors) => {
        if (errors) throw new Error(errors);

        if (callback) callback(response);
      });
    });
  }
}

export default new NetworkManager();
