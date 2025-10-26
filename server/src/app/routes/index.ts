import type { Express } from "express";

import DownloadRoutes from "./stats/downloads.routes";

export default function registerRoutes(app: Express): void {
  app.use("/api", DownloadRoutes);
}
