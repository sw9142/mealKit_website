const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mealSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  included: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  cookingTime: {
    type: String,
    required: true,
  },
  serving: Number,
  calories: Number,
  imageURL: {
    type: String,
  },
  topMeal: Boolean,
  time: String,
});

const mealModule = mongoose.model("MealKit", mealSchema);

module.exports = mealModule;
