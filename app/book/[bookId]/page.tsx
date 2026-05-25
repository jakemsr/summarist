import { Suspense } from "react";
import { Book } from "@/lib/types";
import BookPage from "@/components/bookPage/BookPage";
import BookPageSkeleton from "@/components/bookPage/BookPageSkeleton";


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

const Page = async ({ params }: { params: Promise<{ bookId: string }> }) => {

  const { bookId } = await params;

  const book = getBook(bookId);

  return (
    <Suspense fallback={<BookPageSkeleton />}>
      <BookPage bookPromise={book} />
    </Suspense>
  )
}

export default Page
