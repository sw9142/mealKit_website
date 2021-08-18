const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const fileUpload = require("express-fileupload");
dotenv.config({ path: "./config/keys.env" });
const app = express();

app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", ".hbs");

// Set up express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use(express.static("./static/"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(fileUpload());

mongoose.connect(process.env.MONGOOSE_APIKEY, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const generalControllers = require("./controllers/general");
const userControllers = require("./controllers/user");

app.use("/", generalControllers);
app.use("/user", userControllers);

const HTTP_PORT = process.env.PORT;

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(HTTP_PORT, onHttpStart);
