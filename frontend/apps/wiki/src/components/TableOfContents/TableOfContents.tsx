import { useEffect, useState } from "react";
import styles from "./TableOfContents.module.scss";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  contentRef: React.RefObject<HTMLDivElement>;
}

export default function TableOfContents({ contentRef }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!contentRef.current) return;

    const elements = contentRef.current.querySelectorAll("h1, h2, h3");
    const items: TOCItem[] = Array.from(elements).map((element) => {
      if (!element.id) {
        element.id =
          element.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || "";
      }

      return {
        id: element.id,
        text: element.textContent || "",
        level: parseInt(element.tagName[1]),
      };
    });

    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
    };
  }, [contentRef]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (headings.length === 0) return null;

  return (
    <aside className={styles.toc}>
      <div className={styles.tocContent}>
        <div className={styles.tocTitle}>On This Page</div>
        <nav className={styles.tocNav}>
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => handleClick(heading.id)}
              className={`${styles.tocItem} ${
                styles[`level${heading.level}`]
              } ${activeId === heading.id ? styles.active : ""}`}
            >
              {heading.text}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
