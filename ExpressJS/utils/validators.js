const { body } = require("express-validator/check");
const User = require("../models/user");

exports.registerValidators = [
  body("email", "Input correct e-mail")
    .isEmail()
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("User with this email exists");
        }
      } catch (err) {
        console.log(err);
      }
    })
    .normalizeEmail(),

  body("name", "Min length of name must be 3 chars")
    .isLength({ min: 3 })
    .trim(),

  body("password", "Password min length must be 6 chars")
    .isLength({ min: 5, max: 56 })
    .isAlphanumeric()
    .trim(),

  body("confirm")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords must be same");
      }
      return true;
    })
    .trim(),
];

exports.loginValidators = [
  body("email", "Input correct e-mail")
    .isEmail()
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (!user) {
          return Promise.reject("User with this email is not exists");
        }
      } catch (err) {
        console.log(err);
      }
    })
    .normalizeEmail(),

  body("password", "Password min length must be 6 chars")
    .isLength({ min: 5, max: 56 })
    .isAlphanumeric()
    .trim(),
];

exports.courseValidators = [
  body('title', 'Min length 3 symbols').isLength({min: 3}).trim(),
  body('price', 'Input correct price').isNumeric(),
  body('img', 'Input correct image url').isURL(),
]
