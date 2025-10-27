import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./WikiLayout.module.scss";

export default function WikiLayout() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
