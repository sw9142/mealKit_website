const express = require("express");
const router = express.Router();
const menuList = require("../models/menuList");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);
router.get("/", (req, res) => {
  res.render("general/home", {
    menu: menuList.topMealList(),
  });
});

router.get("/menu", (req, res) => {
  res.render("general/menu", {
    menu: menuList.topMealList(),
    category_cm: menuList.classicMeals("Classic Meals")[0].category,
    category_km: menuList.classicMeals("Kid-Friendly Meals")[0].category,
    classicMeals: menuList.classicMeals("Classic Meals"),
    kidMeals: menuList.classicMeals("Kid-Friendly Meals"),
  });
});

router.get("/reg", (req, res) => {
  res.render("general/registration");
});

router.post("/reg", (req, res) => {
  let isValidated = true;
  let messageValidation = {};
  let regEpx_email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g; // retrieved from https://regexr.com/3e48o
  let regEpx_password = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/; //retrieved from https://regexr.com/3bfsi
  console.log(req.body);

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
      "Password must be more than 8 characters and contain at least one uppercase and one number digit";
  }

  if (isValidated) {
    res.send("Success! :)");
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
  res.render("general/login");
});

module.exports = router;
