import { useEffect, useMemo, useState } from "react";

export type Theme = "dark" | "light";
const STORAGE_KEY = "theme";

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    /* empty */
  }
  const prefersLight = window.matchMedia?.(
    "(prefers-color-scheme: light)"
  ).matches;
  return prefersLight ? "light" : "dark";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => getPreferredTheme());

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* empty */
    }
  }, [theme]);

  const hasExplicitChoice = useMemo(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) != null;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (hasExplicitChoice || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const handler = () => setTheme(mq.matches ? "light" : "dark");
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, [hasExplicitChoice]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, setTheme, toggle };
}
