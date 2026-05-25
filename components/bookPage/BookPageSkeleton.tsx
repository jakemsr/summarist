import styles from "./bookPage.module.css";


const BookPageSkeleton = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.titleSkeleton}>
        </div>
        <div className={styles.authorSkeleton}>
        </div>
        <div className={styles.subTitleSkeleton}>
        </div>
        <div className={styles.innerWrapper}>
          <div className={styles.innerDescriptionWrapper}>
            <div className={styles.innerDescriptionSkeleton}>
            </div>
            <div className={styles.innerDescriptionSkeleton}>
            </div>
            <div className={styles.innerDescriptionSkeleton}>
            </div>
            <div className={styles.innerDescriptionSkeleton}>
            </div>
          </div>
        </div>
        <div className={styles.readBtnWrapper}>
          <div className={styles.readBtnSkeleton}>
          </div>
          <div className={styles.readBtnSkeleton}>
          </div>
        </div>
        <div className={styles.bookMarkSkeleton}>
        </div>
        <div className={styles.secondaryTitleSkeleton}>
        </div>
        <div className={styles.bookDescriptionSkeleton}>
        </div>
        <h2 className={styles.secondaryTitleSkeleton}>
        </h2>
        <div className={styles.bookDescriptionSkeleton}>
        </div>
      </div>
      <div>
        <div className={styles.bookImgWrapper}>
          <div className={styles.bookImgSkeleton}>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookPageSkeleton
