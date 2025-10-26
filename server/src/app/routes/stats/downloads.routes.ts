import { Router, type Request, type Response } from "express";
import logger from "../../../logger";
import config from "../../../config";

const router = Router();

interface ModrinthResponse {
  downloads: number;
}

interface CurseForgeResponse {
  data: {
    downloadCount: number;
  };
}

interface DownloadsResponse {
  total: number;
  modrinth: number;
  curseforge: number;
  lastUpdated: string;
}

const MODRINTH_PROJECT_ID = process.env.MODRINTH_PROJECT_ID;
const CURSEFORGE_PROJECT_ID = process.env.CURSEFORGE_PROJECT_ID;
const CURSEFORGE_API_KEY = process.env.CURSEFORGE_API_KEY;

let cachedData: DownloadsResponse | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = config.DownloadsConfig.CACHE_DURATION;

/**
 * Fetches download count from Modrinth API
 */
async function fetchModrinthDownloads(): Promise<number> {
  try {
    const response = await fetch(
      `https://api.modrinth.com/v2/project/${MODRINTH_PROJECT_ID}`
    );

    if (!response.ok) {
      logger.error(`Modrinth API error: ${response.status}`);
      return 0;
    }

    const data = (await response.json()) as ModrinthResponse;
    return data.downloads || 0;
  } catch (error) {
    logger.error("Error fetching Modrinth downloads:", error);
    return 0;
  }
}

/**
 * Fetches download count from CurseForge API
 */
async function fetchCurseForgeDownloads(): Promise<number> {
  try {
    if (!CURSEFORGE_API_KEY) {
      logger.warn("CurseForge API key not configured");
      return 0;
    }

    const response = await fetch(
      `https://api.curseforge.com/v1/mods/${CURSEFORGE_PROJECT_ID}`,
      {
        headers: {
          "x-api-key": CURSEFORGE_API_KEY,
        },
      }
    );

    if (!response.ok) {
      logger.error(`CurseForge API error: ${response.status}`);
      return 0;
    }

    const data = (await response.json()) as CurseForgeResponse;
    return data.data?.downloadCount || 0;
  } catch (error) {
    logger.error("Error fetching CurseForge downloads:", error);
    return 0;
  }
}

/**
 * GET /api/downloads
 * Returns the total download count from both Modrinth and CurseForge
 */
router.get("/downloads", async (req: Request, res: Response) => {
  try {
    const now = Date.now();

    if (cachedData && now - lastFetchTime < CACHE_DURATION) {
      return res.json(cachedData);
    }

    const [modrinthDownloads, curseforgeDownloads] = await Promise.all([
      fetchModrinthDownloads(),
      fetchCurseForgeDownloads(),
    ]);

    const totalDownloads = modrinthDownloads + curseforgeDownloads;

    const responseData: DownloadsResponse = {
      total: totalDownloads,
      modrinth: modrinthDownloads,
      curseforge: curseforgeDownloads,
      lastUpdated: new Date().toISOString(),
    };

    cachedData = responseData;
    lastFetchTime = now;

    res.json(responseData);
  } catch (error) {
    logger.error("Error in downloads route:", error);
    res.status(500).json({
      error: "Failed to fetch download statistics",
      total: 0,
      modrinth: 0,
      curseforge: 0,
      lastUpdated: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/downloads/health
 * Health check endpoint to verify API connectivity
 */
router.get("/downloads/health", async (req: Request, res: Response) => {
  try {
    const modrinthOk = await fetchModrinthDownloads()
      .then(() => true)
      .catch(() => false);

    const curseforgeOk = await fetchCurseForgeDownloads()
      .then(() => true)
      .catch(() => false);

    res.json({
      status: "ok",
      apis: {
        modrinth: modrinthOk ? "connected" : "error",
        curseforge: curseforgeOk ? "connected" : "error",
      },
      cache: {
        enabled: cachedData !== null,
        age: cachedData ? Date.now() - lastFetchTime : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Health check failed" });
  }
});

export default router;
