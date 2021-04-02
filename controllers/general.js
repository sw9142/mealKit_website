const express = require("express");
const router = express.Router();
const menuList = require("../models/menuList");

/*
Name: Sewon Choi Student ID: 123717209 Course: NDD
GitHub Repository: https://github.com/sw9142/mealKit_website 
Heroku URL: https://comfortmeal.herokuapp.com/
*/

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

router.get("/dataentry", (req, res) => {
  if (req.session.user.isDataEntry) {
    res.render("general/dataentry");
  } else {
    res.render("general/customer");
  }
});

router.get("/customer", (req, res) => {
  if (!req.session.user.isDataEntry) {
    res.render("general/customer");
  } else {
    res.render("general/dataentry");
  }
});

module.exports = router;
