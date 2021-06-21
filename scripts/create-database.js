/** 
 * Module for initially creating the dubble database with the needed tables and relations.
 */
import mysql from 'mysql';
import { DATABASE_HOST, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD } from '../util/config.js';

/** 
 * Creates a connection to the database.
 * Configure the database parameters in the .env file.
 */
var con = mysql.createConnection({
  host: DATABASE_HOST,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  multipleStatements: true
});

// log if an error occurs
con.on('error', function() {
  con.destroy();
  console.log('an error occured');
});

// connect to the database
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  // create dubble database
  var query = con.query(`CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME};`, function (err, result) {
    if (err) throw err;
    console.log("Database created");
    con.destroy();
    createTables();
  });
});

/**
 * create the basic tables and relations for the dubble database.  
 */
function createTables() {
  // sql for creating tables
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
    FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT UNIQ_user_id UNIQUE (user_id)
  );
  `;
  // create connection to the database
  var con = mysql.createConnection({
    host: DATABASE_HOST,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    multipleStatements: true
  });

  // log if an exception occurs
  con.on('error', function() {
    con.destroy();
    console.log('an error occured');
  });
  
  // connect to the database
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    // execute the sql string
    con.query(sql_string, function (err, result) {
      if (err) throw err;
      console.log("Tables created");
      con.destroy();
    });
  });
}
