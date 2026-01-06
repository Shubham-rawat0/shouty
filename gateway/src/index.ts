import express from "express";
import expressProxy from "express-http-proxy";
import dotnev from "dotenv";
import cors from "cors";
dotnev.config();
const port = process.env.GATEWAY_PORT;
if (!port) {
  throw new Error("no gateway port");
}

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.options(/.*/, cors());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/user", expressProxy("http://localhost:3002"));
app.use("/get", expressProxy("http://localhost:3001"));

app.listen(port, () => {
  console.log(`gateway running on ${port}`);
});
