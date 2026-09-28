import { Link } from "react-router";

import { useLanguage } from "../../context/language-context";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12H19M13 6L19 12L13 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 9L5 12L8 15M16 9L19 12L16 15M14 5L10 19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 5H19V10M19 5L11 13M10 6H7C5.9 6 5 6.9 5 8V17C5 18.1 5.9 19 7 19H16C17.1 19 18 18.1 18 17V14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function hasValidLink(link) {
  return typeof link === "string" && link.trim() !== "" && link !== "#";
}

export default function ProjectCard({ project, index }) {
  const { language, t } = useLanguage();

  const category = project.category[language] || project.category.en;
  const description = project.description[language] || project.description.en;
  const hasRepository = hasValidLink(project.repository);
  const hasDemo = hasValidLink(project.demo);
  const isCompleted = project.status === "completed";

  return (
    <article className="project-card glass-panel" data-project-card>
      <div className="project-card__media">
        <div className="project-card__media-mask">
          <img
            src={project.image}
            alt={`${project.title} project preview`}
            width="1200"
            height="750"
            loading="lazy"
            decoding="async"
            data-project-image
          />
        </div>

        <div className="project-card__media-meta">
          <span>{t.projects.featured}</span>
          <strong>{String(index + 1).padStart(2, "0")}</strong>
        </div>
      </div>

      <div className="project-card__body">
        <div className="project-card__meta">
          <p>{category}</p>

          <span className={`project-status ${isCompleted ? "is-completed" : "is-progress"}`}>
            <i aria-hidden="true" />
            {isCompleted ? t.projects.completed : t.projects.inProgress}
          </span>
        </div>

        <h3>{project.title}</h3>
        <p className="project-card__description">{description}</p>

        <div className="project-card__tech">
          <p>{t.projects.technologies}</p>
          <div>
            {project.technologies.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
        </div>

        <div className="project-card__actions">
          <Link to={`/projects/${project.slug}`} className="project-card__primary-link">
            {t.projects.viewDetails}
            <ArrowIcon />
          </Link>

          {hasRepository ? (
            <a href={project.repository} target="_blank" rel="noreferrer">
              <CodeIcon />
              {t.projects.sourceCode}
            </a>
          ) : (
            <span className="is-disabled">
              <CodeIcon />
              {t.projects.repositoryUnavailable}
            </span>
          )}

          {hasDemo ? (
            <a href={project.demo} target="_blank" rel="noreferrer">
              <ExternalLinkIcon />
              {t.projects.liveDemo}
            </a>
          ) : (
            <span className="is-disabled">
              <ExternalLinkIcon />
              {t.projects.demoUnavailable}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
