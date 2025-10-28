import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import styles from "./TableOfContents.module.scss";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TOCSection {
  h1: TOCItem;
  h2s: TOCItem[];
}

interface TableOfContentsProps {
  contentRef: React.RefObject<HTMLDivElement>;
}

export default function TableOfContents({ contentRef }: TableOfContentsProps) {
  const [sections, setSections] = useState<TOCSection[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (!contentRef.current) return;

    const elements = contentRef.current.querySelectorAll("h1, h2");
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

    const grouped: TOCSection[] = [];
    let currentSection: TOCSection | null = null;

    items.forEach((item) => {
      if (item.level === 1) {
        currentSection = { h1: item, h2s: [] };
        grouped.push(currentSection);
      } else if (item.level === 2 && currentSection) {
        currentSection.h2s.push(item);
      }
    });

    setSections(grouped);

    const allH1Ids = grouped.map((section) => section.h1.id);
    setExpandedSections(new Set(allH1Ids));

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

  const toggleSection = (h1Id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(h1Id)) {
        next.delete(h1Id);
      } else {
        next.add(h1Id);
      }
      return next;
    });
  };

  if (sections.length === 0) return null;

  return (
    <aside className={styles.toc}>
      <div className={styles.tocContent}>
        <div className={styles.tocTitle}>On This Page</div>
        <nav className={styles.tocNav}>
          {sections.map((section) => {
            const isExpanded = expandedSections.has(section.h1.id);
            const hasSubsections = section.h2s.length > 0;

            return (
              <div key={section.h1.id} className={styles.tocSection}>
                <div className={styles.tocH1Wrapper}>
                  {hasSubsections && (
                    <button
                      onClick={() => toggleSection(section.h1.id)}
                      className={`${styles.expandButton} ${
                        isExpanded ? styles.expanded : ""
                      }`}
                      aria-label={
                        isExpanded ? "Collapse section" : "Expand section"
                      }
                    >
                      <ChevronRight size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => handleClick(section.h1.id)}
                    className={`${styles.tocItem} ${styles.level1} ${
                      activeId === section.h1.id ? styles.active : ""
                    } ${!hasSubsections ? styles.noSubsections : ""}`}
                  >
                    {section.h1.text}
                  </button>
                </div>

                {hasSubsections && isExpanded && (
                  <div className={styles.tocSubsections}>
                    {section.h2s.map((h2) => (
                      <button
                        key={h2.id}
                        onClick={() => handleClick(h2.id)}
                        className={`${styles.tocItem} ${styles.level2} ${
                          activeId === h2.id ? styles.active : ""
                        }`}
                      >
                        {h2.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
