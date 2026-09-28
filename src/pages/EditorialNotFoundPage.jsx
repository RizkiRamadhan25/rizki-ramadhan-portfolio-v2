import { Link } from "react-router";
import { useLanguage } from "../context/language-context";
import { usePageMetadata } from "../hooks/usePageMetadata";

export default function EditorialNotFoundPage() {
  const { language, t } = useLanguage();
  usePageMetadata({ title: `${t.notFound.title} | Rizki Ramadhan`, description: t.notFound.description, path: "/404", robots: "noindex, nofollow", language });
  return <main className="ed-detail ed-container ed-detail-missing"><span>ERROR / {t.notFound.code}</span><h1>404<span>.</span></h1><h2>{t.notFound.title}</h2><p>{t.notFound.description}</p><Link to="/#home" className="ed-text-link">← {t.notFound.back}</Link></main>;
}
