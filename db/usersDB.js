const mysql = require("mysql");

const connection = mysql.createConnection({
	host: "34.72.242.74",
	user: "root",
	password: "SE3316mysqlDBinstance",
	database: "usersDB"
});

module.exports = connection;
