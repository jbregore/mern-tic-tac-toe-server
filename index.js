import express from "express";
import cors from "cors";
import { PORT, mongoDbUrl } from "./src/utils/config.js";
import mongoose from "mongoose";
import AuthRoute from "./src/routes/AuthRoute.js";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
io.listen(4000);

app.use(cors());
app.use(express.json());

app.use("/api/auth", AuthRoute);

mongoose
  .connect(mongoDbUrl)
  .then(() => {
    console.log("App connected to the database");

    io.on("connection", (socket) => {});

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("error : ", err);
  });
