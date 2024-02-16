import express from "express";
import {
  signin,
  signup,
  signout,
  me,
  updateProfile,
  updatePassword,
} from "../controllers/UserController.js";
import {
  signinValidator,
  signupValidator,
  updatePasswordValidator,
  updateProfileValidator,
} from "../validators/UserValidator.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", signupValidator(), signup);

router.post("/signin", signinValidator(), signin);

router.get("/me", verifyToken, me);

router.put("/profile", verifyToken, updateProfileValidator(), updateProfile);

router.put(
  "/update-password",
  verifyToken,
  updatePasswordValidator(),
  updatePassword
);

router.delete("/signout", verifyToken, signout);

export default router;
