import { IoIosSearch } from "react-icons/io"
import styles from "./search.module.css";

const Search = () => {
  return (
    <div className={styles.background}>
      <div className={styles.wrapper}>
        <div></div>
        <div className={styles.content}>
          <div className={styles.inputWrapper}>
            <input
              className={styles.input}
              placeholder="Search for books"
              type="text"
              id="searchInput"
            />
            <div className={styles.icon}>
              <IoIosSearch className={styles.svg} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search
