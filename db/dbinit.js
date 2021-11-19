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
            CREATE TABLE Person(
                userName varchar(20),
                password varchar(20),
                email varchar(20),
                role varchar(10)
            );`,
	(error, rows, fields) => {
		console.log(error);
	}
);

connection.query(
	'insert into Person values ("admin", "123", "wsharke@uwo.ca", "admin")',
	(error, rows, fields) => {
		console.log(error);
	}
);

connection.query("select * from Person", (error, rows, fields) => {
	console.log(error);
	console.log(rows);
	console.log(fields);

	for (r of rows) {
		console.log(r.userName);
		console.log(r.password);
		console.log(r.email);
		console.log(r.role);
	}
});

connection.end();
