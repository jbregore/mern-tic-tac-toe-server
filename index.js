import express from "express";
import cors from "cors";
import {
  DOMAIN,
  MODE,
  PATH_ROOT,
  PORT,
  clientURL,
  mongoDbUrl,
  socketPORT,
} from "./src/utils/config.js";
import mongoose from "mongoose";
import fs from "fs";
import { Server } from "socket.io";
import { createServer as httpServer } from "http";
import { createServer as httpsServer } from "https";
import { socketHandler } from "./src/sockethandler/socketHandler.js";

import AuthRoute from "./src/routes/AuthRoute.js";
import GameRoute from "./src/routes/GameRoute.js";
import RankRoute from "./src/routes/RankRoute.js";

const app = express();

let io = null;

if (MODE === "production") {
  const pathRoot = PATH_ROOT;
  const options = {
    key: fs.readFileSync(`${pathRoot}/${DOMAIN}.key`),
    cert: fs.readFileSync(`${pathRoot}/${DOMAIN}.crt`),
  };

  const server = httpsServer(options, app);

  io = new Server(server, {
    cors: {
      origin: clientURL,
    },
  });

  server.listen(socketPORT);
} else {
  const server = httpServer(app);

  io = new Server(server, {
    cors: {
      origin: clientURL,
    },
  });

  server.listen(socketPORT);
}

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
