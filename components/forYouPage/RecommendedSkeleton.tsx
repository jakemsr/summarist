import BookCardSkeleton from "../bookCard/BookCardSkeleton";
import styles from "./for-you.module.css";

const RecommendedSkeleton = () => {
  return (
    <div className={styles.cardsWrapper}>

      {(new Array(6).fill(0)).map((_, index) => (
        <BookCardSkeleton key={index} />
      ))}

    </div>
  )
}

export default RecommendedSkeleton
