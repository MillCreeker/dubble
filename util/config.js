'use strict';
// load dotenv module to read .env file
require('dotenv').config({path: './config/.env'});

const WEBSOCKET_SERVER_PORT = process.env.WEBSOCKET_SERVER_PORT || 8081;
const DATABASE_HOST = process.env.DATABASE_HOST || 'localhost';
const DATABASE_USER = process.env.DATABASE_USER || 'root';
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';
// set runtime environment to switch between logic, depending on environment (production, development, ...). See ../notes/model.js
const NODE_ENV = process.env.NODE_ENV || 'development';

// export configurations
module.exports = { NODE_ENV, WEBSOCKET_SERVER_PORT, DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD };