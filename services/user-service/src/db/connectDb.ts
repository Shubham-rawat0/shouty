import mongoose from "mongoose"
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../.env"),
});

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("no mongo uri");
}
export const connectDb=async ()=>{
    try {
        await mongoose.connect(MONGO_URI);
        console.log("db connected")
    } catch (error) {
        console.log("error while connecting to db",error)
    }
}