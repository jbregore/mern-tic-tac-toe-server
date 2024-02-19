import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import { index } from "../controllers/RankController.js";

const router = express.Router();

router.get("/", verifyToken, index);

export default router;
