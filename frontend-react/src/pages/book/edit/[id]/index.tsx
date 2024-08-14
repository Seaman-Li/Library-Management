import BookForm from "@/components/BookForm";
import { useTranslation } from "react-i18next";

export default function BookEdit(){
    const {t} = useTranslation();

    return <BookForm title={t('EditBook')}/>;
}