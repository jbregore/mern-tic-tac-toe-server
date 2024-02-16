import { body } from "express-validator";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";

export const signupValidator = () => {
  return [
    body("first_name")
      .notEmpty()
      .withMessage("First name is required")
      .isLength({
        min: 2,
        max: 20,
      })
      .withMessage("First name must be between 2 and 20 characters long"),
    body("last_name")
      .notEmpty()
      .withMessage("Last name is required")
      .isLength({
        min: 2,
        max: 20,
      })
      .withMessage("Last name must be between 2 and 20 characters long"),
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .custom(async (value) => {
        const existingUser = await User.findOne({ username: value });
        if (existingUser) {
          return Promise.reject("Username already exists");
        }
      })
      .isLength({
        min: 3,
        max: 15,
      })
      .withMessage("Username must be between 3 and 15 characters long"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({
        min: 3,
        max: 15,
      })
      .withMessage("Password must be between 3 and 15 characters long"),
    body("confirm_password")
      .notEmpty()
      .withMessage("Confirm password is required")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          return Promise.reject("Passwords do not match");
        }
        return true;
      }),
  ];
};

export const signinValidator = () => {
  return [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

export const updateProfileValidator = () => {
  return [
    body("first_name")
      .notEmpty()
      .withMessage("First name is required")
      .isLength({
        min: 2,
        max: 20,
      })
      .withMessage("First name must be between 2 and 20 characters long"),
    body("last_name")
      .notEmpty()
      .withMessage("Last name is required")
      .isLength({
        min: 2,
        max: 20,
      })
      .withMessage("Last name must be between 2 and 20 characters long"),
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .custom(async (value, { req }) => {
        const existingUser = await User.findOne({
          username: value,
          _id: { $ne: req.userId },
        });
        if (existingUser) {
          return Promise.reject("Username already exists");
        }
      })
      .isLength({
        min: 3,
        max: 15,
      })
      .withMessage("Username must be between 3 and 15 characters long"),
  ];
};

export const updatePasswordValidator = () => {
  return [
    body("old_password")
      .notEmpty()
      .withMessage("Old password is required")
      .custom(async (value, { req }) => {
        const userId = req.userId;

        const user = await User.findById(userId);

        const isPasswordValid = await bcrypt.compare(value, user.password);
        if (!isPasswordValid) {
          return Promise.reject("Old password is incorrect");
        }
      }),
    body("new_password")
      .notEmpty()
      .withMessage("New password is required")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
    body("confirm_password")
      .notEmpty()
      .withMessage("Confirm password is required")
      .custom((value, { req }) => {
        if (value !== req.body.new_password) {
          return Promise.reject("Passwords do not match");
        }
        return true;
      }),
  ];
};
