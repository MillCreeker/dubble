import mysql from 'mysql';

import { DATABASE_HOST } from '../util/config.js';
import { DATABASE_USER } from '../util/config.js';
import { DATABASE_PASSWORD } from '../util/config.js';
import { User } from '../models/User.js';
import { UserWithPassword } from '../models/UserWithPassword.js';
import { TextItem } from '../models/TextItem.js';

const connectionPool = mysql.createPool({
    host: DATABASE_HOST,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: 'dubble',
    multipleStatements: true
});

function getConnection() {
    return new Promise(function(resolve, reject) {
      connectionPool
        .getConnection(function(err, connection) {
            if (err) reject(err);
            resolve(connection);
        });
    });
};

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

function addTextItem(text_item) {
    return new Promise(function (resolve, reject) {
        var sql_string = `
            INSERT INTO text_items (text, user_id) VALUES (?,?,?);
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

const DBConnection = {
    getConnection: getConnection,
    getTextItems: getTextItems,
    getUsersWithPassword: getUsersWithPassword,
    getUsers: getUsers,
    addUser: addUser,
    addTextItem: addTextItem,
}

export { DBConnection };