
import Link from "next/link";
import styles from "./for-you.module.css";
import Search from "@/components/search/Search";
import Sidebar from "@/components/sidebar/Sidebar";

const ForYou = () => {

  return (
    <div className="wrapper">
      <Search />
      <div className="sidebar__overlay sidebar__overlay--hidden"></div>
      <Sidebar />

      <div className="row">
        <div className="container">

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

        </div>
      </div>
    </div>
  )
}

export default ForYou
