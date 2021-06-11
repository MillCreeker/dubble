import mysql from 'mysql';

import { DATABASE_HOST } from '../util/config.js';
import { DATABASE_USER } from '../util/config.js';
import { DATABASE_PASSWORD } from '../util/config.js';
import { User } from '../models/User.js';
import { UserWithPassword } from '../models/UserWithPassword.js';
import { TextItem } from '../models/TextItem.js';
import { Session } from '../models/Session.js';

export class DBConnection {
    constructor() {
        this._con = mysql.createConnection({
            host: DATABASE_HOST,
            user: DATABASE_USER,
            password: DATABASE_PASSWORD,
            database: 'dubble',
            multipleStatements: true
        });
    }
    getTextItems() {
        this._con.connect(function(err) {
            if (err) throw err;
            var sql_string = `
                SELECT * FROM text_items;
            `
            con.query(sql_string, function (err, result, fields) {
              if (err) throw err;
              var itemList = [];
              result.forEach(element => {
                  itemList.push(new TextItem(element.id, element.text, element.user_id))
              });
              return itemList;
            });
        });
    }
    getUsers() {
        this._con.connect(function(err) {
            if (err) throw err;
            var sql_string = `
                SELECT * FROM users;
            `
            con.query(sql_string, function (err, result, fields) {
              if (err) throw err;
              var itemList = [];
              result.forEach(element => {
                  itemList.push(new UserWithPassword(element.id, element.username, element.password))
              });
              return itemList;
            });
        });
    }
    getUsersWithoutPassword() {
        this._con.connect(function(err) {
            if (err) throw err;
            var sql_string = `
                SELECT id, username FROM users;
            `
            con.query(sql_string, function (err, result, fields) {
              if (err) throw err;
              var itemList = [];
              result.forEach(element => {
                  itemList.push(new User(element.id, element.username))
              });
              return itemList;
            });
        });
    }
    getSessions() {
        this._con.connect(function(err) {
            if (err) throw err;
            var sql_string = `
                SELECT * FROM sessions;
            `
            con.query(sql_string, function (err, result, fields) {
              if (err) throw err;
              var itemList = [];
              result.forEach(element => {
                  itemList.push(new Session(element.id, element.user_id))
              });
              return itemList;
            });
        });
    }
    addUser(user) {
        this._con.connect(function(err) {
            if (err) throw err;
            var sql_string = `
                INSERT INTO users (username, password) VALUES (?,?);
            `
            con.query(sql_string, [user.username, user.password], function (err, result, fields) {
              if (err) throw err;
            });
        });
    }
    addSession(session) {
        this._con.connect(function(err) {
            if (err) throw err;
            var sql_string = `
                INSERT INTO sessions (id, user_id) VALUES (?,?);
            `
            con.query(sql_string, [session.id, session.user_id], function (err, result, fields) {
              if (err) throw err;
            });
        });
    }
    addTextItem(text_item) {
        this._con.connect(function(err) {
            if (err) throw err;
            var sql_string = `
                INSERT INTO text_items (text, user_id) VALUES (?,?,?);
            `
            con.query(sql_string, [text_item.text, text_item.user_id], function (err, result, fields) {
              if (err) throw err;
            });
        });
    }
    close() {
        this._con.destroy();
    }
}