import React from "react";
import styles from "./LoadingSpinner.module.scss";

type LoadingSpinnerProps = {
  message?: string;
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className={styles.spinnerOverlay} role="status" aria-live="polite">
      <div className={styles.spinnerBox}>
        <div className={styles.spinner} aria-hidden="true" />
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
