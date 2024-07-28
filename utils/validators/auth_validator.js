const slugify = require('slugify');
const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

exports.signupValidator = [
  check('userName')
    .notEmpty()
    .withMessage('User required')
    .isLength({ min: 3 })
    .withMessage('Too short User name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("phone")
    .notEmpty()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number only accepted Egy Phone numbers")
    .custom((val) =>
      User.findOne({ phone: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("phone already in user"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  validatorMiddleware,
];

exports.loginValidator = [
  check("phone")
    .notEmpty()
    .withMessage("Phone required")
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number only accepted Egy Phone numbers"),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  validatorMiddleware,
];
