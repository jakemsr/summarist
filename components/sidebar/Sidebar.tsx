"use client";

import Link from "next/link";
import { AiOutlineHome } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { RiBallPenLine } from "react-icons/ri"
import { IoIosSearch } from "react-icons/io"
import LoginModal from "@/components/loginModal/LoginModal";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import styles from "./sidebar.module.css";
import { usePathname } from "next/navigation";
import { SlSettings } from "react-icons/sl";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import { openModal } from "@/lib/features/modal/modalSlice";
import { logOut, UserState } from "@/lib/features/user/userSlice";

const Sidebar = () => {

  const pathname = usePathname();

  const dispatch = useAppDispatch();
  const user: UserState = useAppSelector(state => state.user);

  const logInOrOut = () => {
    if (user.isLoggedIn) {
      dispatch(logOut());
    } else {
      dispatch(openModal());
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src="/logo.png" alt="" className={styles.img} />
      </div>
      <div className={styles.wrapper}>
        <div className={styles.top}>

          <Link href="/for-you" className={styles.linkWrapper}>
            <div className={`${styles.linkLine} ${(pathname === "/for-you") ? styles.activeLink : ''}`}></div>
            <div className={styles.iconWrapper}>
              <AiOutlineHome className={styles.svg} />
            </div>
            <div className={styles.linkText}>
              For you
            </div>
          </Link>

          <Link href="library" className={styles.linkWrapper}>
            <div className={`${styles.linkLine} ${(pathname === "/library") ? styles.activeLink : ''}`}></div>
            <div className={styles.iconWrapper}>
              <BsBookmark className={styles.svg} />
            </div>
            <div className={styles.linkText}>
              My Library
            </div>
          </Link>

          <div className={`${styles.linkWrapper} ${styles.linkNotAllowed}`}>
            <div className={`${styles.linkLine} ${styles.linkNotAllowed}`}></div>
            <div className={styles.iconWrapper}>
              <RiBallPenLine className={styles.svg} />
            </div>
            <div className={styles.linkText}>
              Highlights
            </div>
          </div>

          <div className={`${styles.linkWrapper} ${styles.linkNotAllowed}`}>
            <div className={styles.linkLine}></div>
            <div className={styles.iconWrapper}>
              <IoIosSearch className={styles.svg} />
            </div>
            <div className={styles.linkText}>
              Search
            </div>
          </div>

        </div>
        <div className={styles.bottom}>

          <Link href="/settings" className={styles.linkWrapper}>
            <div className={`${styles.linkLine} ${(pathname === "/settings") ? styles.activeLink : ''}`}></div>
            <div className={styles.iconWrapper}>
              <SlSettings className={styles.svg} />
            </div>
            <div className={styles.linkText}>
              Settings
            </div>
          </Link>

          <div className={`${styles.linkWrapper} ${styles.linkNotAllowed}`}>
            <div className={`${styles.linkLine} ${styles.linkNotAllowed}`}></div>
            <div className={styles.iconWrapper}>
              <RxQuestionMarkCircled className={styles.svg} />
            </div>
            <div className={styles.linkText}>
              Help &amp; Support
            </div>
          </div>

          <div className={styles.linkWrapper} onClick={logInOrOut}>
            <LoginModal />
            <div className={styles.linkLine}></div>
            <div className={styles.iconWrapper}>
              <FiLogOut className={styles.svg} />
            </div>
            <div className={styles.linkText}>
              {user.isLoggedIn ? "Logout" : "Login"}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Sidebar
