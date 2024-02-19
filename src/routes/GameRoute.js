import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import { index, store } from "../controllers/GameController.js";

const router = express.Router();

router.get("/", verifyToken, index);

router.post("/", verifyToken, store);

export default router;
