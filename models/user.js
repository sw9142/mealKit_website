const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  isDataEntry: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", function (next) {
  var user = this;
  bcrypt
    .genSalt()
    .then((salt) => {
      bcrypt
        .hash(user.password, salt)
        .then((encryptedPwd) => {
          user.password = encryptedPwd;
          next();
        })
        .catch((err) => {
          console.log(`Error occured when salting. ${err}`);
        });
    })
    .catch((err) => {
      console.log(`Error occured when salting. ${err}`);
    });
});

const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;
