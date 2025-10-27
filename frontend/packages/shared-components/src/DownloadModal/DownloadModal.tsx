import { X } from "lucide-react";
import styles from "./DownloadModal.module.scss";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <h2 className={styles.title}>Download OmniEconomy</h2>
        <p className={styles.description}>Choose your preferred platform</p>

        <div className={styles.options}>
          <a
            href="https://www.curseforge.com/minecraft/mc-mods/omnieconomy"
            className={styles.option}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.optionLogo}>
              <img src="/assets/platforms/curseforge.png" alt="CurseForge" />
            </div>
            <div className={styles.optionContent}>
              <h3 className={styles.optionTitle}>CurseForge</h3>
              <p className={styles.optionDescription}>
                Download from the world's largest mod repository
              </p>
            </div>
            <svg
              className={styles.optionArrow}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          <a
            href="https://modrinth.com/mod/omnieconomy"
            className={styles.option}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.optionLogo}>
              <img src="/assets/platforms/modrinth.png" alt="Modrinth" />
            </div>
            <div className={styles.optionContent}>
              <h3 className={styles.optionTitle}>Modrinth</h3>
              <p className={styles.optionDescription}>
                Fast, modern, and open-source platform
              </p>
            </div>
            <svg
              className={styles.optionArrow}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
