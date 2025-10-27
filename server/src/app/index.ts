import { fileURLToPath } from "node:url";
import path from "node:path";
import express, { type Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { runInDevelopment } from "../utils/run-guard";
import config from "../config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const reactBuildPath =
  process.env.NODE_ENV === "production"
    ? path.join(__dirname, "..", "..", "client")
    : path.join(__dirname, "..", "..", "frontend", "apps", "client", "dist");

const limiter = rateLimit({
  windowMs: config.RateLimitConfig.WINDOW_MS,
  max: config.RateLimitConfig.MAX,
});

/**
 * Initializes and configures an Express application.
 *
 * Middleware included:
 * - JSON body parsing
 * - CORS (enabled only in development)
 * - URL-encoded body parsing
 * - Cookie parsing
 * - Static file serving for the React frontend
 */
export function createApp(): Express {
  const app = express();

  app.set("trust proxy", 1);
  app.use("/api", limiter);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(express.static(reactBuildPath));

  runInDevelopment(() => {
    app.use(cors({ origin: true, credentials: true }));
  });

  return app;
}
