import express from "express";
import { signin, signup } from "../controllers/UserController.js";
import {
  signinValidator,
  signupValidator,
} from "../validators/UserValidator.js";

const router = express.Router();

router.post("/signup", signupValidator(), signup);

router.post("/signin", signinValidator(), signin);

export default router;
