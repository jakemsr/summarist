"use client";

import { Suspense, useEffect, useState } from "react";
import { Library, Book } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { firebaseGetLibrary } from "@/lib/firebase";
import { openModal } from "@/lib/features/modal/modalSlice";
import Recommended from "@/components/forYouPage/Recommended";
import RecommendedSkeleton from "@/components/forYouPage/RecommendedSkeleton";
import styles from "./library.module.css"


const getBook = async (bookId: string): Promise<Book> => {
  try {
    const res = await fetch(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${bookId}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch book ${bookId}`);
    }
    return res.json();
  } catch (error) {
    console.error(error);
  }
  return {} as Book;
}


const page = () => {

  const dispatch = useAppDispatch();

  const user = useAppSelector(state => state.user);

  const [library, setLibrary] = useState<Library | null>(null);
  const [savedPromises, setSavedPromises] = useState<Promise<Book[]>>();
  const [finishedPromises, setFinishedPromises] = useState<Promise<Book[]>>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getLibrary = async () => {
      if (!user.isLoggedIn) {
        setLoading(false);
        return;
      }
      const myLibrary = await firebaseGetLibrary(user.firebaseUID);
      setLibrary(myLibrary);
    }
    getLibrary();
  }, [user]);

  useEffect(() => {
    if (!library) {
      setLoading(false);
      return;
    }
    if (library.savedBooks && library.savedBooks.length > 0) {
      const savedArr: Promise<Book>[] = [];
      library.savedBooks.forEach((bookId) => {
        savedArr.push(getBook(bookId));
      });
      setSavedPromises(Promise.all(savedArr));
    }
    if (library.finishedBooks && library.finishedBooks.length > 0) {
      const finishedArr: Promise<Book>[] = [];
      library.finishedBooks.forEach((bookId) => {
        finishedArr.push(getBook(bookId));
      });
      setFinishedPromises(Promise.all(finishedArr));
    }
    setLoading(false);
  }, [library]);


  return (
    <>
      {user.isLoggedIn ? (
        <>
          <div className={styles.title}>
            Saved Books
          </div>
          {loading ? (
            <div className={styles.loaderCenter}>
              <div className={styles.loader}></div>
            </div>
          ) : (
            <>
              {library && library.savedBooks && savedPromises ? (
                <>
                  <div className={styles.subTitle}>
                    {library.savedBooks.length} items
                  </div>
                  <Suspense fallback={<RecommendedSkeleton />}>
                    <Recommended books={savedPromises} />
                  </Suspense>
                </>
              ) : (
                <>
                  <div className={styles.subTitle}>
                    0 items
                  </div>
                  <div className={styles.booksBlockWrapper}>
                    <div className={styles.booksBlockTitle}>
                      Save your favorite books!
                    </div>
                    <div className={styles.booksBlockSubTitle}>
                      When you save a book, it will appear here.
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          <div className={styles.title}>
            Finished
          </div>
          {loading ? (
            <div className={styles.loaderCenter}>
              <div className={styles.loader}></div>
            </div>
          ) : (
            <>
              {library && library.finishedBooks && finishedPromises ? (
                <>
                  <div className={styles.subTitle}>
                    {library.finishedBooks.length} items
                  </div>
                  <Suspense fallback={<RecommendedSkeleton />}>
                    <Recommended books={finishedPromises} />
                  </Suspense>
                </>
              ) : (
                <>
                  <div className={styles.subTitle}>
                    0 items
                  </div>
                  <div className={styles.booksBlockWrapper}>
                    <div className={styles.booksBlockTitle}>
                      Done and dusted!
                    </div>
                    <div className={styles.booksBlockSubTitle}>
                      When you finish a book, you can find it here later.
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </>
      ) : (
        <div className={styles.wrapper}>
          <img src="/login.png" alt="login" />
          <div className={styles.loginText}>
            Log in to your account to see your library
          </div>
          <button className={styles.loginBtn} onClick={() => dispatch(openModal())}>Login</button>
        </div>
      )}
    </>
  )
}

export default page
