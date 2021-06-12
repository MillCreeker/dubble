'use strict';
// load dotenv module to read .env file
import dotenv from 'dotenv';
dotenv.config({path: './config/.env'});

const WEBSOCKET_SERVER_PORT = Number(process.env.WEBSOCKET_SERVER_PORT) || 8081;
const DATABASE_HOST = process.env.DATABASE_HOST || 'localhost';
const DATABASE_USER = process.env.DATABASE_USER || 'root';
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';
const SECRET = process.env.SECRET || 'dubble-secret-key';
const SESSION_LIFETIME = Number(process.env.SESSION_LIFETIME) || 3600000;
const SESSION_NAME = process.env.SESSION_NAME || 'dubble-session'
// set runtime environment to switch between logic, depending on environment (production, development, ...). See ../notes/model.js
const NODE_ENV = process.env.NODE_ENV || 'development';

// export configurations
export { NODE_ENV, WEBSOCKET_SERVER_PORT, DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, SECRET, SESSION_LIFETIME, SESSION_NAME };