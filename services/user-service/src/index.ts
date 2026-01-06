import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import userRouter from "./route/user.rout.js";
import urlRouter from "./route/url.route.js";
import resolveRouter from "./route/resolve.route.js";
import { connectDb } from "./db/connectDb.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../.env"),
});

connectDb();

const port = process.env.USER_PORT;
if (!port) {
  throw new Error("no port for user");
}

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api", userRouter);
app.use("/url", urlRouter);
app.use("/resolve", resolveRouter);

app.listen(port, () => {
  console.log("user service running", port);
});
