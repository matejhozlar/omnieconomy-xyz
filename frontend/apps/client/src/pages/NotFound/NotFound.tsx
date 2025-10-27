import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";
import styles from "./NotFound.module.scss";

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <div className={styles.content}>
        <div className={styles.errorCode}>
          <span className={styles.four}>4</span>
          <span className={styles.zero}>0</span>
          <span className={styles.four}>4</span>
        </div>

        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.description}>
          Oops! The page you're looking for doesn't exist. It might have been
          moved or deleted.
        </p>

        <div className={styles.actions}>
          <Link to="/" className={styles.primaryButton}>
            <Home size={20} />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className={styles.secondaryButton}
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        <div className={styles.links}>
          <p className={styles.linksTitle}>You might be looking for:</p>
          <div className={styles.linksList}>
            <Link to="/" className={styles.link}>
              <Home size={16} />
              Home
            </Link>
            <a
              href="https://github.com/matejhozlar/omnieconomy"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <Search size={16} />
              GitHub
            </a>
            <a
              href="https://discord.gg/mNcm76HXFy"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <Search size={16} />
              Discord
            </a>
          </div>
        </div>
      </div>

      <div className={styles.background}>
        <div className={styles.circle} />
        <div className={styles.circle} />
        <div className={styles.circle} />
      </div>
    </div>
  );
}
