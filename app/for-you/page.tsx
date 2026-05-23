import Link from "next/link";
import { Book, BookStatus } from "@/lib/types"
import BookCard from "@/components/bookCard/BookCard";
import styles from "./for-you.module.css";


const getBooks = async (status: BookStatus): Promise<Book[]> => {
  const url = "https://us-central1-summaristt.cloudfunctions.net/getBooks";
  try {
    const res = await fetch(url + "?status=" + status);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${status} books`);
    }
    return res.json();
  } catch (error) {
    console.error(error);
  }
  return [];
}

const ForYou = async () => {
  const selectedBooks = await getBooks("selected");
  const recommendedBooks = await getBooks("recommended");
  const suggestedBooks = await getBooks("suggested");

  const selectedBook = selectedBooks[0];

  return (
    <>
      <div className={styles.title}>
        Selected just for you
      </div>
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
                svg
              </div>
              <div className={styles.selectedDuration}>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <div>
        <div className={styles.title}>
          Recommended For You
        </div>
        <div className={styles.subTitle}>
          We think you'll like these
        </div>
        <div className={styles.cardsWrapper}>

          {recommendedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}

        </div>
      </div>

      <div>
        <div className={styles.title}>
          Suggested Books
        </div>
        <div className={styles.subTitle}>
          Browse these books
        </div>
        <div className={styles.cardsWrapper}>

          {suggestedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}

        </div>
      </div>

    </>
  )
}

export default ForYou
