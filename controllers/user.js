const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const userModel = require("../models/user");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_APIKEY);

router.get("/reg", (req, res) => {
  res.render("user/registration");
});

router.post("/reg", (req, res) => {
  let isValidated = true;
  let messageValidation = {};
  let regEpx_email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g; // retrieved from https://regexr.com/3e48o
  let regEpx_password = /^(?=.{6,12}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?\W).*$/g; //https://riptutorial.com/regex/example/18996/a-password-containing-at-least-1-uppercase--1-lowercase--1-digit--1-special-character-and-have-a-length-of-at-least-of-10

  const { fname, lname, email, password, logintype } = req.body;
  console.log(req.body);
  console.log("isDataentry?: " + logintype);

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
    const user = new userModel({
      firstName: fname,
      lastName: lname,
      email: email,
      password: password,
    });
    if (logintype === "dataentry") {
      user.isDataEntry = true;
    }
    user
      .save()
      .then((userSaved) => {
        console.log(`User ${userSaved.firstName} has been saved to the db`);
      })
      .catch((err) => {
        console.log(`Error adding user to the database.  ${err}`);
      });

    const megMail = {
      to: email,
      from: "schoi123@myseneca.ca",
      subject: `Welcome ${fname}! :) `,
      html: ` Hey I am Sewon Choi! nice to meet you! <br>
        Welcome to join ComfortMeal :)  <br>
       Vistor's Full Name: ${fname} ${lname}<br>
          Vistor's Email Address: ${email}<br>`,
    };
    sgMail
      .send(megMail)
      .then(() => {
        res.send("Success");
      })
      .catch((err) => {
        console.log(`Error ${err}`);
        res.send("Error");
      });

    req.session.user = user;
    if (logintype === "dataentry") {
      res.redirect("/dataentry");
    } else {
      res.redirect("/customer");
    }
  } else {
    res.render("user/registration", {
      value: req.body,
      messageValidation: messageValidation,
    });
  }
});

router.get("/login", (req, res) => {
  res.render("user/login");
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/user/login");
});
router.post("/login", (req, res) => {
  let isValidated = true;
  let messageValidation = {};

  const { email, password, logintype } = req.body;

  if (email.length === 0) {
    isValidated = false;
    messageValidation.email = "Please enter a valid email address";
  } else if (password.length === 0) {
    isValidated = false;
    messageValidation.password = "Please enter your password";
  }

  if (isValidated) {
    let errors = [];

    userModel
      .findOne({
        email: email,
      })
      .then((user) => {
        if (user) {
          console.log("user: " + user);
          bcrypt
            .compare(password, user.password)
            .then((isMatched) => {
              if (isMatched) {
                req.session.user = user;
                console.log("req.session.user: " + req.session.user);

                if (logintype === "dataentry") {
                  console.log("dataentry you are here!");
                  res.redirect("/dataentry");
                } else {
                  res.redirect("/customer");
                }
              } else {
                errors.push(`The password is wrong.`);
                console.log("The password is wrong");
                res.render("user/login", {
                  errors,
                });
              }
            })
            .catch((err) => {
              console.log(`Error comparing passwords: ${err},`);
              errors.push("Oops, something went wrong.");
              res.render("user/login", {
                errors,
              });
            });
        } else {
          errors.push("Sorry, you entered an invalid email and/or password");
          console.log("we are not able to find email");
          res.render("user/login", {
            errors,
          });
        }
      })
      .catch((err) => {
        console.log(`Error finding the user from the database: ${err},`);
        errors.push("Oops, something went wrong.");
        res.render("user/login", {
          errors,
        });
      });
  } else {
    res.render("general/login", {
      value: req.body,
      messageValidation: messageValidation,
    });
  }
});

module.exports = router;
