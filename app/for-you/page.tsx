import { Suspense } from "react";
import SelectedSkeleton from "@/components/forYouPage/SelectedSkeleton";
import Selected from "@/components/forYouPage/Selected";
import RecommendedSkeleton from "@/components/forYouPage/RecommendedSkeleton";
import Recommended from "@/components/forYouPage/Recommended";
import { Book, BookStatus } from "@/lib/types"
import styles from "@/components/forYouPage/for-you.module.css";


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

const Page = async () => {
  const selectedBooks = getBooks("selected");
  const recommendedBooks = getBooks("recommended");
  const suggestedBooks = getBooks("suggested");


  return (
    <>
      <div className={styles.title}>
        Selected just for you
      </div>

      <Suspense fallback={<SelectedSkeleton/>}>
        <Selected books={selectedBooks} />
      </Suspense>

      <div>
        <div className={styles.title}>
          Recommended For You
        </div>
        <div className={styles.subTitle}>
          We think you'll like these
        </div>

        <Suspense fallback={<RecommendedSkeleton />}>
          <Recommended books={recommendedBooks} />
        </Suspense>

      </div>

      <div>
        <div className={styles.title}>
          Suggested Books
        </div>
        <div className={styles.subTitle}>
          Browse these books
        </div>

        <Suspense fallback={<RecommendedSkeleton />}>
          <Recommended books={suggestedBooks} />
        </Suspense>

      </div>

    </>
  )
}

export default Page
