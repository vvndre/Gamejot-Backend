let mysql = require("mysql");

require("dotenv").config();

let connection = mysql.createPool({
  user: process.env.db_username,
  password: process.env.db_password,
  host: process.env.db_host,
  port: process.env.db_port,
  database: process.env.db_name,
});

module.exports = connection;