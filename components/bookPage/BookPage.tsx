"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaRegStar } from "react-icons/fa";
import { GoClock } from "react-icons/go";
import { HiOutlineLightBulb, HiOutlineMicrophone } from "react-icons/hi";
import { AiOutlineRead } from "react-icons/ai";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { Book, LibraryChange, LibraryTypes, UserSubscription } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { openModal } from "@/lib/features/modal/modalSlice";
import { firebaseUpdateLibrary, firebaseGetLibrary } from "@/lib/firebase";
import styles from "./bookPage.module.css";


const BookPage = ({ bookPromise }: { bookPromise: Promise<Book> }) => {

  const book = use(bookPromise);

  const router = useRouter();

  const audioRef = useRef<HTMLAudioElement>(null);

  const [duration, setDuration] = useState<string>("0:00");
  const [isInLibrary, setIsInLibrary] = useState<boolean>(false);

  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkIfInLibrary = async () => {
      if (!user.isLoggedIn) {
        return;
      }
      const library = await firebaseGetLibrary(user.firebaseUID);
      if (library && library.savedBooks) {
        if (library.savedBooks.includes(book.id)) {
          setIsInLibrary(true);
        }
      }
    }
    checkIfInLibrary();
  }, [user]);

  const addToLibrary = () => {
    if (!user.isLoggedIn) {
      dispatch(openModal());
    } else {
      firebaseUpdateLibrary(user.firebaseUID, book.id, LibraryTypes.saved, LibraryChange.add);
      setIsInLibrary(true);
    }
  }

  const removeFromLibrary = () => {
    firebaseUpdateLibrary(user.firebaseUID, book.id, LibraryTypes.saved, LibraryChange.remove);
    setIsInLibrary(false);
  }

  const handlePlayer = () => {
    if (!user.isLoggedIn) {
      dispatch(openModal());
    } else {
      if (book.subscriptionRequired && user.subscription === UserSubscription.basic) {
        router.push("/choose-plan");
      } else {
        router.push(`/player/${book.id}`);
      }
    }
  }

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      let seconds = Math.floor(audioRef.current.duration);
      const minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      setDuration(`${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`);
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

      <div className={styles.wrapper}>
        <div className={styles.inner}>
          <div className={styles.title}>
            {book.title}
            {book.subscriptionRequired && user.subscription === UserSubscription.basic && " (Premium)"}
          </div>
          <div className={styles.author}>
            {book.author}
          </div>
          <div className={styles.subTitle}>
            {book.subTitle}
          </div>
          <div className={styles.innerWrapper}>

            <div className={styles.innerDescriptionWrapper}>
              <div className={styles.innerDescription}>
                <div className={styles.icon}>
                  <FaRegStar />
                </div>
                <div>{book.averageRating}</div>
                <div>&nbsp;({book.totalRating} ratings)</div>
              </div>
              <div className={styles.innerDescription}>
                <div className={styles.icon}>
                  <GoClock />
                </div>
                <div>{duration}</div>
              </div>
              <div className={styles.innerDescription}>
                <div className={styles.icon}>
                  <HiOutlineMicrophone />
                </div>
                <div>{book.type}</div>
              </div>
              <div className={styles.innerDescription}>
                <div className={styles.icon}>
                  <HiOutlineLightBulb />
                </div>
                <div>{book.keyIdeas} Key ideas</div>
              </div>
            </div>

          </div>

          <div className={styles.readBtnWrapper}>
            <button className={styles.readBtn} onClick={handlePlayer}>
              <div className={styles.readIcon}>
                <AiOutlineRead />
              </div>
              <div>Read</div>
            </button>
            <button className={styles.readBtn} onClick={handlePlayer}>
              <div className={styles.readIcon}>
                <HiOutlineMicrophone />
              </div>
              <div>Listen</div>
            </button>
          </div>

          {isInLibrary ? (
            <div className={styles.bookMark} onClick={removeFromLibrary}>
              <div className={styles.bookMarkIcon}>
                <BsBookmarkFill />
              </div>
              <div>
                Saved in My Library
              </div>
            </div>
          ) : (
            <div className={styles.bookMark} onClick={addToLibrary}>
              <div className={styles.bookMarkIcon}>
                <BsBookmark />
              </div>
              <div>
                Add title to My Library
              </div>
            </div>
          )}

          <div className={styles.secondaryTitle}>
            What's it about?
          </div>

          <div className={styles.tagsWrapper}>
            {book.tags.map((tag, index) => <div key={index} className={styles.tag}>{tag}</div>)}
          </div>

          <div className={styles.bookDescription}>
            {book.bookDescription}
          </div>
          <h2 className={styles.secondaryTitle}>
            About the author
          </h2>
          <div className={styles.authorDescription}>
            {book.authorDescription}
          </div>

        </div>

        <div>
          <figure className={styles.bookImgWrapper}>
            <img src={book.imageLink} alt="" className={styles.bookImg} />
          </figure>
        </div>

      </div>
    </>
  )
}

export default BookPage
