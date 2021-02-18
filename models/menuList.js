const mealList = [
  {
    title: "Meat ball",
    included: "meat ball tomato garlic whatever..",
    desc:
      "Gingery pork, crunchy cucumbers and toasty peanuts make for a classic culinary",
    category: "Classic Meals",
    price: "$10.99",
    cookingTime: "30min",
    serving: "2",
    calories: "1000",
    imageURL: "/meals/meatballs.jpg",
    topMeal: true,
  },
  {
    title: "Avocado&Egg Sandwich",
    included: "meat ball tomato garlic whatever..",
    desc: "Fresh avocado & smashed egg",
    category: "Classic Meals",
    price: "$8.99",
    cookingTime: "10min",
    serving: "2",
    calories: "890",
    imageURL: "/meals/avocadoeggsandwich.jpg",
    topMeal: true,
  },
  {
    title: "Homemade Whole Wheat Pasta",
    included: "meat ball tomato garlic whatever..",
    desc: "With feta cheese and cherry tomato",
    category: "Classic Meals",
    price: "$12.99",
    cookingTime: "20min",
    serving: "2",
    calories: "900",
    imageURL: "/meals/pasta.jpg",
    topMeal: true,
  },
  {
    title: "The Classic Burger",
    included:
      "Beef patty, lettuce, tomato, pickles, onions, ketchup, mustard, and mayo.",
    desc: "High quality beef medium to well with cheese on a multigrain bun",
    category: "Classic Meals",
    price: "$19.99",
    cookingTime: "30min",
    serving: "2",
    calories: "1200",
    imageURL: "/meals/burger.jpg",
    topMeal: true,
  },
  {
    title: "New York Strip Steak",
    included:
      "2 (12-ounce) lean, grass-fed New York strip steaks,olive oil,  garlic cloves, crushed, butter",
    desc:
      "High quality new york strip steak with deep fried crisp french fries",
    category: "Classic Meals",
    price: "$39.99",
    cookingTime: "30min",
    serving: "2",
    calories: "1100",
    imageURL: "/meals/steak.jpg",
    topMeal: true,
  },
  {
    title: "Garden Salad Bowl",
    included:
      "Beef patty, lettuce, tomato, pickles, onions, ketchup, mustard, and mayo.",
    desc: "High quality beef medium to well with cheese on a multigrain bun",
    category: "Classic Meals",
    price: "$12.99",
    cookingTime: "10min",
    serving: "1",
    calories: "500",
    imageURL: "/meals/bowl.jpg",
    topMeal: false,
  },
  {
    title: "The Classic Burger",
    included:
      "Beef patty, lettuce, tomato, pickles, onions, ketchup, mustard, and mayo.",
    desc: "High quality beef medium to well with cheese on a multigrain bun",
    category: "Kid-Friendly Meals",
    price: "$19.99",
    cookingTime: "30min",
    serving: "2",
    calories: "1200",
    imageURL: "/meals/burger.jpg",
    topMeal: false,
  },
  {
    title: "Green Crunch Roll",
    included:
      "rice, avocado, carrot, seaweed, vinegar, sesame seed, chili powder",
    desc: "Kid favourit ",
    category: "Kid-Friendly Meals",
    price: "$13.59",
    cookingTime: "20min",
    serving: "2",
    calories: "700",
    imageURL: "/meals/sushi.jpg",
    topMeal: false,
  },
  {
    title: "English Apple Pie",
    included: "fresh apples, green apples, cinnamon, lemon, flour",
    desc: "Kid favourit ",
    category: "Kid-Friendly Meals",
    price: "$13.59",
    cookingTime: "20min",
    serving: "2",
    calories: "700",
    imageURL: "/meals/applePie.jpg",
    topMeal: false,
  },
  {
    title: "Salmon Teriyaki",
    included: "Alaska salmon, soy sauce, Teriyaki sauce, spinach, carrot",
    desc: "kid will love this salmon full of omega 3 fatty acids ",
    category: "Kid-Friendly Meals",
    price: "$20.59",
    cookingTime: "40min",
    serving: "2",
    calories: "800",
    imageURL: "/meals/salmon.jpg",
    topMeal: false,
  },
  {
    title: "Grilled Lemon Chicken",
    included: "Chicken, lemon, garlic, soysauce, ",
    desc: "kid will love this salmon full of omega 3 fatty acids ",
    category: "Kid-Friendly Meals",
    price: "$20.59",
    cookingTime: "40min",
    serving: "2",
    calories: "800",
    imageURL: "/meals/chicken.jpg",
    topMeal: false,
  },
  {
    title: "Roast Pumpkin, Spinach and Seeds Salad ",
    included:
      "pine nuts,  baby spinach leaves, pumpkin, Salt and pepper, Honey Balsamic ",
    desc:
      "Try this Roast Pumpkin, Spinach and Nuts with Honey Balsamic Dressing for your next Sunday lunch! ",
    category: "Kid-Friendly Meals",
    price: "$18.59",
    cookingTime: "15min",
    serving: "2",
    calories: "700",
    imageURL: "/meals/pumpkin.jpg",
    topMeal: false,
  },
];

module.exports.getCategory = function () {
  return mealList[0].category;
};

module.exports.classicMeals = function (string) {
  var classicMeals = [];
  for (var i = 0; i < mealList.length; i++) {
    if (mealList[i].category === string) {
      classicMeals.push(mealList[i]);
    }
  }
  return classicMeals;
};

module.exports.topMealList = function () {
  var topMeals = [];

  for (var i = 0; i < mealList.length; i++) {
    if (mealList[i].topMeal) {
      topMeals.push(mealList[i]);
    }
  }
  return topMeals;
};
