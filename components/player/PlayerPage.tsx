"use client";

import { use } from "react";
import { RiForward10Line, RiPlayLargeFill, RiReplay10Line } from "react-icons/ri";
import { Book, FontSize } from "@/lib/types";
import { useAppSelector } from "@/lib/hooks";
import { SidebarState } from "@/lib/features/sidebar/sidebarSlice";
import styles from "./player.module.css"


const PlayerPage = ({ bookPromise }: { bookPromise: Promise<Book> }) => {

  const book = use(bookPromise);

  const sidebar: SidebarState = useAppSelector(state => state.sidebar);

  let fontSize = "16px";
  switch (sidebar.fontSize) {
    case FontSize.small:
      fontSize = "16px";
      break;
    case FontSize.medium:
      fontSize = "18px";
      break;
    case FontSize.large:
      fontSize = "22px";
      break;
    case FontSize.xlarge:
      fontSize = "26px";
      break;
  }
  
  return (
    <div className={styles.summary}>

      <div className={styles.bookSummary}>
        <div className={styles.summaryTitle}>
          <b>{book.title}</b>
        </div>
        <div className={styles.summaryText} style={{ fontSize: fontSize}}>
          {book.summary}
        </div>
      </div>

      <div className={styles.audioWrapper}>
        <audio src={book.audioLink} />
        <div className={styles.trackWrapper}>
          <figure className={styles.trackImageMask}>
            <figure className={styles.bookImageWrapper}>
              <img src={book.imageLink} className={styles.bookImage} alt="" />
            </figure>
          </figure>
          <div className={styles.trackDetailsWrapper}>
            <div className={styles.trackTitle}>
              {book.title}
            </div>
            <div className={styles.trackAuthor}>
              {book.author}
            </div>
          </div>
        </div>
        <div className={styles.controlsWrapper}>
          <div className={styles.controls}>
            <button className={styles.controlsBtn}>
              <RiReplay10Line />
            </button>
            <button className={`${styles.controlsBtn} ${styles.controlsBtnPlay}`}>
              <RiPlayLargeFill />
            </button>
            <button className={styles.controlsBtn}>
              <RiForward10Line />
            </button>
          </div>
        </div>
        <div className={styles.progressWrapper}>
          <div className={styles.audioTime}></div>
          <input type="range" className={styles.progressBar} name="" id="" />
          <div className={styles.audioTime}></div>
        </div>
      </div>

    </div>
  )
}

export default PlayerPage
