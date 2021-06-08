'use strict';
// import external modules
const WebSocketServer = require('websocket').server;
const http = require('http');
const fs = require('fs')
const { htmlEntities, colors } = require('./util');

// Port where we'll run the websocket server
const { WEBSOCKET_SERVER_PORT } = require('./util/config');
// Origin
const WEBSOCKET_ORIGIN = 'dubble';

// Optional. You will see this name in e.g. 'ps' or 'top' command
process.title = 'node-websocket';

/**
 * Global variables
 */
// latest 100 messages
let history = [];
// list of currently connected clients (users)
let clients = [];

/**
 * HTTP Server as base for our WebSocket
 */
const httpServer = http.createServer((request, response) => {
  response.writeHead(200, {'Content-Type': 'text/html'});
  fs.readFile('../frontend/index.html', function(error, data) {
    if (error) {
      response.writeHead(404);
      response.write('Error: File Not Found');
    } else {
      response.write(data);
    }
    response.end();
  });
});
httpServer.listen(WEBSOCKET_SERVER_PORT, () => {
  console.log(
    `Server is up an running on http://localhost:${WEBSOCKET_SERVER_PORT}`
  );
});

/**
 * WebSocket Server
 */
const wsServer = new WebSocketServer({
  // WebSocket server is tied to a HTTP server. WebSocket request is just an enhanced HTTP request.
  // For more info http://tools.ietf.org/html/rfc6455#page-6
  httpServer,
});

// This callback function is called every time someone tries to connect to the WebSocket server
wsServer.on('request', (request) => {
  // use try/catch to not kill server on any error!
  try {
    console.log(`${new Date()}: connection from origin [${request.origin}].`);

    // accept connection - you should check 'request.origin' to make sure that client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    const connection = request.accept(WEBSOCKET_ORIGIN, request.origin);

    // we need to know the client index to remove them on 'close' event
    const index = clients.push(connection) - 1;
    let userName;
    let userColor;

    console.log(`${new Date()}: Connection accepted.`);

    // send chat history to new use
    if (history.length > 0) {
      connection.sendUTF(JSON.stringify({ type: 'history', data: history }));
    }

    connection.on('message', (messageRAW) => {
      // take care we will receive raw (plain text) message and we will need to extract json string from message body (utf8Data)
      console.log(messageRAW);

      let message = '';
      try {
        message = JSON.parse(messageRAW.utf8Data);
      } catch (error) {
        console.error('Invalid data from client:', messageRAW.utf8Data);
        return;
      }

      if (message.type === 'incoming-message') {
        // accept only 'text' in this example
        // first message sent from user is their name
        if (!userName) {
          // 'save' userName of this connection
          userName = htmlEntities(message.data);
          // get random color and send it back to the user
          userColor = colors.shift();
          connection.sendUTF(
            JSON.stringify({ type: 'color', data: userColor })
          );
          console.log(
            `${new Date()}: User nr ${index} has name '${userName}' and color '${userColor}'`
          );
        } else {
          console.log(
            `${new Date()}: received new message from user '${userName}': ${
              message.data
            }`
          );
          // we want to keep all sent messages in history
          const obj = {
            time: new Date().getTime(),
            text: htmlEntities(message.data),
            author: userName,
            color: userColor,
          };
          history.push(obj);
          history = history.slice(-100); // keep only the latest 100 messages

          // broadcast new message to all connected clients
          const json = JSON.stringify({ type: 'chat-message', data: obj });
          clients.forEach((client) => {
            client.sendUTF(json);
          });
        }
      } else {
        // send back an error information for client
        const error = JSON.stringify({
          type: 'error',
          data: 'only messages of type "incoming messages" are allowed!',
        });
        connection.sendUTF(error);
      }
    });

    // user disconnected at Event 'close'
    connection.on('close', (close) => {
      // check if user was ever correct connected
      if (userName && userColor) {
        console.log(
          `${new Date()}: Peer ${connection.remoteAddress} disconnected.`
        );

        // remove user from list of connected clients
        clients.splice(index, 1);
        // push back user's color to be reused by another user
        colors.push(userColor);
      }
    });
  } catch (error) {
    console.error(`${new Date()}: error occured:`, error);
  }
});
