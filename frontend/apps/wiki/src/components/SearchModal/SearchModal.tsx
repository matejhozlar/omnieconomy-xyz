import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Clock, TrendingUp, X, CornerDownLeft } from "lucide-react";
import {
  searchWiki,
  getRecentSearches,
  addRecentSearch,
  getPopularPages,
  SearchResult,
} from "../../utils/search";
import styles from "./SearchModal.module.scss";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularPages] = useState(getPopularPages());
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setRecentSearches(getRecentSearches());
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchWiki(query, { maxResults: 8 });
      setResults(searchResults);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query]);

  const navigateToPage = useCallback(
    (categoryId: string, pageSlug: string) => {
      navigate(`/${categoryId}/${pageSlug}`);
      onClose();
    },
    [navigate, onClose]
  );

  const handleResultClick = useCallback(
    (result: SearchResult) => {
      addRecentSearch(query);
      navigateToPage(result.category.id, result.page.slug);
    },
    [query, navigateToPage]
  );

  const handleRecentClick = useCallback((recentQuery: string) => {
    setQuery(recentQuery);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const itemCount =
        results.length || recentSearches.length || popularPages.length;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % itemCount);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + itemCount) % itemCount);
          break;
        case "Enter":
          e.preventDefault();
          if (query.trim() && results.length > 0) {
            handleResultClick(results[selectedIndex]);
          } else if (!query.trim() && recentSearches.length > 0) {
            handleRecentClick(recentSearches[selectedIndex]);
          } else if (!query.trim() && popularPages.length > 0) {
            const popular = popularPages[selectedIndex];
            navigateToPage(popular.category.id, popular.page.slug);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [
      query,
      results,
      selectedIndex,
      recentSearches,
      popularPages,
      handleResultClick,
      handleRecentClick,
      navigateToPage,
      onClose,
    ]
  );

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  const showResults = query.trim() && results.length > 0;
  const showRecent = !query.trim() && recentSearches.length > 0;
  const showPopular = !query.trim() && !showRecent;

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.searchBar}>
          <Search className={styles.searchIcon} size={20} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search documentation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.input}
            autoComplete="off"
          />
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.results}>
          {showResults && (
            <div className={styles.resultSection}>
              <div className={styles.sectionTitle}>Results for "{query}"</div>
              {results.map((result, index) => {
                const CategoryIcon = result.category.icon;
                return (
                  <button
                    key={`${result.category.id}-${result.page.slug}`}
                    className={`${styles.resultItem} ${
                      index === selectedIndex ? styles.selected : ""
                    }`}
                    onClick={() => handleResultClick(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div
                      className={styles.resultIcon}
                      style={{ color: result.category.color }}
                    >
                      <CategoryIcon size={20} />
                    </div>
                    <div className={styles.resultContent}>
                      <div className={styles.resultTitle}>
                        {result.page.title}
                      </div>
                      <div className={styles.resultMeta}>
                        <span className={styles.categoryBadge}>
                          {result.category.title}
                        </span>
                        <span className={styles.resultDescription}>
                          {result.page.description}
                        </span>
                      </div>
                    </div>
                    <CornerDownLeft className={styles.enterIcon} size={14} />
                  </button>
                );
              })}
            </div>
          )}

          {showRecent && (
            <div className={styles.resultSection}>
              <div className={styles.sectionTitle}>
                <Clock size={16} />
                Recent Searches
              </div>
              {recentSearches.map((recentQuery, index) => (
                <button
                  key={recentQuery}
                  className={`${styles.resultItem} ${styles.recentItem} ${
                    index === selectedIndex ? styles.selected : ""
                  }`}
                  onClick={() => handleRecentClick(recentQuery)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <Clock className={styles.recentIcon} size={16} />
                  <div className={styles.resultContent}>
                    <div className={styles.resultTitle}>{recentQuery}</div>
                  </div>
                  <CornerDownLeft className={styles.enterIcon} size={14} />
                </button>
              ))}
            </div>
          )}

          {showPopular && (
            <div className={styles.resultSection}>
              <div className={styles.sectionTitle}>
                <TrendingUp size={16} />
                Popular Pages
              </div>
              {popularPages.slice(0, 5).map((item, index) => {
                const CategoryIcon = item.category.icon;
                return (
                  <button
                    key={`${item.category.id}-${item.page.slug}`}
                    className={`${styles.resultItem} ${
                      index === selectedIndex ? styles.selected : ""
                    }`}
                    onClick={() =>
                      navigateToPage(item.category.id, item.page.slug)
                    }
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div
                      className={styles.resultIcon}
                      style={{ color: item.category.color }}
                    >
                      <CategoryIcon size={20} />
                    </div>
                    <div className={styles.resultContent}>
                      <div className={styles.resultTitle}>
                        {item.page.title}
                      </div>
                      <div className={styles.resultMeta}>
                        <span className={styles.categoryBadge}>
                          {item.category.title}
                        </span>
                      </div>
                    </div>
                    <CornerDownLeft className={styles.enterIcon} size={14} />
                  </button>
                );
              })}
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <div className={styles.noResults}>
              <Search size={48} />
              <p>No results found for "{query}"</p>
              <span>Try different keywords or browse categories</span>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.footerHint}>
            <kbd>↑</kbd>
            <kbd>↓</kbd>
            <span>Navigate</span>
          </div>
          <div className={styles.footerHint}>
            <kbd>↵</kbd>
            <span>Select</span>
          </div>
          <div className={styles.footerHint}>
            <kbd>Esc</kbd>
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
