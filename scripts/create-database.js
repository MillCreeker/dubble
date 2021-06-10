var mysql = require('mysql');

const { DATABASE_HOST } = require('../util/config');
const { DATABASE_USER } = require('../util/config');
const { DATABASE_PASSWORD } = require('../util/config');

var con = mysql.createConnection({
  host: DATABASE_HOST,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  multipleStatements: true
});

const sql_string = `
CREATE TABLE IF NOT EXISTS users (
  id int NOT NULL AUTO_INCREMENT,
  username varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS text_item (
  id int NOT NULL AUTO_INCREMENT,
  text longtext NULL,
  user_id int NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id)
)
`;

con.on('error', function() {
  con.destroy()
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE IF NOT EXISTS dubble", function (err, result) {
    if (err) throw err;
    console.log("Database created");
    con.destroy();
  });
});
con.destroy();
con = mysql.createConnection({
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
con.destroy();
