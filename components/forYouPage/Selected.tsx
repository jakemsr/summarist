"use client";

import { use, useRef, useState } from "react";
import Link from "next/link";
import { BsFillPlayFill } from "react-icons/bs";
import { Book } from "@/lib/types";
import styles from "./for-you.module.css";


const Selected = ({ books }: { books: Promise<Book[]> }) => {

  const selectedBooks = use(books);

  const selectedBook = selectedBooks[0];

  const audioRef = useRef<HTMLAudioElement>(null);

  const [duration, setDuration] = useState<string>("0:00");

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      let seconds = Math.floor(audioRef.current.duration);
      const minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      setDuration(`${minutes} mins ${seconds} secs`);
    }
  };


  return (
    <>
      <audio
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
      >
        <source src={selectedBook.audioLink} type="audio/x-mp3" />
      </audio>

      <Link href={`/book/${selectedBook.id}`} className={styles.selectedBook}>
        <div className={styles.selectedSubtitle}>
          {selectedBook.subTitle}
        </div>
        <div className={styles.selectedLine}></div>
        <div className={styles.selectedContent}>
          <figure className={styles.selectedImageWrapper}>
            <img className={styles.bookImage} src={selectedBook.imageLink} alt="" />
          </figure>
          <div className={styles.selectedText}>
            <div className={styles.selectedTitle}>
              {selectedBook.title}
            </div>
            <div className={styles.selectedAuthor}>
              {selectedBook.author}
            </div>
            <div className={styles.selectedDurationWrapper}>
              <div className={styles.selectedIcon}>
                <BsFillPlayFill />
              </div>
              <div className={styles.selectedDuration}>
                {duration}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}

export default Selected
