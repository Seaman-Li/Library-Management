import BookForm from "@/components/BookForm";
import { Inter } from "next/font/google";


const inter = Inter({ subsets: ["latin"] });

export default function AddBook() {
  return <BookForm  title="借阅添加"/>;
}
