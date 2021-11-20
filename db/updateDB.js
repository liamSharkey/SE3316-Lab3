const mysql = require("mysql");
const uuid = require("uuid");

const connection = mysql.createConnection({
	host: "34.72.242.74",
	user: "root",
	password: "SE3316mysqlDBinstance",
	database: "usersDB"
});

let preference = "[0,0,0,0,0,0,0,0,0,0]";

connection.connect();

// connection.query(
// 	`
//             CREATE TABLE Meeting(
//                 Date varchar(20),
//                 times varchar(50),
// 				id varchar(100)
//             );`,
// 	(error, rows, fields) => {
// 		console.log(error);
// 	}
// );
// connection.query(
// 	`
//             CREATE TABLE MeetingEntry(
// 				id varchar(100),
//                 userName varchar(50),
//                 preference varchar(30)
//             );`,
// 	(error, rows, fields) => {
// 		console.log(error);
// 	}
// );

connection.query(`TRUNCATE TABLE Meeting`, (error, rows, fields) => {
	console.log(error);
});

connection.query(
	`insert into Meeting values ("11/19/2021",'["1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00", "9:00", "10:00"]', "${uuid.v4()}")`,
	(error, rows, fields) => {
		console.log(error);
	}
);

connection.end();
