import { useState, useEffect } from "react";
import { DollarSign } from "lucide-react";
import styles from "./InitialLoader.module.scss";

interface InitialLoaderProps {
  onComplete: () => void;
}

export default function InitialLoader({ onComplete }: InitialLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = 2000;
    const interval = 50;
    const steps = duration / interval;
    const increment = 100 / steps;

    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(timer);
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(onComplete, 800);
        }, 300);
      }
      setProgress(currentProgress);
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className={`${styles.loader} ${isExiting ? styles.exiting : ""}`}>
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <div className={styles.logoRing}>
            <div className={styles.logoRingInner} />
          </div>
          <div className={styles.logo}>
            <DollarSign size={64} strokeWidth={2.5} />
          </div>
        </div>

        <h1 className={styles.title}>OmniEconomy</h1>
        <p className={styles.subtitle}>Loading...</p>

        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className={styles.progressText}>{Math.round(progress)}%</div>
        </div>
      </div>

      <div className={styles.particles}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
