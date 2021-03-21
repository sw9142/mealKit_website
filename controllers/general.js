const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync("B4c0//", salt);
const router = express.Router();
const menuList = require("../models/menuList");

/*

Name: Sewon Choi Student ID: 123717209 Course: NDD
GitHub Repository: https://github.com/sw9142/mealKit_website 
Heroku URL: https://comfortmeal.herokuapp.com/
*/

mongoose.connect(
  "mongodb+srv://schoi123:schoi123@myseneca.ca@web322cluster.v5jww.mongodb.net/mealkit322?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);

router.get("/", (req, res) => {
  res.render("general/home", {
    menuLunch: menuList.topMealListLunch(),
    menuDinner: menuList.topMealListDinner(),
  });
});

router.get("/menu", (req, res) => {
  res.render("general/menu", {
    menu: menuList.topMealListLunch(),
    category_cm: menuList.classicMeals("Classic Meals")[0].category,
    category_km: menuList.classicMeals("Kid-Friendly Meals")[0].category,
    classicMeals: menuList.classicMeals("Classic Meals"),
    kidMeals: menuList.classicMeals("Kid-Friendly Meals"),
  });
});

router.get("/welcome", (req, res) => {
  res.render("general/welcome");
});

router.get("/reg", (req, res) => {
  res.render("general/registration");
});

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_APIKEY);

const Schema = mongoose.Schema;
const registSchema = new Schema({
  fname: String,
  lname: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
});

const registModel = mongoose.model("registModel", registSchema);

router.post("/reg", (req, res) => {
  let isValidated = true;
  let messageValidation = {};
  let regEpx_email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g; // retrieved from https://regexr.com/3e48o
  let regEpx_password = /^(?=.{6,12}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?\W).*$/g; //https://riptutorial.com/regex/example/18996/a-password-containing-at-least-1-uppercase--1-lowercase--1-digit--1-special-character-and-have-a-length-of-at-least-of-10

  const { fname, lname, email, password } = req.body;

  if (typeof fname !== "string" || fname.length === 0) {
    isValidated = false;
    messageValidation.fname = "Please enter your first name :)";
  } else if (typeof lname !== "string" || lname.length === 0) {
    isValidated = false;
    messageValidation.lname = "Please enter your last name :)";
  } else if (email.length === 0) {
    isValidated = false;
    messageValidation.email = "Please enter your email :)";
  } else if (password.length === 0) {
    isValidated = false;
    messageValidation.password = "Please enter the password";
  } else if (fname.length <= 2) {
    isValidated = false;
    messageValidation.fname = "Please let us know your full first name :)";
  } else if (lname.length <= 2) {
    isValidated = false;
    messageValidation.lname = "Please let us know your full last name :)";
  } else if (!regEpx_email.test(email)) {
    isValidated = false;
    messageValidation.email = "Please enter your email correctly";
  } else if (!regEpx_password.test(password)) {
    isValidated = false;
    messageValidation.password =
      "Password must be between 6 to 12 characters and contains at least one lowercase letter, uppercase letter, number and symbol.";
  }

  if (isValidated) {
    var newRegist = new registModel({
      fname: fname,
      lname: lname,
      email: email,
      password: password,
    });

    newRegist.save((err) => {
      if (err) {
        console.log("Couldn't create the new name:" + err);
      } else {
        console.log(
          "Successfully created a new name: " +
            newRegist.fname +
            " " +
            newRegist.lname
        );
      }
      res.redirect("/welcome");
    });

    // const megMail = {
    //   to: email,
    //   from: "schoi123@myseneca.ca",
    //   subject: `Welcome ${fname}! :) `,
    //   html: ` Hey I am Sewon Choi! nice to meet you! <br>
    //     Welcome to join ComfortMeal :)  <br>
    //    Vistor's Full Name: ${fname} ${lname}<br>
    //       Vistor's Email Address: ${email}<br>`,
    // };
    // sgMail
    //   .send(megMail)
    //   .then(() => {
    //     res.send("Success");
    //   })
    //   .catch((err) => {
    //     console.log(`Error ${err}`);
    //     res.send("Error");
    //   });
  } else {
    res.render("general/registration", {
      value: req.body,
      messageValidation: messageValidation,
    });
  }
});

router.get("/login", (req, res) => {
  res.render("general/login");
});

router.post("/login", (req, res) => {
  let isValidated = true;
  let messageValidation = {};

  const { email, password } = req.body;

  if (email.length === 0) {
    isValidated = false;
    messageValidation.email = "Please enter a valid email address";
  } else if (password.length === 0) {
    isValidated = false;
    messageValidation.password = "Please enter your password";
  }

  if (isValidated) {
    let authenticated = false;
    let messageValidation = {};
    registModel
      .findOne({ email: email, password: password })
      .exec()
      .then((data) => {
        if (!data) {
          console.log("no account for " + email);
          messageValidation.login =
            "Sorry, you entered an invalid email and/or password";
          res.render("general/login", {
            value: req.body,
            messageValidation: messageValidation,
          });
        } else {
          console.log("we have found the account for " + email);
          res.render("general/welcome");
        }
      });
  } else {
    res.render("general/login", {
      value: req.body,
      messageValidation: messageValidation,
    });
  }
});

module.exports = router;
