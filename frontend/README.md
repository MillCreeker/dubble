# WebSocket Frontend

This is the "frontend" for the WebSocket exercise. You need to run it separately with the [backend](../backend)!

When you change the set PORTS in the backend, you have also to adapt them [here](server-port.js)!

## Prerequisites
* Some sort of WebServer to provide [index.html](index.html).
  * we recommend [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension for [VS Code](https://code.visualstudio.com/) or the Built-in Server in WebStorm/IntelliJ IDEs
  * you can also use [XAMPP](https://www.apachefriends.org/index.html)
  * easy possibility to provide static files via [python](https://docs.python.org/3/library/http.server.html) (**for testing only!**): `python3 -m http.server 8000 --directory .`

## First Steps
open [index.html](index.html) in a browser (see [Prerequisites](#prerequisites)), **after** you started the [backend](../backend). The 'client' will connect automatically and you're able to send chat messages.

Beside [jquery](https://jquery.com/), we use no separate library. Modern browser provide a WebSocket client (see [window.WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)).


## Useful links

