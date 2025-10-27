import { fileURLToPath } from "node:url";
import path from "node:path";
import express, { type Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { runInDevelopment } from "../utils/run-guard";
import config from "../config";
import { CLIENT_DIST, WIKI_DIST } from "../paths";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  app.use(express.static(CLIENT_DIST));
  app.use(express.static(WIKI_DIST));

  app.get(/^\/(?!api|socket\.io).*/, (req, res) => {
    const host = req.hostname.toLowerCase();

    const isWiki =
      host === "wiki.localhost" ||
      host === "wiki.omnieconomy.xyz" ||
      host.startsWith("wiki.");

    const root = isWiki ? WIKI_DIST : CLIENT_DIST;
    res.sendFile(path.join(root, "index.html"));
  });
  runInDevelopment(() => {
    app.use(cors({ origin: true, credentials: true }));
  });

  return app;
}
