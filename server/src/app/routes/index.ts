import type { Express } from "express";
import type { Pool } from "pg";

import DownloadRoutes from "./stats/downloads.routes";
import TelemetryRoutes from "./stats/telemerty.routes";
import FeedbackRouter from "./stats/feedback.routes";

export default function registerRoutes(app: Express, db: Pool): void {
  app.use("/api", DownloadRoutes);
  app.use("/api", TelemetryRoutes(db));
  app.use("/api", FeedbackRouter(db));
}
