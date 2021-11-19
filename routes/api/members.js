const {json} = require("express");
const express = require("express");
const router = express.Router();
const connection = require("../../db/usersDB");
const cookieParser = require("cookie-parser");

app.use(cookieParser("secret time"));

//Get all members
router.get("/", (req, res) => {
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
router.get("/:email", (req, res) => {
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
//Get single member by email
router.get(
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
router.post("/", (req, res) => {
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
	res.json(members);
	// res.redirect("/");
});

//Delete member
router.delete("/:email", (req, res) => {
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

module.exports = router;
