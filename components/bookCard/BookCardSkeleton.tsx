import styles from "./bookCard.module.css";

const BookCardSkeleton = () => {
  return (
    <div className={styles.bookLink}>
      <div className={styles.bookImageWrapper}>
        <div className={styles.bookImageSkeleton}>
        </div>
      </div>
      <div className={styles.bookTitleSkeleton}>
      </div>
      <div className={styles.bookAuthorSkeleton}>
      </div>
      <div className={styles.bookSubTitleSkeleton}>
      </div>
      <div className={styles.bookDetailsWrapper}>
        <div className={styles.bookDetailsSkeleton}>
        </div>
        <div className={styles.bookDetailsSkeleton}>
        </div>
      </div>
    </div>
  )
}

export default BookCardSkeleton
