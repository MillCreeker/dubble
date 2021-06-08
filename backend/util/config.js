'use strict';
// load dotenv module to read .env file
require('dotenv').config();

// set port with Environment variable "SERVER_PORT" or use 8080 as default.
const WEBSOCKET_SERVER_PORT = process.env.WEBSOCKET_SERVER_PORT || 8081;
// set runtime environment to switch between logic, depending on environment (production, development, ...). See ../notes/model.js
const NODE_ENV = process.env.NODE_ENV || 'development';

// export configurations
module.exports = { NODE_ENV, WEBSOCKET_SERVER_PORT };