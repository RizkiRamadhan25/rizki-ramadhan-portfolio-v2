import { useLanguage } from "../../context/language-context";
import { profile } from "../../data/profile";

const navigationKeys = ["home", "about", "skills", "projects", "journey", "contact"];

function isPlaceholderLink(link) {
  return !link || link.includes("your-username") || link === "#";
}

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const hasGithub = !isPlaceholderLink(profile.github);
  const hasLinkedin = !isPlaceholderLink(profile.linkedin);

  return (
    <footer className="site-footer">
      <div className="site-footer__inner glass-panel">
        <div className="site-footer__brand">
          <a href="/#home" className="brand-mark">
            <span className="brand-mark__monogram">RR</span>
            <span className="brand-mark__name">{profile.name}</span>
          </a>
          <p>{t.footer.description}</p>
        </div>

        <div>
          <h2>{t.footer.navigation}</h2>
          <ul>
            {navigationKeys.map((key) => (
              <li key={key}>
                <a href={`/#${key}`}>{t.navbar[key]}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>{t.footer.connect}</h2>
          <ul>
            <li>
              {hasGithub ? (
                <a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
              ) : (
                <span>GitHub</span>
              )}
            </li>
            <li>
              {hasLinkedin ? (
                <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
              ) : (
                <span>LinkedIn</span>
              )}
            </li>
            <li><span>{profile.email}</span></li>
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>© {currentYear} {profile.name}. {t.footer.rights}</p>
        <p>{t.footer.builtWith}</p>
      </div>
    </footer>
  );
}
