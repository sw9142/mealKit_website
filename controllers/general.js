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

router.get("/login", (req, res) => {
  res.render("general/login");
});

module.exports = router;
