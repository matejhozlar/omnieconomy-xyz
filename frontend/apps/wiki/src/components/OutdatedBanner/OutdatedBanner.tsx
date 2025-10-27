import { AlertTriangle, RefreshCw, Calendar } from "lucide-react";
import {
  WIKI_METADATA,
  getPageMetadata,
  getVersionDifference,
  formatDate,
  getTimeAgo,
} from "../../data/wikiMetadata";
import styles from "./OutdatedBanner.module.scss";

interface OutdatedBannerProps {
  categoryId: string;
  pageSlug: string;
}

export default function OutdatedBanner({
  categoryId,
  pageSlug,
}: OutdatedBannerProps) {
  const metadata = getPageMetadata(categoryId, pageSlug);

  if (!metadata) {
    return (
      <div className={`${styles.banner} ${styles.warning}`}>
        <div className={styles.icon}>
          <AlertTriangle size={20} />
        </div>
        <div className={styles.content}>
          <div className={styles.title}>Documentation Status Unknown</div>
          <div className={styles.message}>
            This page does not have version information. It may be outdated.
          </div>
        </div>
      </div>
    );
  }

  const isOutdated = metadata.modVersion !== WIKI_METADATA.currentModVersion;

  if (!isOutdated) {
    return (
      <div className={`${styles.banner} ${styles.success}`}>
        <div className={styles.icon}>
          <RefreshCw size={18} />
        </div>
        <div className={styles.content}>
          <div className={styles.infoRow}>
            <span>
              <strong>Up to date</strong> for mod version{" "}
              {WIKI_METADATA.currentModVersion}
            </span>
            <span className={styles.separator}>•</span>
            <span className={styles.date}>
              <Calendar size={14} />
              Updated {getTimeAgo(metadata.lastUpdated)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const versionDiff = getVersionDifference(metadata.modVersion);

  return (
    <div className={`${styles.banner} ${styles.warning}`}>
      <div className={styles.icon}>
        <AlertTriangle size={20} />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>Outdated Documentation</div>
        <div className={styles.message}>
          This page was written for <strong>v{metadata.modVersion}</strong> and
          is <strong>{versionDiff}</strong>. Current mod version is{" "}
          <strong>v{WIKI_METADATA.currentModVersion}</strong>.
        </div>
        <div className={styles.meta}>
          Last updated: {formatDate(metadata.lastUpdated)} (
          {getTimeAgo(metadata.lastUpdated)})
          {metadata.updateNotes && (
            <>
              <span className={styles.separator}>•</span>
              {metadata.updateNotes}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
