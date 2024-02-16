import express from "express";
import {
  signin,
  signup,
  signout,
  me,
  updateProfile,
} from "../controllers/UserController.js";
import {
  signinValidator,
  signupValidator,
  updateProfileValidator,
} from "../validators/UserValidator.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", signupValidator(), signup);

router.post("/signin", signinValidator(), signin);

router.get("/me", verifyToken, me);

router.put("/profile", verifyToken, updateProfileValidator(), updateProfile);

router.delete("/signout", verifyToken, signout);

export default router;
