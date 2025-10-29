import { WIKI_CATEGORIES, WikiCategory, WikiPage } from "../data/categories";
import { getContentIndex, ContentIndex } from "./searchIndexer";

export interface SearchMatch {
  type: "title" | "description" | "heading" | "content";
  text: string;
  context?: string;
  position?: number;
}

export interface SearchResult {
  category: WikiCategory;
  page: WikiPage;
  matches: SearchMatch[];
  score: number;
  excerpt?: string;
}

function calculateSimilarity(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;

  if (len1 === 0 || len2 === 0) return 0;
  if (str1 === str2) return 1;

  let matches = 0;
  const range = Math.max(len1, len2) / 2 - 1;
  const str1Matches = new Array(len1);
  const str2Matches = new Array(len2);

  for (let i = 0; i < len1; i++) {
    const low = Math.max(0, i - range);
    const high = Math.min(i + range + 1, len2);

    for (let j = low; j < high; j++) {
      if (str1Matches[i] || str2Matches[j]) continue;
      if (str1[i] !== str2[j]) continue;

      str1Matches[i] = str2Matches[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) return 0;
  return matches / Math.max(len1, len2);
}

function extractContext(
  text: string,
  position: number,
  contextLength: number = 100
): string {
  const start = Math.max(0, position - contextLength);
  const end = Math.min(text.length, position + contextLength);

  let excerpt = text.slice(start, end);

  if (start > 0) excerpt = "..." + excerpt;
  if (end < text.length) excerpt = excerpt + "...";

  return excerpt.trim();
}

function scoreMatch(
  query: string,
  text: string,
  matchType: SearchMatch["type"]
): number {
  const lowerQuery = query.toLowerCase();
  const lowerText = text.toLowerCase();

  let score = 0;

  if (lowerText === lowerQuery) {
    score += 100;
  } else if (lowerText.includes(lowerQuery)) {
    score += 50;
  }

  const wordBoundaryRegex = new RegExp(`\\b${lowerQuery}\\b`, "i");
  if (wordBoundaryRegex.test(lowerText)) {
    score += 25;
  }

  score += calculateSimilarity(lowerQuery, lowerText) * 20;

  const position = lowerText.indexOf(lowerQuery);
  if (position !== -1) {
    score += Math.max(0, 10 - position / 10);
  }

  const multipliers = {
    title: 5,
    heading: 3,
    description: 2,
    content: 1,
  };

  score *= multipliers[matchType];

  return score;
}

export async function searchWiki(
  query: string,
  options: { maxResults?: number; includeContent?: boolean } = {}
): Promise<SearchResult[]> {
  const { maxResults = 10, includeContent = true } = options;

  if (!query.trim()) {
    return [];
  }

  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();
  const queryWords = lowerQuery.split(/\s+/).filter((word) => word.length > 1);

  let contentIndex: ContentIndex[] = [];
  if (includeContent) {
    try {
      contentIndex = await getContentIndex();
    } catch (error) {
      console.error("Failed to get content index:", error);
    }
  }

  WIKI_CATEGORIES.forEach((category) => {
    category.pages.forEach((page) => {
      const matches: SearchMatch[] = [];
      let totalScore = 0;

      const titleLower = page.title.toLowerCase();
      const descriptionLower = page.description.toLowerCase();
      const categoryLower = category.title.toLowerCase();

      if (
        titleLower.includes(lowerQuery) ||
        queryWords.some((word) => titleLower.includes(word))
      ) {
        const matchScore = scoreMatch(query, page.title, "title");
        totalScore += matchScore;
        matches.push({
          type: "title",
          text: page.title,
        });
      }

      if (
        descriptionLower.includes(lowerQuery) ||
        queryWords.some((word) => descriptionLower.includes(word))
      ) {
        const matchScore = scoreMatch(query, page.description, "description");
        totalScore += matchScore;
        matches.push({
          type: "description",
          text: page.description,
        });
      }

      if (categoryLower.includes(lowerQuery)) {
        totalScore += 5;
      }

      if (includeContent && contentIndex.length > 0) {
        const pageIndex = contentIndex.find(
          (idx) =>
            idx.page.slug === page.slug && idx.category.id === category.id
        );

        if (pageIndex) {
          pageIndex.headings.forEach((heading) => {
            const headingLower = heading.text.toLowerCase();
            if (
              headingLower.includes(lowerQuery) ||
              queryWords.some((word) => headingLower.includes(word))
            ) {
              const matchScore = scoreMatch(query, heading.text, "heading");
              totalScore += matchScore;
              matches.push({
                type: "heading",
                text: heading.text,
                position: heading.position,
              });
            }
          });

          pageIndex.sections.forEach((section) => {
            const sectionLower = section.content.toLowerCase();
            const matchPosition = sectionLower.indexOf(lowerQuery);

            if (
              matchPosition !== -1 ||
              queryWords.some((word) => sectionLower.includes(word))
            ) {
              const matchScore = scoreMatch(query, section.content, "content");
              totalScore += matchScore;

              const context = extractContext(
                section.content,
                matchPosition !== -1
                  ? matchPosition
                  : sectionLower.indexOf(queryWords[0]),
                80
              );

              matches.push({
                type: "content",
                text: section.heading,
                context,
                position: section.position,
              });
            }
          });
        }
      }

      if (matches.length > 0) {
        const bestMatch = matches.find((m) => m.context) || matches[0];
        const excerpt = bestMatch.context || bestMatch.text;

        results.push({
          category,
          page,
          matches,
          score: totalScore,
          excerpt,
        });
      }
    });
  });

  return results.sort((a, b) => b.score - a.score).slice(0, maxResults);
}

export function searchWikiSync(
  query: string,
  options: { maxResults?: number } = {}
): SearchResult[] {
  const { maxResults = 10 } = options;

  if (!query.trim()) {
    return [];
  }

  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();
  const queryWords = lowerQuery.split(/\s+/).filter((word) => word.length > 1);

  WIKI_CATEGORIES.forEach((category) => {
    category.pages.forEach((page) => {
      const matches: SearchMatch[] = [];
      let totalScore = 0;

      const titleLower = page.title.toLowerCase();
      const descriptionLower = page.description.toLowerCase();

      if (
        titleLower.includes(lowerQuery) ||
        queryWords.some((word) => titleLower.includes(word))
      ) {
        const matchScore = scoreMatch(query, page.title, "title");
        totalScore += matchScore;
        matches.push({
          type: "title",
          text: page.title,
        });
      }

      if (
        descriptionLower.includes(lowerQuery) ||
        queryWords.some((word) => descriptionLower.includes(word))
      ) {
        const matchScore = scoreMatch(query, page.description, "description");
        totalScore += matchScore;
        matches.push({
          type: "description",
          text: page.description,
        });
      }

      if (matches.length > 0) {
        results.push({
          category,
          page,
          matches,
          score: totalScore,
          excerpt: page.description,
        });
      }
    });
  });

  return results.sort((a, b) => b.score - a.score).slice(0, maxResults);
}

export function getRecentSearches(): string[] {
  try {
    const recent = localStorage.getItem("wiki-recent-searches");
    return recent ? JSON.parse(recent) : [];
  } catch {
    return [];
  }
}

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

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem("wiki-recent-searches");
  } catch {
    // Ignore localStorage errors
  }
}

export function getPopularPages(): Array<{
  category: WikiCategory;
  page: WikiPage;
}> {
  return WIKI_CATEGORIES.map((category) => ({
    category,
    page: category.pages[0],
  }));
}
