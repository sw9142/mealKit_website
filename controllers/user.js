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

    user
      .save()
      .then((userSaved) => {
        console.log(`User ${userSaved.firstName} has been saved to the db`);
      })
      .catch((err) => {
        console.log(`Error adding user to the database.  ${err}`);
        res.redirect("user/registration");
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

    res.redirect("/welcome");
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
          bcrypt
            .compare(password, user.password)
            .then((isMatched) => {
              if (isMatched) {
                if (logintype === "dataentry") {
                  userModel
                    .updateOne(
                      { email: req.body.email },
                      { $set: { isDataEntry: true } }
                    )
                    .exec()
                    .then(() => {
                      req.session.user = user;
                      req.session.user.isDataEntry = true;

                      res.redirect("/dataentry");
                    });
                } else {
                  userModel
                    .updateOne(
                      { email: req.body.email },
                      { $set: { isDataEntry: true } }
                    )
                    .exec()
                    .then(() => {
                      req.session.user = user;
                      req.session.user.isDataEntry = false;
                      res.redirect("/customer");
                    });
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

const VIEW_NAME = "user/shoppingcart.hbs";

const prepareViewModel = function (req, message) {
  if (req.session && req.session.user) {
    var cart = req.session.cart || [];
    var cartTotal = 0;

    const hasMeals = Array.isArray(cart) && cart.length > 0;
    if (hasMeals) {
      cart.forEach((item) => {
        cartTotal += parseFloat(item.menus.price.slice(1)) * item.qty;
      });
    }

    return {
      hasMeals: hasMeals,
      menus: req.session.cart,
      cartTotal: "$" + cartTotal.toFixed(2),
      message: message,
    };
  } else {
    return {
      hasMenus: false,
      menus: [],
      cartTotal: "$0.00",
      message: message,
    };
  }
};
const findItem = function (id) {
  return allMeal.find((item) => {
    return item._id == id;
  });
};

router.get("/add_menu/:_id", (req, res) => {
  const Id = req.params._id;

  if (!req.session.user) {
    res.render(VIEW_NAME, prepareViewModel(req, "You must be logged in."));
  } else {
    var item = findItem(Id);

    var cart = (req.session.cart = req.session.cart || []);
    var message;

    if (item) {
      // Song was found in the database, now search the shopping cart.
      var found = false;

      cart.forEach((cart_item) => {
        if (cart_item.title == item.title) {
          cart_item.qty++;
          found = true;
        }
      });

      if (found) {
        message =
          "Meal was already in the cart, incremented the quantity by one.";
      } else {
        cart.push({
          title: item.title,
          qty: 1,
          menus: item,
          id: item._id,
        });

        message = "The meal added to the shopping cart.";
      }
    } else {
      message = "Sorry, that meal is not in the database.";
    }

    res.render(VIEW_NAME, prepareViewModel(req, message));
  }
});

router.get("/remove_menu/:_id", (req, res) => {
  const itemId = req.params._id;

  if (!req.session.user) {
    res.render(VIEW_NAME, prepareViewModel(req, "You must be logged in."));
  } else {
    var cart = req.session.cart || [];
    var message;

    const index = cart.findIndex((cart_item) => {
      return cart_item.id == itemId;
    });

    if (index >= 0) {
      message = `Removed ${cart[index].name} from the cart.`;

      cart.splice(index, 1);
    } else {
      message = "The meal was not found in your cart.";
    }

    res.render(VIEW_NAME, prepareViewModel(req, message));
  }
});

router.get("/check_out", (req, res) => {
  var message;
  var cartTotal = 0;
  var totalQty = 0;
  if (!req.session.user) {
    message = "You must be logged in.";
  } else if (Array.isArray(req.session.cart) && req.session.cart.length > 0) {
    const user = req.session.user;
    const cart = req.session.cart;

    const hasMeals = Array.isArray(cart) && cart.length > 0;
    if (hasMeals) {
      cart.forEach((item) => {
        cartTotal += parseFloat(item.menus.price.slice(1)) * item.qty;
        totalQty += item.qty;
      });
    }

    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_APIKEY);

    var msghtml1 = `
            Hello ${user.firstName} ${user.lastName} <br>
            Thank you for shopping with us!<br>
            <br>
          
            `;

    var msghtml2 = "Item you purchased: <br>";
    for (let i = 0; i < cart.length; i++) {
      msghtml2 += ` Items: ${cart[i].title} of ${cart[i].qty}  <br>`;
    }
    var msghtml3 = `
          
            <br>
            Total Purchase:  $${cartTotal.toFixed(2)}<br>
            <br>
            <br>
            We hope to see you again<br>
            Sewon Choi   123717209 <br>
            Copyright © Winter 2021, Sewon Choi, WEB322NDD<br>
            `;

    const htmlcontents = msghtml1 + msghtml2 + msghtml3;
    console.log(htmlcontents);
    const msg = {
      to: `${user.email}`,
      from: "schoi123@myseneca.ca",
      subject: `Your ComfortFood order of ${totalQty} items has shipped `,
      html: htmlcontents,
    };
    sgMail.send(msg).catch((err) => {
      console.log(`Error ${err}`);
      res.send("Error");
    });

    message = "Thank you for your purchase, checked out!";
    req.session.cart = [];
  } else {
    message = "You cannot check-out, there are no items in the cart.";
  }

  // Render the view using the view model.
  res.render(VIEW_NAME, prepareViewModel(req, message));
});

router.get("/shoppingcart", (req, res) => {
  res.render("user/shoppingcart", prepareViewModel(req));
});

module.exports = router;
