/** 
 * Module for basic database operations inside the dubble database.
 */
import mysql from 'mysql';

import { DATABASE_HOST } from './config.js';
import { DATABASE_USER } from './config.js';
import { DATABASE_PASSWORD } from './config.js';
import { User } from '../models/User.js';
import { UserWithPassword } from '../models/UserWithPassword.js';
import { TextItem } from '../models/TextItem.js';

// create a connection pool to reuse connections
const connectionPool = mysql.createPool({
    host: DATABASE_HOST,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: 'dubble',
    multipleStatements: true
});

/**
 * Get a connection out of the pool
 * @returns connection
 */
function getConnection() {
    return new Promise(function(resolve, reject) {
      connectionPool
        .getConnection(function(err, connection) {
            if (err) reject(err);
            resolve(connection);
        });
    });
};

/**
 * Get all TextItems in the database
 * @returns TextItem[]
 */
function getTextItems() {
    return new Promise(function (resolve, reject) {
        var sql_string = `
            SELECT * FROM text_items;
        `
        getConnection().then(function(connection) {
            connection.query(sql_string, function (err, result, fields) {
                connection.release();
                if (err) {
                    reject(err);
                } else {
                    var itemList = [];
                    result.forEach(element => {
                        itemList.push(new TextItem(element.id, element.text, element.user_id))
                    });
                    resolve(itemList);
                }
            }).catch(function(error) {
                reject(error);
            });
        });
    });
};

/**
 * Get all UsersWithPassword in the database
 * @returns UserWithPassword[]
 */
function getUsersWithPassword() {
    return new Promise(function (resolve, reject) {
        var sql_string = `
            SELECT * FROM users;
        `
        getConnection().then(function(connection) {
            connection.query(sql_string, function (err, result, fields) {
                connection.release();
                if (err) {
                    reject(err);
                } else {
                    var itemList = [];
                    result.forEach(element => {
                        itemList.push(new UserWithPassword(element.id, element.username, element.password))
                    });
                    resolve(itemList);
                }
            });
        }).catch(function(error) {
            console.log('error is here');
            reject(error);
        });
    });
};

/**
 * Get all Users in the database
 * @returns User[]
 */
function getUsers() {
    return new Promise(function (resolve, reject) {
        var sql_string = `
            SELECT id, username FROM users;
        `
        getConnection().then(function(connection) {
            connection.query(sql_string, function (err, result, fields) {
                connection.release();
                if (err) {
                    reject(err)
                } else {
                    var itemList = [];
                    result.forEach(element => {
                        itemList.push(new User(element.id, element.username))
                    });
                    resolve(itemList);
                }
            });
        }).catch(function(error) {
            reject(error);
        });
    });
};

/**
 * Add a User to the database.
 * @param User user 
 * @returns id
 */
function addUser(user) {
    return new Promise(function (resolve, reject) {
        var sql_string = `
            INSERT INTO users (username, password) VALUES (?,?);
        `
        getConnection().then(function(connection) {
            connection.query(sql_string, [user.username, user.password], function (err, result, fields) {
                connection.release();
                if (err) {
                    reject(err)
                } else {
                    resolve(result.insertId);
                }
            });
        }).catch(function(error) {
            reject(error);
        });
    });
};

/**
 * Add a TextItem to the database.
 * @param TextItem text item 
 * @returns id
 */
function addTextItem(text_item) {
    return new Promise(function (resolve, reject) {
        var sql_string = `
            INSERT INTO text_items (text, user_id) VALUES (?,?);
        `
        getConnection().then(function(connection) {
            connection.query(sql_string, [text_item.text, text_item.user_id], function (err, result, fields) {
                connection.release();
                if (err) {
                    reject(err)
                } else {
                    resolve(result.insertId);
                }
            });
        }).catch(function(error) {
            reject(error);
        });
    });
};

// export functions inside an object
const DBConnection = {
    getConnection: getConnection,
    getTextItems: getTextItems,
    getUsersWithPassword: getUsersWithPassword,
    getUsers: getUsers,
    addUser: addUser,
    addTextItem: addTextItem,
}

export { DBConnection };