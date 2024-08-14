import BookInstanceForm from "@/components/BookInstanceForm";
import { useTranslation } from "react-i18next";

export default function BookEdit(){
    const {t} = useTranslation()
    return <BookInstanceForm title={t('EditPhysicalBook')}/>;
}