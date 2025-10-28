import { useState, useEffect, useRef } from "react";
import {
  DollarSign,
  TrendingUp,
  Building2,
  Settings,
  Check,
  Zap,
  Calendar,
  CreditCard,
  Banknote,
  Sparkles,
  Clock,
  Award,
  Wand2,
  Package,
  Database,
} from "lucide-react";
import { DownloadModal } from "@omnieconomy/shared-components";
import {
  useDownloadStats,
  formatDownloads,
} from "../../hooks/UseDownloadStats";
import { useTelemetryStats } from "../../hooks/useTelemetryStats";
import ROADMAP_ITEMS from "./utils/ROADMAP_ITEMS";
import config from "@omnieconomy/shared-config";
import styles from "./Home.module.scss";

export default function Home() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const { downloads, loading: downloadsLoading } = useDownloadStats();
  const { stats: telemetry, loading: telemetryLoading } =
    useTelemetryStats(120_000);
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const roadmapRef = useRef<HTMLElement>(null);
  const compatRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.animate);
        }
      });
    }, observerOptions);

    const refs = [
      heroRef,
      statsRef,
      featuresRef,
      roadmapRef,
      compatRef,
      ctaRef,
    ];
    refs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    const featureCards = document.querySelectorAll(`.${styles.featureCard}`);
    featureCards.forEach((card, index) => {
      const cardObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add(styles.animateCard);
              }, index * 100);
            }
          });
        },
        { threshold: 0.2 }
      );
      cardObserver.observe(card);
    });

    const statCards = document.querySelectorAll(`.${styles.statCard}`);
    statCards.forEach((card, index) => {
      const cardObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add(styles.animateCard);
              }, index * 150);
            }
          });
        },
        { threshold: 0.2 }
      );
      cardObserver.observe(card);
    });

    const visualCards = document.querySelectorAll(`.${styles.visualCard}`);
    visualCards.forEach((card, index) => {
      const cardObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add(styles.animateCard);
              }, index * 150);
            }
          });
        },
        { threshold: 0.2 }
      );
      cardObserver.observe(card);
    });

    return () => {
      refs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  const openDownloadModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsDownloadModalOpen(true);
  };

  const closeDownloadModal = () => {
    setIsDownloadModalOpen(false);
  };

  return (
    <div className={styles.home}>
      <section ref={heroRef} className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Now available for Minecraft 1.21.1
          </div>
          <h1 className={styles.heroTitle}>
            The Ultimate Economy System for{" "}
            <span className={styles.gradient}>Minecraft</span>
          </h1>
          <p className={styles.heroDescription}>
            Create complex trading systems, dynamic shops, and player-driven
            economies. OmniEconomy brings real economic mechanics to your
            Minecraft server.
          </p>
          <div className={styles.heroButtons}>
            <a
              href="#"
              className={styles.btnPrimary}
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
              Download Now
            </a>
            <a
              href={config.ORIGINS.WIKI_ORIGIN}
              className={styles.btnSecondary}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
              Read Documentation
            </a>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.visualCard}>
            <div className={styles.visualIcon}>
              <CreditCard size={32} />
            </div>
            <div className={styles.visualLabel}>ATM System</div>
          </div>
          <div className={styles.visualCard}>
            <div className={styles.visualIcon}>
              <Banknote size={32} />
            </div>
            <div className={styles.visualLabel}>Physical Currency</div>
          </div>
          <div className={styles.visualCard}>
            <div className={styles.visualIcon}>
              <Sparkles size={32} />
            </div>
            <div className={styles.visualLabel}>Mob Rewards</div>
          </div>
        </div>
      </section>

      <section ref={statsRef} className={styles.stats}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>
              {downloadsLoading ? "..." : formatDownloads(downloads)}
            </div>
            <div className={styles.statLabel}>Total Downloads</div>
          </div>
          <div
            className={styles.statCard}
            title={
              telemetry?.timestamp
                ? `Updated ${new Date(telemetry.timestamp).toLocaleString()}`
                : undefined
            }
          >
            <div className={styles.statNumber}>
              {telemetryLoading
                ? "..."
                : formatDownloads(telemetry?.totalServers ?? 0)}
            </div>
            <div className={styles.statLabel}>Total Servers</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>1</div>
            <div className={styles.statLabel}>Supported Loaders</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>1</div>
            <div className={styles.statLabel}>Supported Versions</div>
          </div>
        </div>
      </section>

      <section ref={featuresRef} className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Powerful Features</h2>
          <p className={styles.sectionDescription}>
            Everything you need to build a thriving economy
          </p>
        </div>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Building2 size={40} />
            </div>
            <h3 className={styles.featureTitle}>Virtual Banking System</h3>
            <p className={styles.featureDescription}>
              Store money virtually with deposit/withdraw commands and ATM
              blocks with PIN protection.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Banknote size={40} />
            </div>
            <h3 className={styles.featureTitle}>Physical Currency</h3>
            <p className={styles.featureDescription}>
              Eight bill denominations ($1-$1000) that can be deposited,
              withdrawn, and traded physically.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <CreditCard size={40} />
            </div>
            <h3 className={styles.featureTitle}>ATM Blocks</h3>
            <p className={styles.featureDescription}>
              Interactive ATM blocks with GUI for deposits, withdrawals, and
              balance checking with keyboard navigation.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Sparkles size={40} />
            </div>
            <h3 className={styles.featureTitle}>Mob Farming Rewards</h3>
            <p className={styles.featureDescription}>
              Mobs drop currency bills with configurable rates and daily caps to
              prevent exploitation.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Clock size={40} />
            </div>
            <h3 className={styles.featureTitle}>Playtime Rewards</h3>
            <p className={styles.featureDescription}>
              Automatic payouts for active playtime with daily caps and AFK
              detection integration.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Award size={40} />
            </div>
            <h3 className={styles.featureTitle}>Daily Rewards</h3>
            <p className={styles.featureDescription}>
              Claim daily login bonuses with the /daily command for consistent
              player engagement.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <TrendingUp size={40} />
            </div>
            <h3 className={styles.featureTitle}>Lottery System</h3>
            <p className={styles.featureDescription}>
              Server-wide lottery system where players bet and compete for the
              total pot.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <DollarSign size={40} />
            </div>
            <h3 className={styles.featureTitle}>Balance Management</h3>
            <p className={styles.featureDescription}>
              Comprehensive commands: /money, /pay, /baltop, /deposit, /withdraw
              with cooldowns.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Wand2 size={40} />
            </div>
            <h3 className={styles.featureTitle}>
              Capitalist Greed Enchantment
            </h3>
            <p className={styles.featureDescription}>
              Weapon enchantment (3 levels) that increases currency drop chances
              from mobs.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Package size={40} />
            </div>
            <h3 className={styles.featureTitle}>Create Mod Integration</h3>
            <p className={styles.featureDescription}>
              Stock Ticker shopping list integration - use bank card to
              auto-withdraw bills for purchases.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Database size={40} />
            </div>
            <h3 className={styles.featureTitle}>Automatic Backups</h3>
            <p className={styles.featureDescription}>
              Rolling backup system for economy data with configurable
              retention.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Settings size={40} />
            </div>
            <h3 className={styles.featureTitle}>Highly Configurable</h3>
            <p className={styles.featureDescription}>
              Extensive config options for every feature: rates, limits,
              cooldowns, and toggles.
            </p>
          </div>
        </div>
      </section>

      <section ref={roadmapRef} className={styles.roadmap}>
        <div className={styles.roadmapContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Roadmap</h2>
            <p className={styles.sectionDescription}>
              See what's coming next for OmniEconomy
            </p>
          </div>

          <div className={styles.roadmapGrid}>
            {ROADMAP_ITEMS.map((item, index) => (
              <div key={index} className={styles.roadmapItem}>
                <div className={styles.roadmapHeader}>
                  <div
                    className={`${styles.roadmapStatus} ${
                      styles[`status-${item.status}`]
                    }`}
                  >
                    {item.status === "completed" && (
                      <>
                        <Check size={16} />
                        <span>Completed</span>
                      </>
                    )}
                    {item.status === "in-progress" && (
                      <>
                        <Zap size={16} />
                        <span>In Progress</span>
                      </>
                    )}
                    {item.status === "planned" && (
                      <>
                        <Calendar size={16} />
                        <span>Planned</span>
                      </>
                    )}
                  </div>
                </div>
                <h3 className={styles.roadmapTitle}>{item.title}</h3>
                <p className={styles.roadmapDescription}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={compatRef} className={styles.compatibility}>
        <div className={styles.compatCard}>
          <h2 className={styles.compatTitle}>Works With Your Setup</h2>
          <p className={styles.compatDescription}>
            OmniEconomy integrates seamlessly with popular mods
          </p>
          <div className={styles.compatGrid}>
            <a href={config.LINKS.CREATE}>
              <div className={styles.compatItem}>
                <div className={styles.compatCheck}>✓</div>
                <span>Create</span>
              </div>
            </a>
            <a href={config.LINKS.AFKSTATUS}>
              <div className={styles.compatItem}>
                <div className={styles.compatCheck}>✓</div>
                <span>AFKStatus</span>
              </div>
            </a>
            <div className={styles.compatItem}>
              <div className={styles.compatCheck}>✓</div>
              <span>More coming soon...</span>
            </div>
          </div>
        </div>
      </section>

      <section ref={ctaRef} className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
          <p className={styles.ctaDescription}>
            Join thousands of servers already using OmniEconomy
          </p>
          <div className={styles.ctaButtons}>
            <a
              href="#"
              className={styles.ctaBtnPrimary}
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
              Download Now
            </a>
          </div>
          <div className={styles.ctaLinks}>
            <a
              href={config.LINKS.DISCORD}
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Discord
            </a>
            <span>•</span>
            <a href={config.ORIGINS.WIKI_ORIGIN}>View Documentation</a>
            <span>•</span>
            <a
              href={config.LINKS.GITHUB}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </section>

      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={closeDownloadModal}
      />
    </div>
  );
}
