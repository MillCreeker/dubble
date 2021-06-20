# dubble

## About
### Authors
- Sebastian Toporsch
- Tobias Weigl
- Jan Mühlbacher

### Description
Sharing text across devices via a websocket (for this demo locally)

## Criteria used
- Best practice (of course)
- WebSocket
- (Access to Database CRUD)
- Testing
- Authentication

## Installation/Prerequisites
### Needed dependencies
* [Nodejs](https://nodejs.org/en/)
* a [MySQL-Database](https://www.mysql.com/) instance (check [configuration](#2-Setting-up-the-database))

### 1. Installing Node dependencies
Run in terminal/cmd:
```bs
npm install
```

### 2. Setting up the database
You need a running MySQL installation in the background.
Enter your database login-information in the DATABASE parameters inside the .env file.

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

## Documentation

## Known issues

## Useful links
