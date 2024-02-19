import express from "express";
import cors from "cors";
import { PORT, clientURL, mongoDbUrl, socketPORT } from "./src/utils/config.js";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { createServer } from "http";
import { socketHandler } from "./src/sockethandler/socketHandler.js";

import AuthRoute from "./src/routes/AuthRoute.js";
import GameRoute from "./src/routes/GameRoute.js";
import RankRoute from "./src/routes/RankRoute.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: clientURL,
  },
});
io.listen(socketPORT);

app.use(cors());
app.use(express.json());

app.use("/api/auth", AuthRoute);

app.use("/api/games", GameRoute);

app.use("/api/rankings", RankRoute);

mongoose
  .connect(mongoDbUrl)
  .then(() => {
    console.log("App connected to the database");

    socketHandler(io);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("error : ", err);
  });
