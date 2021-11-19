const mysql = require("mysql");
const {connect} = require("../routes/api/members");

const connection = mysql.createConnection({
	host: "34.72.242.74",
	user: "root",
	password: "SE3316mysqlDBinstance",
	database: "usersDB"
});

module.exports = connection;

class DB {
	static connection = mysql.createConnection({
		host: "34.72.242.74",
		user: "root",
		password: "SE3316mysqlDBinstance",
		database: "usersDB"
	});

	//delete Single User by email
	static deleteSingleMemberByEmail(email) {
		connection.query(
			`DELETE FROM Person WHERE email LIKE "${email}"`,
			(error, rows, fields) => {
				console.log(error);
			}
		);
	}
}
