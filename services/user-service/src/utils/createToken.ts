import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("no jwt secret in env");
}

export const createToken = (email: string) => {
  return jwt.sign(
    { email: email },
    JWT_SECRET,
    { expiresIn: "30d" }
  );
};

