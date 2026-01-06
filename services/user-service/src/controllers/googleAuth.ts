import {OAuth2Client} from "google-auth-library"
import dotenv from "dotenv"
import  { type Request, type Response } from "express"
import path from "path";
import { fileURLToPath } from "url";
import { UserModel } from "../models/user.model.js";
import { createToken } from "../utils/createToken.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID){
    throw new Error("no google client id in env")
}
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
if (!GOOGLE_CLIENT_SECRET) {
  throw new Error("no google client secret in env");
}


const client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:3002/api/auth/google/callback"
);

export const googleAuth=()=>async (req:Request, res:Response) => {
  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
    prompt: "consent",
  });

  res.redirect(url);
}

export const googleAuthCallback=()=>async (req:Request, res:Response) => {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).send("Missing code");
  }

  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token!,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.email || !payload.email_verified) {
    return res.status(401).send("Invalid Google account");
  }
  const email= payload.email
  const googleId= payload.sub

  let user=await UserModel.findOne({email})
  if (!user) {
    const data: {
      googleId: string;
      email: string;
      authProvider: "google";
    } = {
      googleId,
      email,
      authProvider: "google",
    };

    user= await UserModel.create(data)
  }
  const token= createToken(email)
  console.log("token",token)
  console.log("user",user)
  res.cookie("auth", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  res.redirect("http://localhost:5173/")
}
