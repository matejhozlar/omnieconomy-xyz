import { Link, useParams } from "react-router-dom";
import { ArrowRight, Home } from "lucide-react";
import { getCategoryById } from "../../data/categories";
import styles from "./CategoryPage.module.scss";

export default function CategoryPage() {
  const { category: categoryId } = useParams<{ category: string }>();
  const category = categoryId ? getCategoryById(categoryId) : undefined;

  if (!category) {
    return (
      <div className={styles.notFound}>
        <h1>Category Not Found</h1>
        <p>The category you're looking for doesn't exist.</p>
        <Link to="/" className={styles.homeLink}>
          <Home size={20} />
          Back to Wiki Home
        </Link>
      </div>
    );
  }

  const CategoryIcon = category.icon;

  return (
    <div className={styles.category}>
      <nav className={styles.breadcrumbs}>
        <Link to="/">Wiki</Link>
        <span>/</span>
        <span>{category.title}</span>
      </nav>

      <header
        className={styles.header}
        style={{ "--category-color": category.color } as React.CSSProperties}
      >
        <div className={styles.iconWrapper}>
          <CategoryIcon size={48} />
        </div>
        <div>
          <h1 className={styles.title}>{category.title}</h1>
          <p className={styles.description}>{category.description}</p>
        </div>
      </header>

      <div className={styles.pages}>
        {category.pages.map((page) => (
          <Link
            key={page.slug}
            to={`/${categoryId}/${page.slug}`}
            className={styles.pageCard}
          >
            <div className={styles.pageContent}>
              <h2 className={styles.pageTitle}>{page.title}</h2>
              <p className={styles.pageDescription}>{page.description}</p>
            </div>
            <ArrowRight className={styles.pageArrow} size={20} />
          </Link>
        ))}
      </div>
    </div>
  );
}
