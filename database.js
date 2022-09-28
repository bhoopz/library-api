const mysql = require("mysql");

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "library-api",
});

conn.connect((err) => {
  if (err) throw err;

  console.log("Mysql Connected with App...");
});

module.exports = { conn };
