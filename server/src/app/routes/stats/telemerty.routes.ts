import { Router, type Request, type Response } from "express";
import type { Pool } from "pg";
import logger from "../../../logger";

const router = Router();

interface TelemetryRequest {
  serverId: string;
  modVersion: string;
  minecraftVersion?: string;
  type: "registration" | "heartbeat";
  timestamp?: number;
}

interface ServerStats {
  totalServers: number;
  activeToday: number;
  activeThisWeek: number;
  versionBreakdown: Record<string, number>;
  timestamp: number;
}

/**
 * POST /api/telemetry
 * Receives server telemetry data (registration and heartbeat)
 */
export default function createTelemetryRoutes(db: Pool) {
  router.post("/telemetry", async (req: Request, res: Response) => {
    try {
      const { serverId, modVersion, minecraftVersion, type } =
        req.body as TelemetryRequest;

      if (!serverId || !modVersion || !type) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const now = new Date();

      if (type === "registration") {
        const existingServer = await db.query(
          "SELECT * FROM servers WHERE server_id = $1",
          [serverId]
        );

        if (existingServer.rows.length === 0) {
          await db.query(
            `INSERT INTO servers (server_id, mod_version, minecraft_version, first_seen, last_seen, heartbeat_count)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [serverId, modVersion, minecraftVersion, now, now, 0]
          );

          logger.info(`New server registered: ${serverId} (v${modVersion})`);
        } else {
          await db.query(
            `UPDATE servers 
             SET mod_version = $1, minecraft_version = $2, last_seen = $3
             WHERE server_id = $4`,
            [modVersion, minecraftVersion, now, serverId]
          );
        }
      } else if (type === "heartbeat") {
        const existingServer = await db.query(
          "SELECT * FROM servers WHERE server_id = $1",
          [serverId]
        );

        if (existingServer.rows.length > 0) {
          await db.query(
            `UPDATE servers 
             SET last_seen = $1, heartbeat_count = heartbeat_count + 1, mod_version = $2
             WHERE server_id = $3`,
            [now, modVersion, serverId]
          );
        } else {
          await db.query(
            `INSERT INTO servers (server_id, mod_version, minecraft_version, first_seen, last_seen, heartbeat_count)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [serverId, modVersion, minecraftVersion, now, now, 1]
          );
        }
      }

      logger.info("Received Registration/Hearthbeat from:", serverId);
      res.status(200).json({ success: true });
    } catch (error) {
      logger.error("Error processing telemetry:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * GET /api/telemetry/stats
   * Returns server statistics
   */
  router.get("/telemetry/stats", async (req: Request, res: Response) => {
    try {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const activeTodayResult = await db.query(
        "SELECT COUNT(*) as count FROM servers WHERE last_seen >= $1",
        [oneDayAgo]
      );

      const activeThisWeekResult = await db.query(
        "SELECT COUNT(*) as count FROM servers WHERE last_seen >= $1",
        [oneWeekAgo]
      );

      const totalServersResult = await db.query(
        "SELECT COUNT(*) as count FROM servers"
      );

      const versionBreakdownResult = await db.query(
        "SELECT mod_version, COUNT(*) as count FROM servers GROUP BY mod_version"
      );

      const versionCounts: Record<string, number> = {};
      versionBreakdownResult.rows.forEach((row: any) => {
        versionCounts[row.mod_version] = parseInt(row.count);
      });

      const stats: ServerStats = {
        totalServers: parseInt(totalServersResult.rows[0].count),
        activeToday: parseInt(activeTodayResult.rows[0].count),
        activeThisWeek: parseInt(activeThisWeekResult.rows[0].count),
        versionBreakdown: versionCounts,
        timestamp: Date.now(),
      };

      res.json(stats);
    } catch (error) {
      logger.error("Error fetching telemetry stats:", error);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  /**
   * GET /api/telemetry/health
   * Health check endpoint
   */
  router.get("/telemetry/health", async (req: Request, res: Response) => {
    try {
      const result = await db.query("SELECT COUNT(*) as count FROM servers");
      const serverCount = parseInt(result.rows[0].count);

      res.json({
        status: "ok",
        servers: serverCount,
      });
    } catch (error) {
      logger.error("Error in telemetry health check:", error);
      res.status(500).json({ status: "error", message: "Health check failed" });
    }
  });

  /**
   * GET /api/telemetry/badge
   * Returns an SVG badge showing server count
   */
  router.get("/telemetry/badge", async (req: Request, res: Response) => {
    try {
      const result = await db.query("SELECT COUNT(*) as count FROM servers");
      const serverCount = parseInt(result.rows[0].count);

      const label = "Servers";
      const value = serverCount.toString();
      const color = "#22c55e";

      const labelWidth = label.length * 6 + 10;
      const valueWidth = value.length * 7 + 10;
      const totalWidth = labelWidth + valueWidth;

      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20">
          <linearGradient id="b" x2="0" y2="100%">
            <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
            <stop offset="1" stop-opacity=".1"/>
          </linearGradient>
          <mask id="a">
            <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
          </mask>
          <g mask="url(#a)">
            <path fill="#555" d="M0 0h${labelWidth}v20H0z"/>
            <path fill="${color}" d="M${labelWidth} 0h${valueWidth}v20H${labelWidth}z"/>
            <path fill="url(#b)" d="M0 0h${totalWidth}v20H0z"/>
          </g>
          <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
            <text x="${
              labelWidth / 2
            }" y="15" fill="#010101" fill-opacity=".3">${label}</text>
            <text x="${labelWidth / 2}" y="14">${label}</text>
            <text x="${
              labelWidth + valueWidth / 2
            }" y="15" fill="#010101" fill-opacity=".3">${value}</text>
            <text x="${labelWidth + valueWidth / 2}" y="14">${value}</text>
          </g>
        </svg>
      `.trim();

      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.send(svg);
    } catch (error) {
      logger.error("Error generating server badge:", error);

      const errorSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="20">
          <rect width="100" height="20" fill="#e74c3c"/>
          <text x="50" y="14" fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">Error</text>
        </svg>
      `.trim();

      res.setHeader("Content-Type", "image/svg+xml");
      res.send(errorSvg);
    }
  });

  return router;
}
