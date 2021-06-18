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

(function () {
  const sendBtn = document.querySelector('#send')
  const messages = document.querySelector('#messages')
  const messageBox = document.querySelector('#messageBox')

  let ws;

  function showMessages(message) {
    messages.textContent += `\n\n${message}`;
    messages.scrollTop = messages.scrollHeight;
    messageBox.value = '';
  }

  function init() {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close;
    }
  }

  ws = new WebSocket(
    `ws://${window.location.host}`,
    'dubble'
  );


ws.onopen = function() {
  console.log("ok")
};

  ws.onmessage = () => showMessages(data);
  ws.onclose = function () {
    ws = null;
  }

  /*sendBtn.onclick = function () {
    if (!ws) {
      showMessages("No WebSocket connection:")
      return;
    }
    ws.send(messageBox.value);
    showMessages(messageBox.value);
  }*/


  init();
})();
