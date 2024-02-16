import express from "express";
import cors from "cors";
import { PORT, mongoDbUrl } from "./src/config.js";
import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(mongoDbUrl)
  .then(() => {
    console.log("App connected to the database");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log("error : ", err);
  });
