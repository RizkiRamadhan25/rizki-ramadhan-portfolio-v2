import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { useLanguage } from "../../context/language-context";

const STORAGE_KEY = "rizki-portfolio-theme";

export default function ThemeSwitcher() {
  const { language } = useLanguage();
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  const transitionTimer = useRef(0);

  useEffect(() => () => {
    window.clearTimeout(transitionTimer.current);
    document.documentElement.classList.remove("ed-theme-animating");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    const applyTheme = () => {
      document.documentElement.dataset.theme = nextTheme;
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", nextTheme === "dark" ? "#171715" : "#edeae2");
      try { window.localStorage.setItem(STORAGE_KEY, nextTheme); } catch { /* Storage may be unavailable. */ }
      flushSync(() => setTheme(nextTheme));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.remove("ed-theme-animating");
      applyTheme();
      return;
    }

    document.documentElement.classList.add("ed-theme-animating");
    document.documentElement.getBoundingClientRect();
    applyTheme();
    window.clearTimeout(transitionTimer.current);
    transitionTimer.current = window.setTimeout(() => document.documentElement.classList.remove("ed-theme-animating"), 650);
  };

  const label = language === "id"
    ? (theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap")
    : (theme === "dark" ? "Switch to light mode" : "Switch to dark mode");

  return (
    <button type="button" className="ed-theme-switch" onClick={toggleTheme} aria-label={label} aria-pressed={theme === "dark"} title={label}>
      <svg className="ed-theme-switch__moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.1 16.4A8.5 8.5 0 0 1 7.6 3.9a8.5 8.5 0 1 0 12.5 12.5Z" /></svg>
      <svg className="ed-theme-switch__sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
    </button>
  );
}
