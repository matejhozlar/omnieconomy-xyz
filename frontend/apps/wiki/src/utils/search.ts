import { WIKI_CATEGORIES, WikiCategory, WikiPage } from "../data/categories";

export interface SearchResult {
  category: WikiCategory;
  page: WikiPage;
  matches: {
    title: boolean;
    description: boolean;
    content?: boolean;
  };
  score: number;
}

/**
 * Advanced search function that searches through titles, descriptions, and optionally content
 * @param query - The search query
 * @param options - Search options
 * @returns Array of search results sorted by relevance
 */
export function searchWiki(
  query: string,
  options: { maxResults?: number } = {}
): SearchResult[] {
  const { maxResults = 10 } = options;

  if (!query.trim()) {
    return [];
  }

  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();
  const queryWords = lowerQuery.split(/\s+/).filter((word) => word.length > 0);

  WIKI_CATEGORIES.forEach((category) => {
    category.pages.forEach((page) => {
      const titleLower = page.title.toLowerCase();
      const descriptionLower = page.description.toLowerCase();

      const titleMatch = queryWords.some((word) => titleLower.includes(word));
      const descriptionMatch = queryWords.some((word) =>
        descriptionLower.includes(word)
      );

      let score = 0;

      if (titleLower.includes(lowerQuery)) {
        score += 100;
      }

      queryWords.forEach((word) => {
        if (titleLower.includes(word)) {
          score += 10;
        }
      });

      queryWords.forEach((word) => {
        if (descriptionLower.includes(word)) {
          score += 5;
        }
      });

      if (category.title.toLowerCase().includes(lowerQuery)) {
        score += 3;
      }

      if (titleMatch || descriptionMatch) {
        results.push({
          category,
          page,
          matches: {
            title: titleMatch,
            description: descriptionMatch,
          },
          score,
        });
      }
    });
  });

  return results.sort((a, b) => b.score - a.score).slice(0, maxResults);
}

/**
 * Get recent searches from localStorage
 */
export function getRecentSearches(): string[] {
  try {
    const recent = localStorage.getItem("wiki-recent-searches");
    return recent ? JSON.parse(recent) : [];
  } catch {
    return [];
  }
}

/**
 * Add a search to recent searches
 */
export function addRecentSearch(query: string): void {
  if (!query.trim()) return;

  try {
    const recent = getRecentSearches();
    const updated = [query, ...recent.filter((q) => q !== query)].slice(0, 5);

    localStorage.setItem("wiki-recent-searches", JSON.stringify(updated));
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Clear recent searches
 */
export function clearRecentSearches(): void {
  try {
    localStorage.removeItem("wiki-recent-searches");
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Get popular pages (you can customize this based on your analytics)
 */
export function getPopularPages(): Array<{
  category: WikiCategory;
  page: WikiPage;
}> {
  return WIKI_CATEGORIES.map((category) => ({
    category,
    page: category.pages[0],
  }));
}
