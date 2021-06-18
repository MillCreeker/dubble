import mysql from 'mysql';

import { DATABASE_HOST } from './config.js';
import { DATABASE_USER } from './config.js';
import { DATABASE_PASSWORD } from './config.js';
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

/**
 * Get a connection out of the pool
 * @returns Promise that resolves to connection
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
 * Get a User in the database
 * @param user User
 * @returns Promise that resolves to User
 */
function getUser(user) {
    return new Promise(function (resolve, reject) {
        let condition = '';
        if(typeof user.id != 'undefined' && user.id != null && user.id != ''){
            condition = `WHERE id=${user.id}`;
        } else if (typeof user.username != 'undefined' && user.username != null && user.username != ''){
            condition = `WHERE username="${user.username}"`;
        }

        const sqlString = `
            SELECT id, username
            FROM users
            ${condition}
            LIMIT 1;
        `;
        getConnection().then(function(connection) {
            connection.query(sqlString, function (err, result, fields) {
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
 * Get all Users in the database
 * @returns Promise that resolves to User[]
 */
function getUsers() {
    return new Promise(function (resolve, reject) {

        const sqlString = `
            SELECT id, username
            FROM users;
        `;
        getConnection().then(function(connection) {
            connection.query(sqlString, function (err, result, fields) {
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
 * Get all UsersWithPassword in the database
 * @returns Promise that resolves to UserWithPassword[]
 */
function getUsersWithPassword() {
    return new Promise(function (resolve, reject) {

        const sqlString = `
            SELECT *
            FROM users;
        `;
        getConnection().then(function(connection) {
            connection.query(sqlString, function (err, result, fields) {
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
 * Get a UsersWithPassword in the database
 * @param user User
 * @returns Promise that resolves to UserWithPassword
 */
 function getUserWithPassword(user) {
    return new Promise(function (resolve, reject) {
        let hasId = false;
        let hasUsername = false;
        if(typeof user.id != 'undefined' && user.id != null && user.id != ''){
            hasId = true;
        } else if (typeof user.username != 'undefined' && user.username != null && user.username != ''){
            hasUsername = true;
        }

        let condition = '';
        if (hasId === true && hasUsername === true){
            condition = `WHERE id=${user.id} AND username="${user.username}"`;
        } else if (hasId === true){
            condition = `WHERE id=${user.id}`;
        } else if (hasUsername === true){
            condition = `WHERE username="${user.username}"`;
        }

        const sqlString = `
            SELECT *
            FROM users
            ${condition};
        `;
        getConnection().then(function(connection) {
            connection.query(sqlString, function (err, result, fields) {
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
 * Add a user to the database
 * @param user User 
 * @returns Promise that resolves to id
 */
function addUser(user) {
    return new Promise(function (resolve, reject) {
        var sqlString = `
            INSERT INTO users
            (username, password)
            VALUES (?,?);
        `;
        getConnection().then(function(connection) {
            connection.query(sqlString, [user.username, user.password], function (err, result, fields) {
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
 * Update a user in the database
 * @param user User 
 * @returns Promise that resolves to result
 */
function changeUser(user) {
    return new Promise(function (resolve, reject) {
        var sqlString = `
            UPDATE users
            SET username=?, password=?
            WHERE id=?;
        `;
        getConnection().then(function(connection) {
            connection.query(sqlString, [user.username, user.password, user.id], function (err, result, fields) {
                connection.release();
                if (err) {
                    reject(err)
                } else {
                    resolve(result);
                }
            });
        }).catch(function(error) {
            reject(error);
        });
    });
};

/**
 * Deletes a user from the database.
 * @param id id of the user
 * @returns Promise that resolves to result
 */
function deleteUser(id) {
    return new Promise(function (resolve, reject) {
        var sqlString = `
            DELETE FROM users
            WHERE id=?;
        `;
        getConnection().then(function(connection) {
            connection.query(sqlString, [id], function (err, result, fields) {
                connection.release();
                if (err) {
                    reject(err)
                } else {
                    resolve(result);
                }
            });
        }).catch(function(error) {
            reject(error);
        });
    });
};


/**
 * Gets a TextItem from the database
 * @param textItem TextItem
 * @returns Promise that resolves to TextItem[]
 */
function getTextItem(textItem) {
    return new Promise(function (resolve, reject) {
        let hasId = false;
        let hasUserId = false;
        if(typeof textItem.id != 'undefined' && textItem.id != null && textItem.id != ''){
            hasId = true;
        } else if (typeof textItem.userId != 'undefined' && textItem.userId != null && textItem.userId != ''){
            hasUserId = true;
        }

        let condition = '';
        if (hasId === true && hasUserId === true){
            condition = `WHERE id=${textItem.id} AND user_id="${textItem.userId}"`;
        } else if (hasId === true){
            condition = `WHERE id=${textItem.id}`;
        } else if (hasUserId === true){
            condition = `WHERE user_id="${textItem.userId}"`;
        }

        const sqlString = `
            SELECT *
            FROM text_items
            ${condition};
        `;
        getConnection().then(function(connection) {
            connection.query(sqlString, function (err, result, fields) {
                connection.release();
                if (err) {
                    reject(err)
                } else {
                    resolve(result);
                }
            });
        }).catch(function(error) {
            reject(error);
        });
    });
};

/**
 * Get all TextItems in the database
 * @returns Promise that resolves to TextItem[]
 */
function getTextItems() {
    return new Promise(function (resolve, reject) {
        const sqlString = `
            SELECT *
            FROM text_items;
        `;
        getConnection().then(function(connection) {
            connection.query(sqlString, function (err, result, fields) {
                connection.release();
                if (err) {
                    reject(err)
                } else {
                    resolve(result);
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
 * @returns Promise that resolves to id
 */
function addTextItem(textItem) {
    return new Promise(function (resolve, reject) {
        var sqlString = `
            INSERT INTO
            text_items
            (text, user_id) VALUES (?,?);
        `;
        getConnection().then(function(connection) {
            connection.query(sqlString, [textItem.text, textItem.userId], function (err, result, fields) {
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
 * Changes a TextItem in the database
 * @param textItem TextItem 
 * @returns Promise that resolves to id
 */
function changeTextItem(textItem) {
    return new Promise(function (resolve, reject) {
        const sqlString = `
            UPDATE text_items
            SET text=?
            WHERE user_id=?;
        `;
        getConnection().then(function(connection) {
            connection.query(sqlString, [textItem.text, textItem.userId, textItem.id], function (err, result, fields) {
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
 * Deletes a TextItem from the database
 * @param id id of TextItem
 * @returns Promise that resolves to id
 */
function deleteTextItem(id) {
    return new Promise(function (resolve, reject) {
        var sqlString = `
            DELETE FROM text_items
            WHERE user_id=?;
        `;
        getConnection().then(function(connection) {
            connection.query(sqlString, [id], function (err, result, fields) {
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
    getUser: getUser,
    getUsers: getUsers,
    getUsersWithPassword: getUsersWithPassword,
    getUserWithPassword: getUserWithPassword,
    addUser: addUser,
    changeUser: changeUser,
    deleteUser: deleteUser,
    getTextItem: getTextItem,
    getTextItems: getTextItems,
    addTextItem: addTextItem,
    changeTextItem: changeTextItem,
    deleteTextItem: deleteTextItem
}

export { DBConnection };