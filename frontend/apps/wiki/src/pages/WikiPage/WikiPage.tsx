import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Home, ChevronLeft, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { LoadingSpinner } from "@omnieconomy/shared-components";
import { getCategoryById, getPage } from "../../data/categories";
import TableOfContents from "../../components/TableOfContents/TableOfContents";
import OutdatedBanner from "@/components/OutdatedBanner/OutdatedBanner";
import styles from "./WikiPage.module.scss";

export default function WikiPage() {
  const { category: categoryId, page: pageSlug } = useParams<{
    category: string;
    page: string;
  }>();

  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(
    null!
  ) as React.RefObject<HTMLDivElement>;

  const category = categoryId ? getCategoryById(categoryId) : undefined;
  const page =
    categoryId && pageSlug ? getPage(categoryId, pageSlug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId, pageSlug]);

  useEffect(() => {
    if (!page?.contentPath) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(page.contentPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load content: ${response.statusText}`);
        }
        return response.text();
      })
      .then((markdown) => {
        setContent(markdown);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading markdown:", err);
        setError("Failed to load content. Please try again later.");
        setLoading(false);
      });
  }, [page?.contentPath]);

  if (!category || !page) {
    return (
      <div className={styles.notFound}>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/" className={styles.homeLink}>
          <Home size={20} />
          Back to Wiki Home
        </Link>
      </div>
    );
  }

  const currentIndex = category.pages.findIndex((p) => p.slug === pageSlug);
  const previousPage =
    currentIndex > 0 ? category.pages[currentIndex - 1] : null;
  const nextPage =
    currentIndex < category.pages.length - 1
      ? category.pages[currentIndex + 1]
      : null;

  const CategoryIcon = category.icon;

  return (
    <>
      <div className={styles.page}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">Wiki</Link>
          <span>/</span>
          <Link to={`/${categoryId}`}>{category.title}</Link>
          <span>/</span>
          <span>{page.title}</span>
        </nav>

        <article className={styles.article}>
          <header className={styles.header}>
            <div className={styles.category}>
              <CategoryIcon size={20} />
              <span>{category.title}</span>
            </div>
            <h1 className={styles.title}>{page.title}</h1>
            <p className={styles.description}>{page.description}</p>
          </header>

          {categoryId && pageSlug && !loading && !error && (
            <OutdatedBanner categoryId={categoryId} pageSlug={pageSlug} />
          )}

          <div className={styles.content} ref={contentRef}>
            {loading && <LoadingSpinner message="Loading content..." />}

            {error && (
              <div className={styles.error}>
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && content && (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                components={{
                  a: ({ href, children, ...props }) => {
                    const isExternal = href?.startsWith("http");
                    return (
                      <a
                        href={href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  },
                  img: ({ title, ...props }) => {
                    const style: React.CSSProperties = {
                      maxWidth: "100%",
                      height: "auto",
                    };
                    if (title) {
                      const w = title.match(/w=([0-9]+%?)/)?.[1];
                      const h = title.match(/h=([0-9]+%?)/)?.[1];
                      if (w) style.width = w.endsWith("%") ? w : `${w}px`;
                      if (h) style.height = h.endsWith("%") ? h : `${h}px`;
                    }
                    return <img {...props} style={style} />;
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            )}
          </div>
        </article>

        <nav className={styles.navigation}>
          {previousPage ? (
            <Link
              to={`/${categoryId}/${previousPage.slug}`}
              className={`${styles.navButton} ${styles.navButtonPrev}`}
            >
              <ChevronLeft size={20} />
              <div>
                <div className={styles.navLabel}>Previous</div>
                <div className={styles.navTitle}>{previousPage.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextPage && (
            <Link
              to={`/${categoryId}/${nextPage.slug}`}
              className={`${styles.navButton} ${styles.navButtonNext}`}
            >
              <div className={styles.navTextRight}>
                <div className={styles.navLabel}>Next</div>
                <div className={styles.navTitle}>{nextPage.title}</div>
              </div>
              <ChevronRight size={20} />
            </Link>
          )}
        </nav>
      </div>

      {!loading && !error && content && (
        <TableOfContents contentRef={contentRef} />
      )}
    </>
  );
}
