/************************************************************************************
 * WEB322 – Assignment 2 (Winter 2021)
 * I declare that this assignment is my own work in accordance with Seneca Academic
 * Policy. No part of this assignment has been copied manually or electronically from
 * any other source (including web sites) or distributed to other students.
 *
 * Name: Sewon Choi
 * Student ID: 123717209
 * Course: WEB322 NDD
 *
 ************************************************************************************/

const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
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

app.use(express.static("./static/"));

app.use(bodyParser.urlencoded({ extended: false }));
const generalControllers = require("./controllers/general");

app.use("/", generalControllers);

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
