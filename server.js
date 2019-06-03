const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const ClientManager = require('./src/server/ClientManager');

const port = 80;
const router = express.Router();

app.use(express.static(`${__dirname}/dist/`));
app.use('/api', router);

io.on('connection', (socket) => {
  console.log('A client has connected id =', socket.id);
  // Connect client to lobby. Must be manually requested by client
  ClientManager.addClient(socket);
});

http.listen(port);
