import type { Request, Response } from "express";
import { redis } from "../redis/redis.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const DEPLOY_DOMAIN = process.env.DEPLOY_DOMAIN || "http://localhost:3002";

if (!DEPLOY_DOMAIN) {
  throw new Error("no domain in env");
}

const REDIS_QUEUE = process.env.REDIS_QUEUE;

if (!REDIS_QUEUE) {
  throw new Error("no queue in env");
}

export const getLongUrl = async (req: Request, res: Response) => {
  try {
    const { url } = req.params;

    if (!url) {
      return res.status(400).json({ message: "Short url is required" });
    }
    console.log("url", url);
    const cachedLongUrl = (await redis.get(`url:${url}`)) as string;

    if (cachedLongUrl) {
      console.log("in cached");
      await redis.lpush(
        REDIS_QUEUE,
        JSON.stringify({
          url,
          timestamp: Date.now(),
        })
      );
      console.log("pushed to queue");
      return res.redirect(302, cachedLongUrl);
    }
    console.log("resolving");
    const response = await fetch(`${DEPLOY_DOMAIN}/user/resolve/${url}`);

    if (!response.ok) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    const data = await response.json();
    const longUrl = data.longUrl;
    await redis.lpush(
      REDIS_QUEUE,
      JSON.stringify({
        url,
        timestamp: Date.now(),
      })
    );
    return res.redirect(302, longUrl);
  } catch (error) {
    console.error("Error resolving redirect", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
