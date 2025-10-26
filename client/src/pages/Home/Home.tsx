import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  TrendingUp,
  Store,
  Coins,
  LineChart,
  Building2,
  ShoppingCart,
  Briefcase,
  Settings,
} from "lucide-react";
import DownloadModal from "../../components/DownloadModal/DownloadModal";
import styles from "./Home.module.scss";

export default function Home() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const openDownloadModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsDownloadModalOpen(true);
  };

  const closeDownloadModal = () => {
    setIsDownloadModalOpen(false);
  };

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
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
            <Link to="/docs" className={styles.btnSecondary}>
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
            </Link>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.visualCard}>
            <div className={styles.visualIcon}>
              <DollarSign size={32} />
            </div>
            <div className={styles.visualLabel}>Dynamic Pricing</div>
          </div>
          <div className={styles.visualCard}>
            <div className={styles.visualIcon}>
              <LineChart size={32} />
            </div>
            <div className={styles.visualLabel}>Market Analytics</div>
          </div>
          <div className={styles.visualCard}>
            <div className={styles.visualIcon}>
              <Store size={32} />
            </div>
            <div className={styles.visualLabel}>Player Shops</div>
          </div>
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>2.5M+</div>
            <div className={styles.statLabel}>Total Downloads</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>15K+</div>
            <div className={styles.statLabel}>Active Servers</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>4.8★</div>
            <div className={styles.statLabel}>Average Rating</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>50+</div>
            <div className={styles.statLabel}>Features</div>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Powerful Features</h2>
          <p className={styles.sectionDescription}>
            Everything you need to build a thriving economy
          </p>
        </div>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Coins size={40} />
            </div>
            <h3 className={styles.featureTitle}>Multi-Currency System</h3>
            <p className={styles.featureDescription}>
              Support for multiple currencies with custom exchange rates and
              automatic conversion systems.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <TrendingUp size={40} />
            </div>
            <h3 className={styles.featureTitle}>Dynamic Market Prices</h3>
            <p className={styles.featureDescription}>
              Prices adjust automatically based on supply and demand, creating a
              realistic economy.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Building2 size={40} />
            </div>
            <h3 className={styles.featureTitle}>Banking System</h3>
            <p className={styles.featureDescription}>
              Players can deposit, withdraw, and earn interest on their savings
              with customizable rates.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <ShoppingCart size={40} />
            </div>
            <h3 className={styles.featureTitle}>Admin & Player Shops</h3>
            <p className={styles.featureDescription}>
              Create global admin shops or let players set up their own stores
              with custom pricing.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Briefcase size={40} />
            </div>
            <h3 className={styles.featureTitle}>Job System</h3>
            <p className={styles.featureDescription}>
              Players can take jobs, complete tasks, and earn money through
              various activities.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Settings size={40} />
            </div>
            <h3 className={styles.featureTitle}>Highly Configurable</h3>
            <p className={styles.featureDescription}>
              Extensive configuration options to customize every aspect to fit
              your server's needs.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.compatibility}>
        <div className={styles.compatCard}>
          <h2 className={styles.compatTitle}>Works With Your Setup</h2>
          <p className={styles.compatDescription}>
            OmniEconomy integrates seamlessly with popular mods
          </p>
          <div className={styles.compatGrid}>
            <a href="https://www.curseforge.com/minecraft/mc-mods/create">
              <div className={styles.compatItem}>
                <div className={styles.compatCheck}>✓</div>
                <span>Create</span>
              </div>
            </a>
            <a href="https://www.curseforge.com/minecraft/mc-mods/afkstatus">
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

      <section className={styles.cta}>
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
              href="https://discord.gg/yourserver"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Discord
            </a>
            <span>•</span>
            <Link to="/docs">View Documentation</Link>
            <span>•</span>
            <a
              href="https://github.com/matejhoz/omnieconomy"
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
