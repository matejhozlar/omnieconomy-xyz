import { Router, type Request, type Response } from "express";
import type { Pool } from "pg";
import crypto from "node:crypto";
import logger from "../../../logger";

const router = Router();

interface FeedbackRequest {
  category: string;
  page: string;
  rating: "helpful" | "not_helpful";
  feedback?: string;
}

interface FeedbackStats {
  totalRatings: number;
  helpfulCount: number;
  notHelpfulCount: number;
  helpfulPercentage: number;
}

/**
 * Generate a session hash (anonymous fingerprint)
 */
function generateSessionHash(ip: string, userAgent: string): string {
  return crypto.createHash("sha256").update(`${ip}-${userAgent}`).digest("hex");
}

export default function createFeedbackRoutes(db: Pool) {
  /**
   * POST /api/feedback
   * Submit page feedback
   */
  router.post("/feedback", async (req: Request, res: Response) => {
    try {
      const { category, page, rating, feedback } = req.body as FeedbackRequest;

      if (!category || !page || !rating) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (!["helpful", "not_helpful"].includes(rating)) {
        return res.status(400).json({ error: "Invalid rating value" });
      }

      const userIp =
        (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
        req.socket.remoteAddress ||
        "unknown";
      const userAgent = req.headers["user-agent"] || "unknown";
      const sessionHash = generateSessionHash(userIp, userAgent);

      const existingRating = await db.query(
        "SELECT id FROM user_rating_sessions WHERE page_category = $1 AND page_slug = $2 AND session_hash = $3",
        [category, page, sessionHash]
      );

      if (existingRating.rows.length > 0) {
        return res.status(409).json({
          error: "You have already rated this page",
          alreadyRated: true,
        });
      }

      await db.query(
        `INSERT INTO page_ratings (page_category, page_slug, rating, feedback)
         VALUES ($1, $2, $3, $4)`,
        [category, page, rating, rating === "not_helpful" ? feedback : null]
      );

      await db.query(
        `INSERT INTO user_rating_sessions (page_category, page_slug, session_hash)
         VALUES ($1, $2, $3)`,
        [category, page, sessionHash]
      );

      logger.info(
        `Feedback: ${category}/${page} - ${rating}${
          feedback ? " (with comment)" : ""
        }`
      );

      return res.status(200).json({
        success: true,
        message: "Thank you for your feedback!",
      });
    } catch (error) {
      logger.error("Error submitting feedback:", error);
      return res.status(500).json({ error: "Failed to submit feedback" });
    }
  });

  /**
   * GET /api/feedback/stats/:category/:page
   * Get feedback statistics for a specific page
   */
  router.get(
    "/feedback/stats/:category/:page",
    async (req: Request, res: Response) => {
      try {
        const { category, page } = req.params;

        const result = await db.query(
          `SELECT 
            COUNT(*) as total_ratings,
            SUM(CASE WHEN rating = 'helpful' THEN 1 ELSE 0 END) as helpful_count,
            SUM(CASE WHEN rating = 'not_helpful' THEN 1 ELSE 0 END) as not_helpful_count
           FROM page_ratings 
           WHERE page_category = $1 AND page_slug = $2`,
          [category, page]
        );

        const row = result.rows[0];
        const totalRatings = parseInt(row.total_ratings) || 0;
        const helpfulCount = parseInt(row.helpful_count) || 0;
        const notHelpfulCount = parseInt(row.not_helpful_count) || 0;

        const stats: FeedbackStats = {
          totalRatings,
          helpfulCount,
          notHelpfulCount,
          helpfulPercentage:
            totalRatings > 0
              ? Math.round((helpfulCount / totalRatings) * 100)
              : 0,
        };

        return res.json(stats);
      } catch (error) {
        logger.error("Error fetching feedback stats:", error);
        return res.status(500).json({ error: "Failed to fetch statistics" });
      }
    }
  );

  /**
   * GET /api/feedback/check/:category/:page
   * Check if current user has already rated this page
   */
  router.get(
    "/feedback/check/:category/:page",
    async (req: Request, res: Response) => {
      try {
        const { category, page } = req.params;

        const userIp =
          (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
          req.socket.remoteAddress ||
          "unknown";
        const userAgent = req.headers["user-agent"] || "unknown";
        const sessionHash = generateSessionHash(userIp, userAgent);

        const result = await db.query(
          "SELECT id FROM user_rating_sessions WHERE page_category = $1 AND page_slug = $2 AND session_hash = $3",
          [category, page, sessionHash]
        );

        return res.json({
          hasRated: result.rows.length > 0,
        });
      } catch (error) {
        logger.error("Error checking rating status:", error);
        return res.status(500).json({ error: "Failed to check rating status" });
      }
    }
  );

  return router;
}
