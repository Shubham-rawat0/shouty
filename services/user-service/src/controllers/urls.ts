import type { Request, Response } from "express";
import { z } from "zod";
import { UrlModel, UserModel } from "../models/user.model.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";
import { redis } from "../redis/redis.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const urlBody = z.object({
  url: z.string().min(1),
});

async function generateUniqueShortUrl(): Promise<string> {
  let shortUrl = "";
  let exists = true;

  while (exists) {
    const code = nanoid(7);
    shortUrl = code;
    exists = !!(await UrlModel.exists({ shortUrl }));
  }

  return shortUrl;
}

export const createUrl = async (req: Request, res: Response) => {
  try {
    const email = req.email;

    if (!email) {
      return res.status(401).json({
        message: "No email found, please login again",
      });
    }

    const urlParse = urlBody.safeParse(req.body);
    if (!urlParse.success) {
      return res.status(400).json({
        message: "Invalid or missing URL",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const shortUrl = await generateUniqueShortUrl();

    const urlDoc = await UrlModel.create({
      shortUrl,
      longUrl: urlParse.data.url,
      timesUsed: 0,
      createdBy: user._id,
    });

    await redis.set(`url:${shortUrl}`, urlParse.data.url);
    await redis.expire(`url:${shortUrl}`, 60 * 60 * 24 * 30);

    const gatewayUrl = process.env.GATEWAY_URL || "http://localhost:3000";
    const fullShortUrl = `${gatewayUrl}/get/${shortUrl}`;

    return res.status(201).json({
      longUrl: urlDoc.longUrl,
      shortUrl: fullShortUrl,
      timesUsed: urlDoc.timesUsed,
      createdAt: urlDoc.createdAt,
    });
  } catch (error) {
    console.error("error creating short url", error);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

export const resolveUrl = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({
        message: "Short URL code is required",
      });
    }

    const url = await UrlModel.findOne({ shortUrl: code }).select("longUrl");

    if (!url) {
      return res.status(404).json({
        message: "Short URL not found",
      });
    }
    await redis.set(`url:${code}`, url.longUrl);
    await redis.expire(`url:${code}`, 60 * 60 * 24 * 30);
    return res.status(200).json({
      longUrl: url.longUrl,
    });
  } catch (error) {
    console.error("Error resolving short URL", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
