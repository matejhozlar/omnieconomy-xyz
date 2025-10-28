import { useEffect, useRef, useState } from "react";

export interface TelemetryStats {
  totalServers: number;
  activeToday: number;
  activeThisWeek: number;
  versionBreakdown: Record<string, number>;
  timestamp: number;
}

export function useTelemetryStats(refreshMs = 60_000) {
  const [stats, setStats] = useState<TelemetryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/telemetry/stats", {
          signal: ctrl.signal,
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: TelemetryStats = await res.json();
        setStats(data);
      } catch (error) {
        if ((error as { name?: string })?.name !== "AbortError")
          setError(error);
      } finally {
        setLoading(false);
      }
    }

    load();
    if (refreshMs > 0) {
      timerRef.current = window.setInterval(load, refreshMs);
    }

    return () => {
      ctrl.abort();
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [refreshMs]);

  return { stats, loading, error };
}
