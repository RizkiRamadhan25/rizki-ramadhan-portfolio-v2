import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { LanguageContext } from "./language-context";

import {
  defaultLanguage,
  supportedLanguages,
  translations,
} from "../locales";

const LANGUAGE_STORAGE_KEY =
  "ramadhan-portfolio-language";

function getInitialLanguage() {
  const savedLanguage = localStorage.getItem(
    LANGUAGE_STORAGE_KEY
  );

  if (supportedLanguages.includes(savedLanguage)) {
    return savedLanguage;
  }

  const browserLanguage =
    navigator.language?.toLowerCase() || "";

  if (browserLanguage.startsWith("id")) {
    return "id";
  }

  return defaultLanguage;
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    getInitialLanguage
  );

  useEffect(() => {
    localStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      language
    );

    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (newLanguage) => {
    if (!supportedLanguages.includes(newLanguage)) {
      console.warn(
        `Unsupported language: ${newLanguage}`
      );

      return;
    }

    setLanguage(newLanguage);
  };

  const value = useMemo(() => {
    const currentTranslation =
      translations[language] || translations.en;

    return {
      language,
      changeLanguage,
      t: currentTranslation,
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}