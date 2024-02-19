import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export const MODE = process.env.MODE;
export const PATH_ROOT = process.env.PATH_ROOT;
export const DOMAIN = process.env.DOMAIN;
export const PORT = process.env.PORT;
export const mongoDbUrl = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONBODB_PASSWORD}@${process.env.MONGODB_DATABASE}/?retryWrites=true&w=majority`;
export const jwtSecret = process.env.JWT_SECRET;
export const clientURL = process.env.CLIENT_URL;
export const socketPORT = process.env.SOCKET_PORT;
