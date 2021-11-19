const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser("secret time"));

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
app.use("/api/members", require("./routes/api/members"));

const PORT = process.env.PORT || 1500;

app.listen(PORT, () => console.log("Server started on port " + PORT));
