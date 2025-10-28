import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { WIKI_CATEGORIES } from "../../data/categories";
import { useEqualHeights } from "@/hooks/useEqualHeights";
import styles from "./HomePage.module.scss";

export default function HomePage() {
  useEqualHeights(`.${styles.categoryCard}`);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <h1 className={styles.title}>OmniEconomy Wiki</h1>
        <p className={styles.description}>
          Complete documentation for users, developers, and server
          administrators
        </p>
      </header>

      <div className={styles.categories}>
        {WIKI_CATEGORIES.map((category) => (
          <Link
            key={category.id}
            to={`/${category.id}`}
            className={styles.categoryCard}
            style={
              { "--category-color": category.color } as React.CSSProperties
            }
          >
            <div className={styles.categoryIcon}>
              <category.icon size={32} />
            </div>
            <div className={styles.categoryContent}>
              <h2 className={styles.categoryTitle}>{category.title}</h2>
              <p className={styles.categoryDescription}>
                {category.description}
              </p>
              <div className={styles.categoryPages}>
                {category.pages.length} article
                {category.pages.length !== 1 ? "s" : ""}
              </div>
            </div>
            <ArrowRight className={styles.categoryArrow} size={20} />
          </Link>
        ))}
      </div>

      <div className={styles.quickStart}>
        <h2 className={styles.quickStartTitle}>Quick Start</h2>
        <div className={styles.quickStartCards}>
          <Link to="/users/getting-started" className={styles.quickCard}>
            <h3>New User?</h3>
            <p>Learn the basics and get started</p>
          </Link>
          <Link to="/admin/installation" className={styles.quickCard}>
            <h3>Setting Up?</h3>
            <p>Install on your server</p>
          </Link>
          <Link to="/developers/api-overview" className={styles.quickCard}>
            <h3>Developer?</h3>
            <p>Explore the API</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
