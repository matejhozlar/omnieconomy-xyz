import { useState, useEffect } from "react";

interface DownloadStats {
  total: number;
  modrinth: number;
  curseforge: number;
  lastUpdated: string;
}

interface UseDownloadStatsReturn {
  downloads: number;
  loading: boolean;
  error: string | null;
  stats: DownloadStats | null;
}

/**
 * Custom hook to fetch download statistics from the backend
 * Automatically refetches every 5 minutes to stay in sync with cache
 */
export function useDownloadStats(): UseDownloadStatsReturn {
  const [downloads, setDownloads] = useState<number>(0);
  const [stats, setStats] = useState<DownloadStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/downloads");

        if (!response.ok) {
          throw new Error("Failed to fetch download statistics");
        }

        const data: DownloadStats = await response.json();
        setDownloads(data.total);
        setStats(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching downloads:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
        setDownloads(0);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();

    const interval = setInterval(fetchDownloads, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { downloads, loading, error, stats };
}

/**
 * Formats a number with K/M suffixes for display
 * Adds "+" suffix for numbers >= 1000 to indicate "and more"
 */
export function formatDownloads(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M+";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K+";
  }
  return num.toString();
}
