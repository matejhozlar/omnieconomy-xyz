import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const CLIENT_DIST =
  process.env.NODE_ENV === "production"
    ? path.join(__dirname, "..", "client")
    : path.join(__dirname, "..", "..", "frontend", "apps", "client", "dist");

export const WIKI_DIST =
  process.env.NODE_ENV === "production"
    ? path.join(__dirname, "..", "wiki")
    : path.join(__dirname, "..", "..", "frontend", "apps", "wiki", "dist");
