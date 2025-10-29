import { WIKI_CATEGORIES, WikiCategory, WikiPage } from "../data/categories";

export interface ContentIndex {
  category: WikiCategory;
  page: WikiPage;
  content: string;
  headings: Array<{
    level: number;
    text: string;
    position: number;
  }>;
  sections: Array<{
    heading: string;
    content: string;
    position: number;
  }>;
}

let contentIndexCache: ContentIndex[] | null = null;
let indexingPromise: Promise<ContentIndex[]> | null = null;

/**
 * Strip markdown formatting to get plain text
 */
function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/^(-{3,}|_{3,}|\*{3,})$/gm, "")
    .replace(/^\s*>\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract headings from markdown content
 */
function extractHeadings(content: string): Array<{
  level: number;
  text: string;
  position: number;
}> {
  const headings: Array<{ level: number; text: string; position: number }> = [];
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim(),
      position: match.index,
    });
  }

  return headings;
}

/**
 * Split content into sections based on headings
 */
function extractSections(
  content: string,
  headings: Array<{ level: number; text: string; position: number }>
): Array<{ heading: string; content: string; position: number }> {
  const sections: Array<{
    heading: string;
    content: string;
    position: number;
  }> = [];

  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    const nextHeading = headings[i + 1];

    const sectionStart = heading.position;
    const sectionEnd = nextHeading ? nextHeading.position : content.length;

    const sectionContent = content.slice(sectionStart, sectionEnd);
    const cleanContent = stripMarkdown(sectionContent);

    sections.push({
      heading: heading.text,
      content: cleanContent,
      position: heading.position,
    });
  }

  return sections;
}

/**
 * Fetch and index a single page
 */
async function indexPage(
  category: WikiCategory,
  page: WikiPage
): Promise<ContentIndex> {
  try {
    const response = await fetch(page.contentPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${page.contentPath}`);
    }

    const content = await response.text();
    const headings = extractHeadings(content);
    const sections = extractSections(content, headings);

    return {
      category,
      page,
      content: stripMarkdown(content),
      headings,
      sections,
    };
  } catch (error) {
    console.error(`Error indexing page ${page.slug}:`, error);
    return {
      category,
      page,
      content: "",
      headings: [],
      sections: [],
    };
  }
}

/**
 * Build the complete content index
 */
export async function buildContentIndex(): Promise<ContentIndex[]> {
  if (contentIndexCache) {
    return contentIndexCache;
  }

  if (indexingPromise) {
    return indexingPromise;
  }

  indexingPromise = (async () => {
    const indexPromises: Promise<ContentIndex>[] = [];

    for (const category of WIKI_CATEGORIES) {
      for (const page of category.pages) {
        indexPromises.push(indexPage(category, page));
      }
    }

    const results = await Promise.all(indexPromises);
    contentIndexCache = results;
    indexingPromise = null;
    return results;
  })();

  return indexingPromise;
}

/**
 * Get the content index (will trigger build if not yet built)
 */
export async function getContentIndex(): Promise<ContentIndex[]> {
  return buildContentIndex();
}

/**
 * Clear the content index cache (useful for hot reloading during development)
 */
export function clearContentIndexCache(): void {
  contentIndexCache = null;
  indexingPromise = null;
}

/**
 * Preload the content index on app initialization
 */
export function preloadContentIndex(): void {
  buildContentIndex().catch((error) => {
    console.error("Failed to preload content index:", error);
  });
}
