import { Link } from "react-router";
import { usePageMetadata } from "../hooks/usePageMetadata";

import { useLanguage } from "../context/language-context";

export default function NotFoundPage() {
  const { language, t } = useLanguage();

  usePageMetadata({
    title: `${t.notFound.title} | Rizki Ramadhan`,
    description: t.notFound.description,
    path: window.location.pathname,
    robots: "noindex, nofollow",
    language,
  });

  return (
    <main
      className="
        flex min-h-screen items-center
        justify-center px-6
      "
    >
      <div className="max-w-xl text-center">
        <p
          className="
            font-heading text-7xl font-bold
            text-primary
          "
        >
          {t.notFound.code}
        </p>

        <h1
          className="
            mt-5 font-heading text-3xl font-bold
          "
        >
          {t.notFound.title}
        </h1>

        <p className="mt-4 leading-7 text-muted">
          {t.notFound.description}
        </p>

        <Link
          to="/"
          className="
            mt-8 inline-block rounded-full
            bg-primary px-7 py-3
            font-semibold text-white
          "
        >
          {t.notFound.back}
        </Link>
      </div>
    </main>
  );
}