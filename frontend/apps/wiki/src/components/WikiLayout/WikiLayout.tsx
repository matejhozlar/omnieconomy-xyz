// apps/wiki/src/components/WikiLayout/WikiLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import SearchModal from "../SearchModal/SearchModal";
import styles from "./WikiLayout.module.scss";

export default function WikiLayout() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <>
      <div className={styles.layout}>
        <Sidebar onSearchClick={() => setIsSearchModalOpen(true)} />
        <main className={styles.main}>
          <div className={styles.content}>
            <Outlet />
          </div>
        </main>
      </div>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
}
