import { Book, Code, Wrench, Settings, LucideIcon } from "lucide-react";

export interface WikiPage {
  slug: string;
  title: string;
  description: string;
  contentPath: string;
}

export interface WikiCategory {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  pages: WikiPage[];
}

export const WIKI_CATEGORIES: WikiCategory[] = [
  {
    id: "users",
    title: "User Guide",
    description: "Learn how to use OmniEconomy",
    icon: Book,
    color: "#22c55e",
    pages: [
      {
        slug: "getting-started",
        title: "Getting Started",
        description: "Initial setup and configuration",
        contentPath: "/content/users/getting-started.md",
      },
      {
        slug: "Items",
        title: "Items",
        description: "Items & Recipes",
        contentPath: "/content/users/items.md",
      },
      {
        slug: "getting-money",
        title: "First Money",
        description: "Earning money guide",
        contentPath: "/content/users/getting-money.md",
      },
      {
        slug: "commands",
        title: "Commands",
        description: "List of all available commands",
        contentPath: "/content/users/commands.md",
      },
      {
        slug: "currency",
        title: "Currency System",
        description: "Understading physical currency",
        contentPath: "/content/users/currency.md",
      },
      {
        slug: "atm-blocks",
        title: "ATM Blocks",
        description: "How to use ATM Blocks",
        contentPath: "/content/users/atm-blocks.md",
      },
      {
        slug: "daily-limits",
        title: "Daily Limits",
        description: "Server set up daily limits",
        contentPath: "/content/users/daily-limits.md",
      },
      {
        slug: "mod-integrations",
        title: "Mod Integrations",
        description: "Supported mod integrations",
        contentPath: "/content/users/mod-integrations.md",
      },
      {
        slug: "enchantments",
        title: "Enchantments",
        description: "OmniEconomy custom enchantments",
        contentPath: "/content/users/enchantments.md",
      },
      {
        slug: "need-help",
        title: "Need Help?",
        description: "Get help from mod developers",
        contentPath: "/content/users/need-help.md",
      },
    ],
  },
  {
    id: "developers",
    title: "Developer Guide",
    description: "API and integration guides",
    icon: Code,
    color: "#3b82f6",
    pages: [
      {
        slug: "api-overview",
        title: "API Overview",
        description: "Introduction to OmniEconomy API",
        contentPath: "/content/developers/api-overview.md",
      },
    ],
  },
  {
    id: "admin",
    title: "Admin Guide",
    description: "Server administration and configuration",
    icon: Wrench,
    color: "#f59e0b",
    pages: [
      {
        slug: "installation",
        title: "Installation",
        description: "How to install on your server",
        contentPath: "/content/admin/installation.md",
      },
    ],
  },
  {
    id: "advanced",
    title: "Advanced",
    description: "Advanced topics and customization",
    icon: Settings,
    color: "#a855f7",
    pages: [
      {
        slug: "custom-drops",
        title: "Custom Mob Drops",
        description: "Configuring mob currency drops",
        contentPath: "/content/advanced/custom-drops.md",
      },
    ],
  },
];

export function getCategoryById(id: string): WikiCategory | undefined {
  return WIKI_CATEGORIES.find((cat) => cat.id === id);
}

export function getPage(
  categoryId: string,
  pageSlug: string
): WikiPage | undefined {
  const category = getCategoryById(categoryId);
  return category?.pages.find((page) => page.slug === pageSlug);
}

export function searchWiki(
  query: string
): Array<{ category: WikiCategory; page: WikiPage }> {
  const results: Array<{ category: WikiCategory; page: WikiPage }> = [];
  const lowerQuery = query.toLowerCase();

  WIKI_CATEGORIES.forEach((category) => {
    category.pages.forEach((page) => {
      if (
        page.title.toLowerCase().includes(lowerQuery) ||
        page.description.toLowerCase().includes(lowerQuery)
      ) {
        results.push({ category, page });
      }
    });
  });

  return results;
}
