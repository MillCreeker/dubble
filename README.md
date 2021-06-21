# dubble

## About

### Authors

- Tobias Weig
- Sebastian Toporsch
- Jan Mühlbacher

### Description

Sharing text across devices via a WebSocket or API. The text is only available if the user is authenticated and authorized. Users can only view their own texts.

## Fulfilled criteria

- ReST methods **16%**
  - Read single *4%*
  - Update *4%*
  - Delete *4%*
  - Create *4%*
- Access to database **8%**
  - Create *2%*
  - Read *2%*
  - Update *2%*
  - Delete *2%*
- WebSocket **12%**
  - Client (send data) *4%*
  - Client (visualize data) *4%*
  - Server (handle data) *4%*
- Testing *8%*
- Authentication *8%*
- Good practice *6%*

### Total reachable points:

<ins>**58%**</ins>

## Installation/Prerequisites

### Needed dependencies

* [Nodejs](https://nodejs.org/en/)
* a [MySQL-Database](https://www.mysql.com/) instance (check [configuration](#2-setting-up-the-database))

### 1. Installing Node dependencies

Run in terminal/cmd:

```bs
npm run install
```

### 2. Setting up the database

You need a running MySQL installation in the background.<br>
Enter your database login-information in the DATABASE parameters inside the [.env](config/.env) file.

If all requirements are satisfied, run following command in your terminal/cmd:

```bs
npm run create-db
```

## Run/Execute

### Starting the API Server

Run the API-Server

```bs
npm run api
```

### Starting the Webserver

Start the main server

```bs
npm run start
```

### Starting the Tests

First, set up the test environment:
* Windows Powershell: 
  ```bs
  $env:NODE_ENV="test"  
  ```
* Linux and macOS:
  ```bs
  export NODE_ENV=test
  ```

After setting up the test environment, [set up the database](#2-setting-up-the-database) again if it is your first time in the test environment.

If everything ist set up, run following in terminal/cmd:

```bs
npm run tests
```

To revert to the developer environment, run the environment setup commands again and replace **test** with **development**.

### Starting the Tests with node debugger

Run in terminal/cmd:

```bs
npm run debug
```

### Custom configuration

To create custom configurations, modify the values inside the [.env](config/.env) file.
Besides the already mentioned [database configurations](#2-setting-up-the-database), you have following options:

* **WEBSOCKET_SERVER_PORT**: Port that the webserver will run on.
* **API_PORT**: Port that the api-server will run on.
* **SESSION_LIFETIME**: Lifetime of the session in milliseconds
* **SESSION_NAME**: Name of the session cookie.
* **SECRET**: Server secret used for encryption.

## Documentation

### Webserver

For the webserver, we used an express server. We implemented all the routes, that the user should have access to and created a frontend view with the help of the [pug](https://pugjs.org/api/getting-started.html) templating engine.

### Authenticaton and authorization

We created methods and server endpoints for the user to log in/register. If someone wants to register a new user, the server checks, if there is already a user with the same username, and creates a new one if not. The password is encrypted with [bcrypt](https://www.npmjs.com/package/bcrypt). If the user wants to log in, the server first encrypts the given password and checks the database for a matching user with that password. If the requirements are met, the user gets logged in. To keep the user logged in, we used two major mechanisms: Sessions & JWT.

### Sessions

Sessions are used by our webserver to keep the users logged in. For creating sessions and storing them, we used the packages [express-session](https://www.npmjs.com/package/express-session) and [express-mysql-session](https://www.npmjs.com/package/express-mysql-session). These packages allowed us to configure automatic session handling for our express server. After configuration, our server could create the needed database tables for storing sessions, store sessions and manage them.

### JWT

JWT's are used by our API-server to keep the users logged in. For creating and managing JWT's we used the [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) package, which can encode and decode JWT's. The JWT is sent to the client after login, from where on he can send it as a HTTP header with his request. The header has to be named “x-access-token”.

### ReST API

The API runs on an independent server, on which it handles incoming calls, all of which begin with “/api/”. To actually be able to use one of them, the aforementioned access-token is required. To obtain a valid one, call the “login” (POST) URI with a valid username and password in the body. The API will send back a token, which is expires in 24 hours, if the user exists. <br>
Typically, this is not handled by a ReST API, but due to time-constraints, we chose to include it nonetheless. <br>
Every other call requires this access-token to be included in the key “x-access-token”-key of the header. It is not only used to check for authorization, but also to make database-queries specific to the user. In other APIs, it is often possible to access multiple rows of data, but we chose to limit access for maximum security. <br>
This means that users can only ever edit/view their own settings and texts.

#### Calls

- user *GET*
  - Returns the user’s information
- user *DELETE*
  - Permanently deletes a user from the database
- text *GET*
  - Returns the user’s text
- user/text *POST*
  - Creates the user’s text
  - Requires "content" in body
   ```json
   {
       content: "text"
   }
   ```
- user/text *PUT*
  - Updates the user’s text
  - Requires "content" in body
   ```json
   {
       content: "text"
   }
   ```
- text *DELETE*
  - Deletes the user’s text

A typical API-URI might look something like this:

```
http://localhost:8082/api/user
```

### Database

The database uses MySQL. After running it (see instructions above), it creates the tables “users” and “text_items” if they not already exist. <br>
The [db-connection.js](util/db-connection.js) establishes a connection to the database and harbors all functions to manipulate data in it. It is used by the web server and the API-server.*

### WebSocket

WebSockets allow interactive communication, work similar to UDP and has the reliability of TCP (it keeps the TCP connection alive after connection). The WebSocket is used to send data to the user and display the data. The WebSocket sends a request to the API, to get it's data. To authenticate, it sets the JWT stored in the session as a request header. In this project, we used the [ws](https://www.npmjs.com/package/ws) package for WebSockets.

### Jest

[Jest](https://jestjs.io/) is a testing framework that is very simple to use and in this project it is used in conjunction with Node. Jest is used for testing the REST API and the Server. It is used to confirm that the redirects work and that e.g login and registering works.

## Known issues

We have not yet implemented a refresh-token, so JWT's are not very safe.
For this demo, we have not implemented https, which also lowers the security.

## Useful links