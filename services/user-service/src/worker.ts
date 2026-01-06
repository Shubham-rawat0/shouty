import { UrlModel } from "./models/user.model.js";
import { redis } from "./redis/redis.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./db/connectDb.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const REDIS_QUEUE = process.env.REDIS_QUEUE ?? "increment_count";

if (!REDIS_QUEUE) {
  throw new Error("No Redis queue configured");
}


async function startWorker() {
  await connectDb()
  console.log("Worker started");
  console.log("Using Redis queue:", REDIS_QUEUE);

  while (true) {
    try {
      const job = await redis.rpop(REDIS_QUEUE);

      if (!job) {
        await new Promise((r) => setTimeout(r, 500));
        continue;
      }

      console.log("job received:", job);

      let payload;
      try {
        payload = typeof job === "string" ? JSON.parse(job) : job;
      } catch (err) {
        console.error("Invalid job payload:", job);
        continue;
      }

      if (!payload.url) {
        console.error("Invalid payload shape:", payload);
        continue;
      }

      await UrlModel.updateOne(
        { shortUrl: payload.url },
        { $inc: { timesUsed: 1 } }
      );

      console.log("incremented count for", payload.url);

     } catch (err) {
      console.error("Worker error:", err);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}


startWorker();
