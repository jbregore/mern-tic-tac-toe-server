import jwt from "jsonwebtoken";
import { jwtSecret } from "../utils/config.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);

    req.userId = user.userId;

    next();
  });
};
