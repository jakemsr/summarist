"use client";

import { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io"
import { RxHamburgerMenu } from "react-icons/rx";
import { useAppDispatch } from "@/lib/hooks";
import { Book } from "@/lib/types";
import { openSidebar } from "@/lib/features/sidebar/sidebarSlice";
import styles from "./search.module.css";
import SearchBook from "./SearchBook";
import { AiOutlineClose } from "react-icons/ai";


const Search = () => {

  const dispatch = useAppDispatch();

  const [inputValue, setInputValue] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState<string>("");
  const [books, setBooks] = useState<Book[]>(new Array(4).fill(0));
  const [showBooks, setShowBooks] = useState<boolean>(false);
  const [loadingBooks, setLoadingBooks] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  useEffect(() => {
    if (debouncedValue) {
      const getBooks = async (searchText: string) => {
        setLoadingBooks(true);
        const searchURL = "https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=" + searchText;
        const result = await fetch(searchURL);
        const books: Book[] = await result.json();
        setBooks(books);
        setLoadingBooks(false);
      }
      getBooks(debouncedValue);
      setShowBooks(true);
    } else {
      setShowBooks(false);
    }
  }, [debouncedValue]);

  return (
    <div className={styles.background} onClick={() => setInputValue("")}>

      <div className={`${styles.booksWrapper} ${!showBooks && styles.hidden}`}>
        {loadingBooks ? (
          (new Array(4).fill(0)).map((_, index) => (
            <div key={index} className={styles.bookSkeleton}></div>
          ))
        ) : (
          books.length === 0 ? (
            <span onClick={(e) => e.stopPropagation()}>No books found</span>
          ) : (
            books.map((book, index) => (
              <SearchBook key={index} book={book} />
            ))
          )
        )}
      </div>

      <div className={styles.wrapper}>
        <div></div>
        <div className={styles.content}>
          <div className={styles.inputWrapper}>
            <input
              className={styles.input}
              placeholder="Search for books"
              type="text"
              id="searchInput"
              value={inputValue}
              onChange={handleChange}
            />
            <div className={styles.icon}>
              {showBooks ? (
                <AiOutlineClose onClick={() => setInputValue("")} />
              ) : (
                <IoIosSearch />
              )}
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
