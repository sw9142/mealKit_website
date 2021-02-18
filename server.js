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

const generalControllers = require("./controllers/general");

app.use("/", generalControllers);

const HTTP_PORT = process.env.PORT || 8080;

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
