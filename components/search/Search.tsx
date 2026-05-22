"use client";

import { IoIosSearch } from "react-icons/io"
import styles from "./search.module.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { useAppDispatch } from "@/lib/hooks";
import { openSidebar } from "@/lib/features/sidebar/sidebarSlice";

const Search = () => {

  const dispatch = useAppDispatch();
  
  return (
    <div className={styles.background}>
      <div className={styles.wrapper}>
        <div></div>
        <div className={styles.content}>
          <div className={styles.inputWrapper}>
            <input
              className={styles.input}
              placeholder="Search for books"
              type="text"
              id="searchInput"
            />
            <div className={styles.icon}>
              <IoIosSearch />
            </div>
          </div>
          <div
            className={styles.sidebarToggleBtn}
            onClick={() => dispatch(openSidebar())}
          >
            <RxHamburgerMenu />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search
