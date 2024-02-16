import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export const PORT = process.env.PORT;
export const mongoDbUrl = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONBODB_PASSWORD}@${process.env.MONGODB_DATABASE}/?retryWrites=true&w=majority`;
