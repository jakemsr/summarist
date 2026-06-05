"use client";

import Search from "@/components/search/Search";
import Sidebar from "@/components/sidebar/Sidebar";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { closeSidebar, SidebarState } from "@/lib/features/sidebar/sidebarSlice";
import styles from "./pagesLayout.module.css";

const PagesLayout = ({ player, children }: { player: boolean, children: React.ReactNode }) => {

  const dispatch = useAppDispatch();
  const sidebar: SidebarState = useAppSelector(state => state.sidebar);

  return (
    <div className={styles.wrapper}>
      <Search />
      <div
        className={`${styles.sidebarOverlay} ${sidebar.isOpen ? "" : styles.sidebarOverlayHidden}`}
        onClick={() => dispatch(closeSidebar())}
      >
      </div>

      <Sidebar player={player} />

      {player ? (
        <>
          {children}
        </>
      ) : (
        <div className="row">
          <div className="container">

            {children}

          </div>
        </div>
      )}
    </div>
  )
}

export default PagesLayout
