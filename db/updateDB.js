const mysql = require("mysql");

const connection = mysql.createConnection({
	host: "34.72.242.74",
	user: "root",
	password: "SE3316mysqlDBinstance",
	database: "usersDB"
});

connection.connect();

connection.query(
	`
	alter table Person
	modify userName varchar(50)`,
	(error, rows, fields) => {
		console.log(error);
	}
);

connection.end();
