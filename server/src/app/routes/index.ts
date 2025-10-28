import type { Express } from "express";
import type { Pool } from "pg";

import DownloadRoutes from "./stats/downloads.routes";
import TelemetryRoutes from "./stats/telemerty.routes";

export default function registerRoutes(app: Express, db: Pool): void {
  app.use("/api", DownloadRoutes);
  app.use("/api", TelemetryRoutes(db));
}
