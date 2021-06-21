'use strict';
window.WebSocket = window.WebSocket || window.MozWebSocket;

/**
 * Check if websocket is available
 */
if (!window.WebSocket) {
  appendWarning(`Sorry, but your browser doesn't support WebSocket!`);
  throw new Error('no Websocket support available');
} else {
}


//make function that is called immidiatly after client.js has loaded
(function () {
  //Button for sending messages
  const sendBtn = document.querySelector('#send')
  //text that is dispalyed in the html
  const message = document.querySelector('#message')
  //Box in wich the message is contained
  const messageBox = document.querySelector('#messageBox')


  /**
   *Function for showing the messages that are sent.
   *
   * @param content contains the message that is sent
   */
  function showMessage(content) {
    message.textContent = `${content}`;
    message.scrollTop = message.scrollHeight;
    messageBox.value = '';
  }

  //initial function that sets the inital values of the websocket functions
  function init() {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close;
    }
  }

  let ws;
  //WebSocket at ws://localhost:8081
  ws = new WebSocket(
    `ws://${window.location.host}`,
    'dubble'
  );

  //Message that the connection is open now
  ws.onopen = function () {
    console.log("Connection open")
  };

  //sends the data to showMessage so that the data can be displayed
  ws.onmessage = ({data}) => showMessage(data);
  ws.onclose = function () {
    ws = null;
  }

  //send the value of the messageBox and then shows it
  if(sendBtn){
    sendBtn.onclick = function () {
      //login();
      if (!ws) {
        showMessage("No WebSocket connection:")
        return;
      }
      ws.send(messageBox.value);
      showMessage(messageBox.value);
    }
  }

  //setup the function
  init();
})();