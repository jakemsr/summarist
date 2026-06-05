import { Suspense } from "react";
import { Book } from "@/lib/types";
import PlayerPage from "@/components/player/PlayerPage";
import styles from "@/components/player/player.module.css";


const getBook = async (bookId: string): Promise<Book> => {
  try {
    const res = await fetch(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${bookId}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch book ${bookId}`);
    }
    return res.json();
  } catch (error) {
    console.error(error);
  }
  return {} as Book;
}

const Player = async ({ params }: { params: Promise<{ bookId: string }> }) => {

  const { bookId } = await params;

  const book = getBook(bookId);

  return (
    <Suspense fallback={<div className={styles.loaderCenter}><div className={styles.loader}></div></div>}>
      <PlayerPage bookPromise={book} />
    </Suspense>
  )
}

export default Player
