const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ noServer: true });
const server = http.createServer();

let serverVersion = ''; // Server version variable

// Load server version from JSON file when server starts
loadServerVersion();

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);

    if (data.type === 'joinServer') {
      const { username } = data;
      ws.username = username;
      sendToServer({
        type: 'userJoined',
        username: username
      });
    } else if (data.type === 'message') {
      sendToServer({
        type: 'message',
        username: ws.username,
        message: data.message
      });
    } else if (data.type === 'leaveServer') {
      sendToServer({
        type: 'userLeft',
        username: ws.username
      });
    } else if (data.type === 'getServerVersion') {
      ws.send(serverVersion);
    }
  });

  ws.on('close', function close() {
    sendToServer({
      type: 'userLeft',
      username: ws.username
    });
  });
});

function sendToServer(message) {
  wss.clients.forEach(client => {
    client.send(JSON.stringify(message));
  });
}

function loadServerVersion() {
  try {
    const versionData = fs.readFileSync('serverVersion.json', 'utf8');
    const versionObj = JSON.parse(versionData);
    serverVersion = versionObj.version; // Set server version from JSON file
  } catch (error) {
    console.error('Failed to load server version:', error);
  }
}

function saveServerVersion(version) {
  const versionObj = { version: version };
  const versionData = JSON.stringify(versionObj);
  fs.writeFileSync('serverVersion.json', versionData, 'utf8');
}

// Create server version file if it doesn't exist
if (!fs.existsSync('serverVersion.json')) {
  saveServerVersion('1.0.0'); // Set your desired initial server version
}

server.listen(8000, () => {
  console.log('Websocket server listening on port 8000');
});
