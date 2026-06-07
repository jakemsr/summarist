"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LuClock3 } from "react-icons/lu";
import { Book } from "@/lib/types";
import styles from "./search.module.css";


const SearchBook = ({ book }: { book: Book }) => {

  const audioRef = useRef<HTMLAudioElement>(null);

  const [duration, setDuration] = useState<string>("0:00");

  useEffect(() => {
    const currentAudioRef = audioRef.current;
    if (currentAudioRef) {
      // if metadata loaded before listener was attached
      if (currentAudioRef.readyState >= 1) {
        onLoadedMetadata();
      }
    }
  }, []);

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      let seconds = Math.floor(audioRef.current.duration);
      const minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      setDuration(`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
    }
  };


  return (
    <Link href={`/book/${book.id}`} className={styles.bookLink}>
      <audio
        src={book.audioLink}
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
      />
      <figure className={styles.bookImageWrapper}>
        <img src={book.imageLink} alt="" className={styles.bookImage} />
      </figure>
      <div>
        <div className={styles.bookTitle}>
          {book.title}
        </div>
        <div className={styles.bookAuthor}>
          {book.author}
        </div>
        <div className={styles.bookDuration}>
          <div className={styles.bookDetails}>
            <div className={styles.bookDetailsIcon}>
              <LuClock3 />
            </div>
            <div className={styles.bookDetailsText}>
              {duration}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default SearchBook
