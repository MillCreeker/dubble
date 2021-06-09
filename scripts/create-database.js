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
CREATE DATABASE IF NOT EXISTS dubble;
`;

con.on('error', function() {
  con.destroy()
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query(sql_string, function (err, result) {
    if (err) throw err;
    console.log("Database created");
    con.destroy();
  });
});
