import mysql from 'mysql';

import { DATABASE_HOST } from '../util/config.js';
import { DATABASE_USER } from '../util/config.js';
import { DATABASE_PASSWORD } from '../util/config.js';


var con = mysql.createConnection({
  host: DATABASE_HOST,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  multipleStatements: true
});

con.on('error', function() {
  con.destroy();
  console.log('an error occured');
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var query = con.query("CREATE DATABASE IF NOT EXISTS dubble;", function (err, result) {
    if (err) throw err;
    console.log("Database created");
    con.destroy();
    createTables();
  });
});

function createTables() {
  const sql_string = `
  CREATE TABLE IF NOT EXISTS users (
    id int NOT NULL AUTO_INCREMENT,
    username varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT UNIQ_username UNIQUE (username)
  );

  CREATE TABLE IF NOT EXISTS text_items (
    id int NOT NULL AUTO_INCREMENT,
    text longtext NULL,
    user_id int NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id int NOT NULL,
    user_id int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  `;
  var con = mysql.createConnection({
    host: DATABASE_HOST,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: 'dubble',
    multipleStatements: true
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(sql_string, function (err, result) {
      if (err) throw err;
      console.log("Tables created");
      con.destroy();
    });
  });
}
