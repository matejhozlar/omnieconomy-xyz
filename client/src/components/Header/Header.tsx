import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import styles from "./Header.module.scss";

type NavItem =
  | { label: string; to: string; external?: false }
  | { label: string; href: string; external: true }
  | { label: string; type: "menu"; items: { label: string; to: string }[] };

const navItems: NavItem[] = [
  { label: "Docs", to: "/docs" },
  { label: "Tools", to: "/tools" },
  { label: "Changelog", to: "/changelog" },
  {
    label: "Versions",
    type: "menu",
    items: [
      { label: "1.21.1", to: "/downloads#1.21.1" },
      { label: "All releases", to: "/downloads" },
    ],
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [verOpen, setVerOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Brand */}
        <Link to="/" className={styles.brand} aria-label="Go to homepage">
          <img src="/assets/logo/logo.png" className={styles.logo} alt="" />
          <span className={styles.brandText}>OmniEconomy</span>
        </Link>

        {/* Desktop nav */}
        <nav className={styles.nav} aria-label="Primary">
          {navItems.map((item, i) =>
            "type" in item ? (
              <div
                key={i}
                className={styles.menu}
                onMouseEnter={() => setVerOpen(true)}
                onMouseLeave={() => setVerOpen(false)}
              >
                <button
                  className={styles.menuButton}
                  aria-haspopup="menu"
                  aria-expanded={verOpen}
                  onClick={() => setVerOpen((v) => !v)}
                >
                  {item.label}
                  <span className={styles.caret} aria-hidden>
                    ▾
                  </span>
                </button>
                {verOpen && (
                  <ul role="menu" className={styles.menuList}>
                    {item.items.map((sub) => (
                      <li role="none" key={sub.label}>
                        <NavLink
                          role="menuitem"
                          to={sub.to}
                          className={styles.menuItem}
                        >
                          {sub.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : item.external ? (
              <a
                key={i}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={styles.link}
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                key={i}
                to={item.to}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ""}`
                }
              >
                {item.label}
              </NavLink>
            )
          )}

          {/* Right-side utility actions */}
          <div className={styles.actions}>
            <a
              className={styles.ghost}
              href="https://github.com/your-org/omnieconomy"
              target="_blank"
              rel="noreferrer"
              aria-label="View on GitHub"
              title="View on GitHub"
            >
              <svg
                viewBox="0 0 16 16"
                width="18"
                height="18"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M8 .2a8 8 0 0 0-2.53 15.6c.4.07.55-.18.55-.4v-1.4c-2.23.49-2.7-1.07-2.7-1.07-.37-.95-.9-1.2-.9-1.2-.73-.5.06-.49.06-.49.8.06 1.22.83 1.22.83.72 1.22 1.9.87 2.36.67.07-.53.28-.87.5-1.07-1.78-.2-3.65-.9-3.65-3.98 0-.88.32-1.6.84-2.16-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.52.56.84 1.28.84 2.16 0 3.1-1.87 3.77-3.65 3.98.29.25.54.73.54 1.48v2.2c0 .22.15.47.55.4A8 8 0 0 0 8 .2Z"
                />
              </svg>
            </a>

            <a
              className={styles.secondary}
              href="https://modrinth.com/mod/omnieconomy"
              target="_blank"
              rel="noreferrer"
            >
              Download
            </a>

            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile toggle */}
        <button
          className={styles.mobileToggle}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div id="mobile-menu" className={styles.mobileMenu}>
          <div className={styles.mobileLinks}>
            {navItems.map((item, i) =>
              "type" in item ? (
                <details key={i}>
                  <summary>{item.label}</summary>
                  <ul>
                    {item.items.map((sub) => (
                      <li key={sub.label}>
                        <NavLink to={sub.to} onClick={() => setOpen(false)}>
                          {sub.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : item.external ? (
                <a
                  key={i}
                  href={"external" in item ? item.href : "#"}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.label}
                </a>
              ) : (
                <NavLink key={i} to={item.to} onClick={() => setOpen(false)}>
                  {item.label}
                </NavLink>
              )
            )}

            <a
              className={styles.secondary}
              href="https://modrinth.com/mod/omnieconomy"
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
            >
              Download
            </a>
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
