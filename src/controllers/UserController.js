import { validationResult } from "express-validator";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../utils/config.js";

export const signup = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, username, password } = req.body;

    const newUser = new User({
      first_name,
      last_name,
      username,
      password,
      status: "online",
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      jwtSecret,
      { expiresIn: "24h" }
    );

    res.status(201).json({ message: "User created successfully", user, token });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signin = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    user.status = "online";
    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      jwtSecret,
      { expiresIn: "24h" }
    );

    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signout = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findByIdAndUpdate(
      userId,
      { status: "offline" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Signout successful" });
  } catch (error) {
    console.error("Error signing out:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const me = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
