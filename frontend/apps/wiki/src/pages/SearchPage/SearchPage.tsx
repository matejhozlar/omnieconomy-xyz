import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, FileText } from "lucide-react";
import { searchWiki } from "../../data/categories";
import styles from "./SearchPage.module.scss";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<ReturnType<typeof searchWiki>>([]);

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchWiki(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className={styles.search}>
      <header className={styles.header}>
        <div className={styles.iconWrapper}>
          <Search size={32} />
        </div>
        <div>
          <h1 className={styles.title}>Search Results</h1>
          {query && (
            <p className={styles.query}>
              Showing results for: <strong>"{query}"</strong>
            </p>
          )}
        </div>
      </header>

      {!query && (
        <div className={styles.empty}>
          <FileText size={48} />
          <p>Enter a search query to find articles</p>
        </div>
      )}

      {query && results.length === 0 && (
        <div className={styles.empty}>
          <FileText size={48} />
          <p>No results found for "{query}"</p>
          <span>Try different keywords or browse categories</span>
        </div>
      )}

      {results.length > 0 && (
        <div className={styles.results}>
          <p className={styles.count}>
            Found {results.length} result{results.length !== 1 ? "s" : ""}
          </p>

          <div className={styles.resultsList}>
            {results.map(({ category, page }) => {
              const CategoryIcon = category.icon;
              return (
                <Link
                  key={`${category.id}-${page.slug}`}
                  to={`/${category.id}/${page.slug}`}
                  className={styles.resultCard}
                  style={
                    {
                      "--category-color": category.color,
                    } as React.CSSProperties
                  }
                >
                  <div className={styles.resultIcon}>
                    <CategoryIcon size={20} />
                  </div>
                  <div className={styles.resultContent}>
                    <div className={styles.resultCategory}>
                      {category.title}
                    </div>
                    <h2 className={styles.resultTitle}>{page.title}</h2>
                    <p className={styles.resultDescription}>
                      {page.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
