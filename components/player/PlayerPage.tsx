"use client";

import { use } from "react";
import { Book, FontSize } from "@/lib/types";
import { useAppSelector } from "@/lib/hooks";
import { SidebarState } from "@/lib/features/sidebar/sidebarSlice";
import AudioPlayer from "./AudioPlayer";
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
        <div className={styles.summaryText} style={{ fontSize: fontSize }}>
          {book.summary}
        </div>
      </div>

      <AudioPlayer book={book} />

    </div>
  )
}

export default PlayerPage
