import type { Request, Response } from "express";
import { z } from "zod";
import { UrlModel, UserModel } from "../models/user.model.js";
import { comparePassword, hashPass } from "../utils/hashingPass.js";
import { createToken } from "../utils/createToken.js";

const userSignupBody = z.object({
  email: z.string(),
  password: z.string().min(8),
});

const userSigninBody = z.object({
  email: z.string(),
  password: z.string().min(8),
});

export const Signup = async (req: Request, res: Response) => {
  try {
    const parsedBody = userSignupBody.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(404).json({ message: "input not provided properly" });
    }
    const checkUser = await UserModel.findOne({ email: parsedBody.data.email });
    if (checkUser) {
      return res.json({ message: "user already exists" });
    }
    const hashedPass = await hashPass(parsedBody.data.password);
    const user = await UserModel.create({
      email: parsedBody.data.email,
      password: hashedPass,
      authProvider: "local",
    });
    const token = createToken(parsedBody.data.email);

    res.cookie("auth", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });

    return res.status(200).json({ message: "user created", token: token });
  } catch (error) {
    console.log("error while signup", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const Signin = async (req: Request, res: Response) => {
  try {
    const parsedBody = userSigninBody.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(401).json({ message: "input not provided properly" });
    }
    const checkUser = await UserModel.findOne({ email: parsedBody.data.email });
    if (!checkUser) {
      return res
        .status(401)
        .json({ message: "user don't exists or wrong email" });
    }
    if (!checkUser.password) {
      return res.status(401).json({ message: "user sign up using google" });
    }

    const verify = comparePassword(
      parsedBody.data.password,
      checkUser.password
    );

    if (!verify) {
      return res.status(401).json({ message: "wrong password" });
    }

    const token = createToken(parsedBody.data.email);

    res.cookie("auth", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });

    return res.status(200).json({ message: "user logged in", token: token });
  } catch (error) {
    console.log("error while signup", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const email = req.email;

    if (!email) {
      return res
        .status(404)
        .json({ message: "No email provided, please login again" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const urls = await UrlModel.find({ createdBy: user._id });

    const gatewayUrl = process.env.GATEWAY_URL || "http://localhost:3000";

    const data = {
      email: user.email,
      authProvider: user.authProvider,
      createdOn: user.createdAt,
      urlsByUser: urls.length
        ? urls.map((u) => ({
            shortUrl: `${gatewayUrl}/get/${u.shortUrl}`,
            longUrl: u.longUrl,
            timesUsed: u.timesUsed,
            createdAt: u.createdAt,
          }))
        : [],
    };

    return res.status(200).json(data);
  } catch (error) {
    console.error("error while fetching user details", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const Logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("auth", {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("error while logout", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};
