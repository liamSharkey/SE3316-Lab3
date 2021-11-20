const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const app = express();
const router = express.Router();
const uuid = require("uuid");

let currentUser = {
	userName: "",
	email: "",
	password: "",
	role: ""
};
let errorMessage = {
	error: false,
	message: ""
};

let allMeetings = [];

//handlebars middleware
var hbs = exphbs.create({
	helpers: {
		sayHello: function () {
			alert("Hello World");
		},
		getStringifiedJson: function (value) {
			return JSON.stringify(value);
		}
	},
	defaultLayout: "main",
	partialsDir: ["views/partials/"]
});

app.set("view engine", "handlebars");
app.engine("handlebars", hbs.engine);

//body parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//homepage route
app.get("/", (req, res) => {
	res.render("index", {
		title: "Home",
		errorMessage
	});
	errorMessage = {
		error: false,
		message: ""
	};
});

//user's meetings tab route
app.get("/myMeetings", (req, res, next) => {
	connection.query("SELECT * FROM Meeting", (error, rows, fields) => {
		allMeetings = [];
		for (r of rows) {
			allMeetings.push({
				date: r.Date,
				times: JSON.parse(r.times),
				id: r.id
			});
		}
	});

	if (currentUser.userName !== "") {
		res.render("myMeetings", {
			title: "My Meetings",
			currentUser,
			allMeetings
		});
	} else {
		errorMessage.message = "You must be signed in to view meetings";
		res.redirect("/");
	}
});

//set static folder
app.use(express.static(path.join(__dirname, "public")));

// Members api routes
// app.use("/api/members", require("./routes/api/members"));

const PORT = process.env.PORT || 80;

app.listen(PORT, () => console.log("Server started on port " + PORT));

//############################################################################################################

const connection = require("./db/usersDB");
const e = require("express");

//Get all members
app.get("/getMembers", (req, res) => {
	connection.query("SELECT * FROM Person", (error, rows, fields) => {
		let memberList = [];
		for (r of rows) {
			memberList.push({
				username: r.userName,
				password: r.password,
				email: r.email,
				role: r.role
			});
		}
		res.json(memberList);
	});
});

//Get current user
app.get("/getCurrentUser", (req, res) => {
	res.status(200).json({msg: `current user is ${currentUser}`});
});

//Sign Out
app.get("/signOut", (req, res) => {
	console.log("signout button pressed");
	if (currentUser.userName !== "") {
		console.log("signing out");
		currentUser = {
			userName: "",
			email: "",
			password: "",
			role: ""
		};
		res.redirect("/");
	} else {
		console.log("cannot sign out");
		errorMessage.error = true;
		errorMessage.message = "No user signed in";
		res.redirect("/");
	}
});

//login
app.get("/:login", (req, res) => {
	connection.query(
		`SELECT * FROM Person WHERE email LIKE "${req.query.email.replace(
			"%40",
			"@"
		)}"`,
		(error, rows, fields) => {
			let memberList = [];
			for (r of rows) {
				memberList.push({
					userName: r.userName,
					password: r.password,
					email: r.email,
					role: r.role
				});
			}
			if (
				memberList.length == 0 ||
				req.query.password !== memberList[0].password
			) {
				errorMessage.message = "Username or Password is incorrect";
				res.redirect("/");
			} else {
				currentUser = memberList[0];
				console.log(currentUser);
				res.redirect("/myMeetings");
			}
		}
	);
});

//Create member
app.post("/signUp", (req, res) => {
	const newMember = {
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		role: req.body.role
	};

	if (!newMember.name || !newMember.email || !newMember.password) {
		errorMessage = {
			error: false,
			message: "Please include a name, email, and password"
		};
		res.redirect("/");
	} else {
		connection.query(
			`insert into Person values ("${newMember.name}", "${newMember.password}", "${newMember.email}", "${newMember.role}")`,
			(error, rows, fields) => {
				console.log(error);
			}
		);

		//determines route after creating member
		errorMessage = {
			error: false,
			message: "Account created succesfully! Log in to continue"
		};
		res.redirect("/");
	}
});

//Delete member
app.delete("/:email", (req, res) => {
	connection.query(
		`DELETE FROM Person WHERE email LIKE "${req.query.email.replace(
			"%40",
			"@"
		)}"`,
		(error, rows, fields) => {
			console.log(error);
			res.status(200).json({msg: "member deleted"});
		}
	);
});

//Meetings page#######################################
app.post("/myMeetings/create", (req, res) => {
	const newMeeting = {
		date: "12/25/2021",
		times:
			'["1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00", "9:00", "10:00"]',
		id: uuid.v4()
	};

	connection.query(
		`INSERT INTO Meeting VALUES ("${newMeeting.date}", '${newMeeting.times}', "${newMeeting.id}")`,
		(error, rows, fields) => {
			console.log(error);
		}
	);
	res.redirect("/myMeetings");
});

// //Delete all meetings
// app.delete("/myMeetings/delete", (req, res) => {
// 	connection.query(`DELETE * FROM meeting`, (error, rows, fields) => {
// 		console.log(error);
// 		res.status(200).json({msg: "meeting deleted"});
// 	});
// });

//get all meetings
app.get("/myMeetings/getMeetings", (req, res) => {
	connection.query("SELECT * FROM Meeting", (error, rows, fields) => {
		console.log("getting all meetings");
		res.status(200).json(rows);
		for (r of rows) {
			allMeetings.push({
				date: r.date,
				times: r.times,
				id: r.id
			});
		}
		// res.status(200).json(allMeetings);
	});
});
