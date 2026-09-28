import { useEffect, useState } from "react";
import { Outlet } from "react-router";

import LanguageSwitcher from "../components/common/LanguageSwitcher";
import ThemeSwitcher from "../components/common/ThemeSwitcher";
import EditorialCursor from "../components/common/EditorialCursor";
import ScrollManager from "../components/common/ScrollManager";
import SmoothScroll from "../components/common/SmoothScroll";
import PageTransition from "../components/common/PageTransition";
import FirstVisitLoader from "../components/common/FirstVisitLoader";
import TransitionLink from "../components/common/TransitionLink";
import { useLanguage } from "../context/language-context";

const sections = ["projects", "about", "skills", "journey", "contact"];

export default function MainLayout() {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("ed-menu-open", menuOpen);
    return () => document.body.classList.remove("ed-menu-open");
  }, [menuOpen]);

  return (
    <PageTransition><div className="ed-site">
      <header className="ed-header">
        <TransitionLink className="ed-brand" to="/#home" data-cursor="TOP" aria-label="Rizki Ramadhan — home">
          R<span>R</span><span className="ed-brand-dot">.</span>
        </TransitionLink>
        <div className="ed-header-edition">PORTFOLIO <span>—</span> 2026</div>
        <nav id="ed-main-navigation" className={`ed-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          {sections.map((section, index) => (
            <TransitionLink key={section} to={`/#${section}`} data-cursor={t.navbar[section]} onClick={() => setMenuOpen(false)} style={{ "--nav-open-delay": `${0.16 + index * 0.085}s`, "--nav-close-delay": `${(sections.length - index - 1) * 0.07}s` }}>
              <span className="ed-nav-number">0{index + 1}</span>{t.navbar[section]}
            </TransitionLink>
          ))}
        </nav>
        <div className="ed-header-actions">
          <ThemeSwitcher />
          <LanguageSwitcher />
          <button type="button" className={`ed-menu-button ${menuOpen ? "is-open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="ed-main-navigation">
            <span /><span />
          </button>
        </div>
      </header>
      <EditorialCursor />
      <FirstVisitLoader />
      <SmoothScroll />
      <ScrollManager />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Outlet />
        </div>
      </div>
    </div></PageTransition>
  );
}
