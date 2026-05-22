import Link from "next/link";
import styles from "./for-you.module.css";

const ForYou = () => {

  return (
    <>
      <div className={styles.title}>
        Selected just for you
      </div>

      <Link href={`/book/`} className={styles.selectedBook}>
        <div className={styles.selectedSubtitle}>

        </div>
        <div className={styles.selectedLine}></div>
        <div className={styles.selectedContent}>
          <figure className={styles.selectedImageWrapper}>
            <img className={styles.bookImage} src="/google.png" alt="" />
          </figure>
          <div className={styles.selectedText}>

          </div>
        </div>
      </Link>
    </>
  )
}

export default ForYou
