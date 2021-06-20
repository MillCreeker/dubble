# dubble

## About
### Authors
- Sebastian Toporsch
- Tobias Weigl
- Jan Mühlbacher

### Description
Sharing text across devices via a websocket or api. The text is only available if the user is authenticated and authorized. A user can only see his own text.

## Criteria used
- Best practice (of course)
- WebSocket
- (Access to Database CRUD)
- Testing
- Authentication

## Installation/Prerequisites
### Needed dependencies
* [Nodejs](https://nodejs.org/en/)
* a [MySQL-Database](https://www.mysql.com/) instance (check [configuration](#2-setting-up-the-database))

### 1. Installing Node dependencies
Run in terminal/cmd:
```bs
npm install
```

### 2. Setting up the database
You need a running MySQL installation in the background.
Enter your database login-information in the DATABASE parameters inside the [.env](config/.env) file.

If all requirements are satisfied, run following command in your terminal/cmd: 
```bs
npm run create-db
```

## Run/Execute
### Starting the API Server
Run in terminal/cmd:
```bs
npm setup-api
```
### Starting the Webserver
Run in terminal/cmd:
```bs
npm start
```

### Custom configuration
To create custom configurations, modify the values inside the [.env](config/.env) file.
Besides the already mentioned [database configurations](#2-setting-up-the-database), you have following options:
* **WEBSOCKET_SERVER_PORT**: Port that the webserver will run on.
* **API_PORT**: Port that the api-server will run on.
* **SESSION_LIFETIME**: Lifetime of the session in milliseconds-
* **SESSION_NAME**: Name of the session cookie.
* **SECRET**: Server secret used for encryption.

## Documentation
### Webserver
For the webserver, we used an express server. We implemented all the routes, that the user should have access to and created a frontend view with the help of the [pug](https://pugjs.org/api/getting-started.html) templating engine.

### Authenticaton and authorization
We created methods and server endpoints for the user to log in/register a new user. If someone wants to register a new user, the server checks, if there is already a user with the same username, and creates a new one if not. The password is encrypted with [bcrypt](https://www.npmjs.com/package/bcrypt). If the user wants to log in, the server first encrypts the given password and checks the database for a matching user with that password. if the requirements are met, the user gets logged in. To keep the user logged in, we used two major mechanisms. Sessions and JWT.
#### Sessions
Sessions are used by our webserver to keep the users logged in. For creating sessions and storing them, we used the packages [express-session](https://www.npmjs.com/package/express-session) and [express-mysql-session](https://www.npmjs.com/package/express-mysql-session). These packages allowed us to configure automatic session handling for our express server. After configuration, our server could create the needed database tables for storing sessions, store sessions and manage them.

#### JWT
JWT's are used by our API-server to keep the users logged in. For creating and managing JWT's we used the [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) package, which can encode and decode JWT's. The JWT is sent to the client after login, from where on he can send it as a HTTP header with his request. The header has to be named "x-access-token".

## Known issues
We have not yet implemented a refresh token, so JWT's are not very safe.

## Useful links
