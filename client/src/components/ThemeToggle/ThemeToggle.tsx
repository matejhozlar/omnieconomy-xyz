import { useTheme } from "./useTheme";
import styles from "./ThemeToggle.module.scss";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-pressed={isLight}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
    >
      <span className={styles.knob} aria-hidden />
      <span className={styles.iconSun} aria-hidden>
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path
            fill="currentColor"
            d="M6.76 4.84 5.34 3.42 3.92 4.84l1.42 1.42 1.42-1.42Zm10.48 0 1.42-1.42 1.42 1.42-1.42 1.42-1.42-1.42ZM11 1h2v3h-2V1Zm0 19h2v3h-2v-3ZM1 11h3v2H1v-2Zm19 0h3v2h-3v-2ZM6.76 19.16l-1.42 1.42-1.42-1.42 1.42-1.42 1.42 1.42Zm12.72 0 1.42 1.42-1.42 1.42-1.42-1.42 1.42-1.42ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z"
          />
        </svg>
      </span>
      <span className={styles.iconMoon} aria-hidden>
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path
            fill="currentColor"
            d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z"
          />
        </svg>
      </span>
    </button>
  );
}
