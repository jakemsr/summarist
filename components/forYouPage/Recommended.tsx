"use client";

import { use } from "react";
import BookCard from "@/components/bookCard/BookCard";
import { Book } from "@/lib/types";
import styles from "./for-you.module.css";

const Recommended = ({ books }: { books: Promise<Book[]> }) => {

  const recommendedBooks = use(books);

  return (
    <div className={styles.cardsWrapper}>

      {recommendedBooks.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}

    </div>
  )
}

export default Recommended
