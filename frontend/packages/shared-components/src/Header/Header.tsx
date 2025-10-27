import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import DownloadModal from "../DownloadModal/DownloadModal";
import config from "@omnieconomy/shared-config";
import styles from "./Header.module.scss";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const toggleMenu = (): void => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMenu = (): void => {
    setMobileMenuOpen(false);
  };

  const openDownloadModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsDownloadModalOpen(true);
  };

  const closeDownloadModal = () => {
    setIsDownloadModalOpen(false);
  };

  useEffect(() => {
    const header = document.querySelector(`.${styles.header}`);

    const handleScroll = () => {
      if (window.scrollY > 0) {
        header?.classList.add(styles.scrolled);
      } else {
        header?.classList.remove(styles.scrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.left}>
            <a
              href={config.ORIGINS.APP_ORIGIN}
              className={styles.brand}
              onClick={closeMenu}
            >
              <div className={styles.logo}>
                <img src="/assets/logo/logo.png" alt="OmniEconomy Logo" />
              </div>
              <span className={styles.name}>OmniEconomy</span>
            </a>
          </div>

          <nav className={`${styles.nav} ${mobileMenuOpen ? styles.open : ""}`}>
            <a
              href={config.ORIGINS.WIKI_ORIGIN}
              className={styles.navLink}
              onClick={closeMenu}
            >
              Wiki
            </a>
            <Link to="/tools" className={styles.navLink} onClick={closeMenu}>
              Tools
            </Link>
            <a
              href={config.LINKS.GITHUB}
              className={styles.navLink}
              onClick={closeMenu}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href={config.LINKS.DISCORD}
              className={styles.navLink}
              onClick={closeMenu}
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord
            </a>
          </nav>

          <div className={styles.right}>
            <ThemeToggle />

            <a
              href="#"
              className={styles.downloadBtn}
              onClick={openDownloadModal}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              <span>Download</span>
            </a>

            <button
              type="button"
              className={`${styles.menuBtn} ${
                mobileMenuOpen ? styles.open : ""
              }`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className={styles.menuIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
              <svg
                className={styles.closeIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={closeDownloadModal}
      />
    </>
  );
}
