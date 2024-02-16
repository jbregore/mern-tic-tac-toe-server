import express from "express";
import cors from "cors";
import { PORT } from "./src/config.js";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
