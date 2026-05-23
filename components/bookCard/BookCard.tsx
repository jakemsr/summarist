import Link from "next/link";
import { BsStarFill } from "react-icons/bs";
import { Book } from "@/lib/types";
import styles from "./bookCard.module.css";


const BookCard = ({book}: {book: Book}) => {
  return (
    <Link href={`/book/${book.id}`} className={styles.bookLink}>
      {book.subscriptionRequired && (
        <div className={styles.bookPill}>Premium</div>
      )}
      <audio src={book.audioLink}></audio>
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
            svg
          </div>
          <div className={styles.bookDetailsText}>
          </div>
        </div>
        <div className={styles.bookDetails}>
          <div className={styles.bookDetailsIcon}>
            <BsStarFill />
          </div>
          <div className={styles.bookDetailsText}>
            {book.averageRating}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default BookCard
