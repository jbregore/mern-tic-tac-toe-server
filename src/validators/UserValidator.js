import { body } from "express-validator";
import { User } from "../models/User.js";

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
      .custom(async value => {
        const existingUser = await User.findOne({ username: value });
        if (existingUser) {
          return Promise.reject("Username already exists");
        }
      })
      .isLength({
        min: 3,
        max: 10,
      })
      .withMessage("Username must be between 3 and 10 characters long"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({
        min: 3,
        max: 10,
      })
      .withMessage("Password must be between 3 and 10 characters long"),
  ];
};

export const signinValidator = () => {
  return [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};
