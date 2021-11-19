const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const app = express();
const router = express.Router();

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
app.get("/", (req, res) =>
	res.render("index", {
		title: "Home"
	})
);

//user's meetings tab route
app.get(
	"/myMeetings",
	(req, res, next) => {
		if (true) {
			next();
		} else {
			return res.sendStatus(401);
		}
	},
	(req, res, next) =>
		res.render("myMeetings", {
			title: "My Meetings"
		})
);

//set static folder
app.use(express.static(path.join(__dirname, "public")));

// Members api routes
// app.use("/api/members", require("./routes/api/members"));

const PORT = process.env.PORT || 1500;

app.listen(PORT, () => console.log("Server started on port " + PORT));

//############################################################################################################
const connection = require("./db/usersDB");
const cookieParser = require("cookie-parser");

app.use(cookieParser("secret time"));

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

//Get single member by email
app.get("/:email", (req, res) => {
	connection.query(
		`SELECT * FROM Person WHERE email LIKE "${req.query.email.replace(
			"%40",
			"@"
		)}"`,
		(error, rows, fields) => {
			let memberList = [];
			for (r of rows) {
				memberList.push({
					username: r.userName,
					password: r.password,
					email: r.email,
					role: r.role
				});
			}
			if (req.query.password === r.password) {
				res.json(memberList);
			} else {
				res.status(400).json({msg: "passwords do not match"});
			}
		}
	);
});

//login
app.get(
	"/:login",
	(req, res, next) => {
		connection.query(
			`SELECT * FROM Person WHERE email LIKE "${req.query.email.replace(
				"%40",
				"@"
			)}"`,
			(error, rows, fields) => {
				let memberList = [];
				for (r of rows) {
					memberList.push({
						username: r.userName,
						password: r.password,
						email: r.email,
						role: r.role
					});
				}
				if (req.query.password === r.password) {
					res.json(memberList);
					next();
				} else {
					res.status(400).json({msg: "passwords do not match"});
				}
			}
		);
	},
	(req, res) => {
		res.cookie("email", req.query.email.replace("%40", "@"));
		res.cookie("password", req.query.password, {signed: true});

		res.redirect("/myMeetings");
	}
);

//Create member
app.post("/signUp", (req, res) => {
	const newMember = {
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		role: req.body.role
	};

	if (!newMember.name || !newMember.email || !newMember.password) {
		return res
			.status(400)
			.json({msg: "Please include a name, password and email"});
	}

	connection.query(
		`insert into Person values ("${newMember.name}", "${newMember.password}", "${newMember.email}", "${newMember.role}")`,
		(error, rows, fields) => {
			console.log(error);
		}
	);

	//determines route after creating member
	res.redirect("/");
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
