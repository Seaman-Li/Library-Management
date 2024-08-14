import BookForm from "@/components/BookForm";
import { useTranslation } from "react-i18next";


export default function AddBook() {

  const {t} = useTranslation();

  return <BookForm title={t('AddBook')}/>;
}
