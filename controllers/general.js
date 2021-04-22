const express = require("express");
const router = express.Router();
const path = require("path");
const menuList = require("../models/menuList");
const mealModule = require("../models/mealKit");

/*
Name: Sewon Choi Student ID: 123717209 Course: NDD
GitHub Repository: https://github.com/sw9142/mealKit_website 
Heroku URL: https://comfortmeal.herokuapp.com/
*/

router.get("/", (req, res) => {
  mealModule
    .find({})
    .exec()
    .then((data) => {
      data = data.map((value) => value.toObject());

      topDinner = [];
      topLunch = [];

      for (let i = 0; i < data.length; i++) {
        if (data[i].topMeal === true && data[i].time === "lunch") {
          topLunch.push(data[i]);
        }
      }

      for (let i = 0; i < data.length; i++) {
        if (data[i].topMeal === true && data[i].time === "dinner") {
          topDinner.push(data[i]);
        }
      }

      res.render("general/home", {
        menuLunch: topLunch,
        menuDinner: topDinner,
      });
    });
});

router.get("/menu", (req, res) => {
  mealModule
    .find({})
    .exec()
    .then((data) => {
      data = data.map((value) => value.toObject());
      allMeal = data;
      global.allMeal = allMeal;
      var classicMeals = [];
      var kidMeals = [];

      for (let i = 0; i < data.length; i++) {
        if (data[i].category === "Classic Meals") {
          classicMeals.push(data[i]);
        }
      }

      for (let i = 0; i < data.length; i++) {
        if (data[i].category === "Kid-Friendly Meals") {
          kidMeals.push(data[i]);
        }
      }

      res.render("general/menu", {
        category_cm: "classicMeals",
        category_km: "kid Meals",
        classicMeals: classicMeals,
        kidMeals: kidMeals,
        allMeals: data,
      });
    });
});

router.get("/menu_edit", (req, res) => {
  if (req.session.user && req.session.user.isDataEntry) {
    mealModule.find().count({}, (err, count) => {
      if (err) {
        return res.send(err);
      } else if (count === 0) {
        mealModule.collection.insertMany(menuList.listExport(), (err, docs) => {
          if (err) {
            return res.send(err);
          } else {
            res.redirect("general/menu_edit");
          }
        });
      } else {
        mealModule
          .find({})
          .exec()
          .then((data) => {
            data = data.map((value) => value.toObject());

            res.render("general/menu_edit", {
              msg: "Data was already loaded",
              data: data,
            });
          });
      }
    });
  } else {
    res.redirect("/menu");
  }
});
//add new meal
router.post("/menu_edit", (req, res) => {
  const {
    title,
    included,
    desc,
    category,
    price,
    cookingTime,
    serving,
    calories,
    topMeal,
    time,
  } = req.body;

  const newMeal = new mealModule({
    title: title,
    included: included,
    desc: desc,
    category: category,
    price: price,
    cookingTime: cookingTime,
    serving: serving,
    calories: calories,
    time: time,
  });
  if (topMeal === "TopMeal: true") {
    newMeal.topMeal = true;
  } else if (topMeal === "TopMeal: false") {
    newMeal.topMeal = false;
  }
  newMeal
    .save()
    .then((saved) => {
      console.log(`Meal ${saved.title} has been saved to the database.`);

      req.files.imageURL.name = `pro_pic_${saved._id}${
        path.parse(req.files.imageURL.name).ext
      }`;

      req.files.imageURL
        .mv(`static/meals/${req.files.imageURL.name}`)
        .then(() => {
          mealModule
            .updateOne(
              {
                _id: saved._id,
              },
              {
                imageURL: req.files.imageURL.name,
              }
            )
            .then(() => {
              console.log(
                "Meal document was updated with the meal pic file name."
              );
              res.redirect("/menu_edit");
            })
            .catch((err) => {
              console.log(`Error updating the user.  ${err}`);
            });
        });
    })
    .catch((err) => {
      console.log(`Error adding user to the database.  ${err}`);
    });
});

router.post("/menu_edit_update", (req, res) => {
  mealModule
    .updateOne(
      {
        title: req.body.title,
      },
      {
        $set: {
          title: req.body.title,
          included: req.body.included,
          desc: req.body.desc,
          category: req.body.category,
          price: req.body.price,
          cookingTime: req.body.cookingTime,
          serving: req.body.serving,
          calories: req.body.calories,
          topMeal: req.body.topMeal,
          time: req.body.time,
        },
      }
    )
    .exec()
    .then(() => {
      console.log("Successfully updated meal: " + req.body.title);

      res.redirect("/menu_edit");
    })
    .catch((err) => {
      console.log(`Error updating the meal.  ${err}`);
    });
});

router.post("/menu_edit_delete", (req, res) => {
  // Remove a record from the  "name" model with the data from req.body
  mealModule
    .deleteOne({
      title: req.body.title,
    })
    .exec()
    .then(() => {
      console.log("Successfully removed user: " + req.body.title);
      res.redirect("/menu_edit");
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

router.get("/desc/:id", (req, res) => {
  const id = req.params.id;

  if (id === "home.js") {
  } else {
    mealModule
      .find({ _id: id })
      .exec()
      .then((data) => {
        data = data.map((value) => value.toObject());

        res.render("general/desc", {
          data: data,
        });
      });
  }
});

module.exports = router;
