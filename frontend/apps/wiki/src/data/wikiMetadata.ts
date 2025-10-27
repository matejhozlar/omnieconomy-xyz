import config from "@omnieconomy/shared-config";

/**
 * Wiki Metadata Configuration
 *
 * This file tracks the mod version and last update timestamp for each wiki page.
 * When a page is outdated compared to the current mod version, a warning banner is shown.
 */

export interface PageMetadata {
  modVersion: string;
  lastUpdated: string;
  updateNotes?: string;
}

export interface WikiMetadata {
  currentModVersion: string;
  currentVersionDate: string;
  pages: Record<string, PageMetadata>;
}

export const WIKI_METADATA: WikiMetadata = {
  currentModVersion: config.MOD.VERSION,
  currentVersionDate: config.MOD.UPDATE_DATE,

  pages: {
    "users/getting-started": {
      modVersion: "0.1.1",
      lastUpdated: "2025-10-27",
      updateNotes: "Initial comprehensive guide",
    },
    "users/items-and-recipes": {
      modVersion: "0.1.1",
      lastUpdated: "2025-10-27",
      updateNotes: "Added lottery commands",
    },
    "users/getting-money": {
      modVersion: "0.1.1",
      lastUpdated: "2025-10-27",
    },
    "users/commands": {
      modVersion: "0.1.1",
      lastUpdated: "2025-10-27",
    },
    "users/currency": {
      modVersion: "0.1.1",
      lastUpdated: "2025-10-27",
    },
    "users/atm-blocks": {
      modVersion: "0.1.1",
      lastUpdated: "2025-10-27",
    },
    "users/daily-limits": {
      modVersion: "0.1.1",
      lastUpdated: "2025-10-27",
    },
    "users/mod-integrations": {
      modVersion: "0.1.1",
      lastUpdated: "2025-10-27",
    },
    "users/enchantments": {
      modVersion: "0.1.1",
      lastUpdated: "2025-10-27",
    },
    "users/need-help": {
      modVersion: "0.1.1",
      lastUpdated: "2025-10-27",
    },

    "developers/api-overview": {
      modVersion: "0.1.1",
      lastUpdated: "2025-10-27",
    },

    "admin/installation": {
      modVersion: "0.1.1",
      lastUpdated: "2025-10-27",
    },

    "advanced/custom-drops": {
      modVersion: "0.1.1",
      lastUpdated: "2025-10-27",
    },
  },
};

/**
 * Compare two semantic version strings
 * @returns -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
export function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split(".").map(Number);
  const parts2 = v2.split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;

    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }

  return 0;
}

/**
 * Check if a page is outdated compared to current mod version
 */
export function isPageOutdated(categoryId: string, pageSlug: string): boolean {
  const pageKey = `${categoryId}/${pageSlug}`;
  const metadata = WIKI_METADATA.pages[pageKey];

  if (!metadata) {
    return true;
  }

  return (
    compareVersions(metadata.modVersion, WIKI_METADATA.currentModVersion) < 0
  );
}

/**
 * Get metadata for a specific page
 */
export function getPageMetadata(
  categoryId: string,
  pageSlug: string
): PageMetadata | null {
  const pageKey = `${categoryId}/${pageSlug}`;
  return WIKI_METADATA.pages[pageKey] || null;
}

/**
 * Get how many versions behind a page is
 */
export function getVersionDifference(pageVersion: string): string {
  const current = WIKI_METADATA.currentModVersion;
  const comparison = compareVersions(pageVersion, current);

  if (comparison === 0) return "up to date";
  if (comparison > 0) return "ahead (beta)";

  const [pMajor, pMinor] = pageVersion.split(".").map(Number);
  const [cMajor, cMinor] = current.split(".").map(Number);

  if (pMajor < cMajor) {
    const diff = cMajor - pMajor;
    return `${diff} major version${diff > 1 ? "s" : ""} behind`;
  }

  if (pMinor < cMinor) {
    const diff = cMinor - pMinor;
    return `${diff} minor version${diff > 1 ? "s" : ""} behind`;
  }

  return "slightly outdated";
}

/**
 * Format date for display
 */
export function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return isoDate;
  }
}

/**
 * Get time ago string
 */
export function getTimeAgo(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "today";
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  } catch {
    return "unknown";
  }
}
