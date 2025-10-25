import React from "react";
import styles from "./LoadingSpinner.module.scss";

type LoadingSpinnerProps = {
  message?: string;
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className={styles["spinner-overlay"]} role="status" aria-live="polite">
      <div className="spinner-box">
        <div className="spinner" aria-hidden="true" />
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
