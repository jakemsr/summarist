"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AiOutlineStar } from "react-icons/ai";
import { LuClock3 } from "react-icons/lu";
import { Book } from "@/lib/types";
import styles from "./bookCard.module.css";


const BookCard = ({ book }: { book: Book }) => {

  const audioRef = useRef<HTMLAudioElement>(null);

  const [duration, setDuration] = useState<string>("0:00");

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      let seconds = Math.floor(audioRef.current.duration);
      const minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      setDuration(`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
    }
  };


  return (
    <>
      <audio
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
      >
        <source src={book.audioLink} type="audio/x-mp3" />
      </audio>

      <Link href={`/book/${book.id}`} className={styles.bookLink}>
        {book.subscriptionRequired && (
          <div className={styles.bookPill}>Premium</div>
        )}
        <figure className={styles.bookImageWrapper}>
          <img src={book.imageLink} alt="" className={styles.bookImage} />
        </figure>
        <div className={styles.bookTitle}>
          {book.title}
        </div>
        <div className={styles.bookAuthor}>
          {book.author}
        </div>
        <div className={styles.bookSubTitle}>
          {book.subTitle}
        </div>
        <div className={styles.bookDetailsWrapper}>
          <div className={styles.bookDetails}>
            <div className={styles.bookDetailsIcon}>
              <LuClock3 />
            </div>
            <div className={styles.bookDetailsText}>
              {duration}
            </div>
          </div>
          <div className={styles.bookDetails}>
            <div className={styles.bookDetailsIcon}>
              <AiOutlineStar />
            </div>
            <div className={styles.bookDetailsText}>
              {book.averageRating}
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}

export default BookCard
