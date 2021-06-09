'use strict';

import { SERVER_PORT } from './server-port.js';

const $content = $('#content');
const $input = $('#input');
const $status = $('#status');
const $count = $('#count');

$status.text('Connecting...');

// my color, assigned by the server
let myColor;
// my name, sent to the server after websocket is connected
let myName;

// if user is running mozilla then use it's built-in WebSocket
window.WebSocket = window.WebSocket || window.MozWebSocket;

// if browser doesn't support WebSocket, just show some notification and exit
if (!window.WebSocket) {
  $content.html(
    $('<p>', { text: "Sorry, but your browser doens't support WebSocket!" })
  );
  $input.hide();
  $status.hide();
  throw new Error('no WebSocket support available');
}

// open connection
const connection = new WebSocket(`ws://127.0.0.1:${SERVER_PORT}`, 'dubble');

// WebSocket Event 'open' and EventHandler 'onOpen'
connection.onopen = () => {
  $input.removeAttr('disabled');
  $input.val('');
  $input.attr('placeholder', 'choose name');
  $status.text('Choose name: ');
};

// WebSocket Event 'error' and EventHandler 'onError'
connection.onerror = (error) => {
  // when some error occures, respond to it
  console.error(error);
  $status.text('ERROR');
  $content.html(
    $('<p>', {
      text:
        'Sorry, but a problem occured with your connection, or the server is down',
    })
  );
};

// WebSocket Event 'message' and EventHandler 'onMessage'
// most important part - incoming messages from server
connection.onmessage = (message) => {
  /**
   * try to parse JSON message. Because we know that the server
   * always returns JSON this should work without any problem but
   * we should make sure that the massage is not chunked or
   * otherwise damaged.
   */
  let json;
  try {
    json = JSON.parse(message.data);
    console.log(json);
  } catch (error) {
    console.error('Invalid data from server:', message);
    return;
  }

  /**
   * NOTE: if you're not sure about the object structure
   * check the server source code!
   */

  switch (json.type) {
    // first response from server should contain user's color
    case 'color':
      myColor = json.data;
      $status.text(`${myName}: `).css('color', myColor);
      $input.attr("placeholder", 'input your message');
      $input.removeAttr('disabled').focus();
      break;
    // entire message history after connection
    case 'history':
      json.data.forEach((chatMsg) => {
        addMessage(
          chatMsg.author,
          chatMsg.text,
          chatMsg.color,
          new Date(chatMsg.time)
        );
      });
      break;
    // single message from server
    case 'chat-message':
      $input.removeAttr('disabled').focus();
      const chatMsg = json.data;
      addMessage(
        chatMsg.author,
        chatMsg.text,
        chatMsg.color,
        new Date(chatMsg.time)
      );
      break;
    default:
      console.warn("Hmm, doesn't look like valid data", json);
  }
};

/**
 * Send message when user press Enter key
 */
$input.keydown(function (event) {
  if (event.keyCode === 13) {
    const msg = $(this).val();
    if (!msg) {
      return;
    }

    // send message as ordinary text -> use json string, to enrich message information
    connection.send(JSON.stringify({ type: 'incoming-message', data: msg }));
    $(this).val('');
    $(this).attr('disabled', 'disabled');

    // we know that the first message has to be the users name
    if (!myName) {
      myName = msg;
    }
  }
});

function addMessage(author, msg, color, timestamp) {
  const self = author === myName ? ' self' : '';
  $content.prepend(`<p class="chat-message ${self}"><span class="chat-name" style="color: ${color};">
  ${author}</span> @ [${formattedTimeStamp(timestamp)}] : ${msg}</p>`);
}

function formattedTimeStamp(date) {
  function lpad(num, size = 2, pad = '0') {
    return `${num}`.length >= size
      ? `${num}`
      : new Array(size - `${num}`.length + 1).join(pad) + `${num}`;
  }
  return `${lpad(date.getHours())}:${lpad(date.getMinutes())}`;
}
