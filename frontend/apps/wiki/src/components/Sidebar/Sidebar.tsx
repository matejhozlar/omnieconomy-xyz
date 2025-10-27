import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Book, Menu, X } from "lucide-react";
import { WIKI_CATEGORIES } from "../../data/categories";
import styles from "./Sidebar.module.scss";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <>
      <button
        className={styles.mobileToggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
      )}

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.sidebarContent}>
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <div className={styles.searchInput}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search wiki..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.input}
              />
            </div>
          </form>

          <nav className={styles.nav}>
            <Link
              to="/"
              className={`${styles.navItem} ${
                isActive("/") && location.pathname === "/" ? styles.active : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Book size={20} />
              <span>Wiki Home</span>
            </Link>

            <div className={styles.divider} />

            <div className={styles.categories}>
              {WIKI_CATEGORIES.map((category) => (
                <div key={category.id} className={styles.category}>
                  <Link
                    to={`/${category.id}`}
                    className={`${styles.categoryTitle} ${
                      isActive(`/${category.id}`) ? styles.active : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <category.icon size={20} />
                    <span>{category.title}</span>
                  </Link>

                  {category.pages && category.pages.length > 0 && (
                    <div className={styles.pages}>
                      {category.pages.map((page) => (
                        <Link
                          key={page.slug}
                          to={`/${category.id}/${page.slug}`}
                          className={`${styles.pageLink} ${
                            isActive(`/${category.id}/${page.slug}`)
                              ? styles.active
                              : ""
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {page.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
