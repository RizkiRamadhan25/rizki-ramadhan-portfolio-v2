import { useEffect } from "react";
import { motion } from "motion/react";
import { Link, useParams } from "react-router";
import { usePageMetadata } from "../hooks/usePageMetadata";

import ProjectGallery from "../components/project/ProjectGallery";
import SectionHeading from "../components/common/SectionHeading";
import { useLanguage } from "../context/language-context";
import { projectDetails } from "../data/projectDetails";
import { projects } from "../data/projects";
import { siteConfig } from "../data/site";

function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
    >
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

function CodeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
    >
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

function hasValidLink(link) {
  return (
    typeof link === "string" &&
    link.trim() !== "" &&
    link !== "#"
  );
}

export default function ProjectDetailPage() {
  const { slug } = useParams();

  const {
    language,
    t,
  } = useLanguage();

  const projectIndex = projects.findIndex(
    (item) => item.slug === slug
  );

  const project = projects[projectIndex];
  const details = projectDetails[slug];

  const pageDescription = project
    ? project.description[language] ||
      project.description.en
    : t.projectDetail.notFound.description;

  usePageMetadata({
    title: project
      ? `${project.title} | Rizki Ramadhan`
      : `${t.projectDetail.notFound.title} | Rizki Ramadhan`,

    description: pageDescription,

    path: `/projects/${slug}`,

    image: project?.image?.endsWith(".svg")
      ? siteConfig.defaultImage
      : project?.image || siteConfig.defaultImage,

    type: project ? "article" : "website",

    robots: project
      ? "index, follow"
      : "noindex, nofollow",

    language,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [slug]);

  if (!project || !details) {
    return (
      <main
        className="
          flex min-h-screen items-center
          justify-center px-6 pb-24 pt-32
        "
      >
        <div className="max-w-xl text-center">
          <p
            className="
              font-heading text-7xl
              font-bold text-primary
            "
          >
            404
          </p>

          <h1
            className="
              mt-5 font-heading text-3xl
              font-bold
            "
          >
            {t.projectDetail.notFound.title}
          </h1>

          <p
            className="
              mt-4 leading-7 text-muted
            "
          >
            {t.projectDetail.notFound.description}
          </p>

          <Link
            to="/#projects"
            className="
              mt-8 inline-flex rounded-full
              bg-primary px-7 py-3
              font-semibold text-white
            "
          >
            {t.projectDetail.back}
          </Link>
        </div>
      </main>
    );
  }

  const category =
    project.category[language] ||
    project.category.en;

  const description =
    project.description[language] ||
    project.description.en;

  const role =
    details.role[language] ||
    details.role.en;

  const type =
    details.type[language] ||
    details.type.en;

  const overview =
    details.overview[language] ||
    details.overview.en;

  const problem =
    details.problem[language] ||
    details.problem.en;

  const solution =
    details.solution[language] ||
    details.solution.en;

  const learnings =
    details.learnings[language] ||
    details.learnings.en;

  const statusKey =
    project.status === "completed"
      ? "completed"
      : "inProgress";

  const hasRepository = hasValidLink(
    project.repository
  );

  const hasDemo = hasValidLink(
    project.demo
  );

  const previousProject =
    projects[
      (projectIndex - 1 + projects.length) %
        projects.length
    ];

  const nextProject =
    projects[
      (projectIndex + 1) %
        projects.length
    ];

  return (
    <main className="overflow-hidden">
      <section
        className="
          relative px-6 pb-24 pt-36
          sm:px-8 lg:px-12 lg:pb-32
          lg:pt-44
        "
      >
        <div
          className="
            pointer-events-none absolute
            -left-52 top-20 h-[30rem]
            w-[30rem] rounded-full
            bg-primary/15 blur-3xl
          "
        />

        <div
          className="
            pointer-events-none absolute
            -right-52 bottom-0 h-[30rem]
            w-[30rem] rounded-full
            bg-secondary/15 blur-3xl
          "
        />

        <div className="relative mx-auto max-w-7xl">
          <Link
            to="/#projects"
            className="
              inline-flex items-center gap-2
              text-sm font-semibold text-primary
              transition hover:text-accent
            "
          >
            ← {t.projectDetail.back}
          </Link>

          <div
            className="
              mt-12 grid items-start gap-12
              lg:grid-cols-[1.2fr_0.8fr]
            "
          >
            <motion.div
              initial={{
                opacity: 0,
                x: -30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
              }}
            >
              <p
                className="
                  text-sm font-semibold
                  uppercase tracking-[0.18em]
                  text-primary
                "
              >
                {category}
              </p>

              <h1
                className="
                  mt-5 font-heading text-5xl
                  font-bold tracking-tight
                  sm:text-6xl lg:text-7xl
                "
              >
                {project.title}
              </h1>

              <p
                className="
                  mt-7 max-w-3xl text-lg
                  leading-8 text-muted
                "
              >
                {description}
              </p>

              <div
                className="
                  mt-9 flex flex-wrap gap-3
                "
              >
                {hasRepository ? (
                  <a
                    href={project.repository}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      inline-flex items-center
                      gap-2 rounded-full
                      bg-primary px-6 py-3
                      font-semibold text-white
                      shadow-lg shadow-primary/25
                      transition duration-300
                      hover:-translate-y-1
                    "
                  >
                    <CodeIcon />
                    {t.projectDetail.repository}
                  </a>
                ) : (
                  <span
                    className="
                      inline-flex cursor-not-allowed
                      items-center gap-2 rounded-full
                      bg-primary/50 px-6 py-3
                      font-semibold text-white/70
                    "
                  >
                    <CodeIcon />
                    {
                      t.projectDetail
                        .repositoryUnavailable
                    }
                  </span>
                )}

                {hasDemo ? (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      inline-flex items-center
                      gap-2 rounded-full
                      border border-border
                      bg-card/70 px-6 py-3
                      font-semibold
                      transition duration-300
                      hover:-translate-y-1
                      hover:border-primary/50
                    "
                  >
                    <ExternalLinkIcon />
                    {t.projectDetail.liveDemo}
                  </a>
                ) : (
                  <span
                    className="
                      inline-flex cursor-not-allowed
                      items-center gap-2 rounded-full
                      border border-border
                      bg-card/30 px-6 py-3
                      font-semibold text-muted
                      opacity-60
                    "
                  >
                    <ExternalLinkIcon />
                    {
                      t.projectDetail
                        .demoUnavailable
                    }
                  </span>
                )}
              </div>
            </motion.div>

            <motion.aside
              initial={{
                opacity: 0,
                x: 30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.1,
              }}
              className="
                rounded-3xl border border-border
                bg-card/60 p-7
                backdrop-blur-md sm:p-8
              "
            >
              <h2
                className="
                  font-heading text-xl
                  font-semibold
                "
              >
                {
                  t.projectDetail
                    .projectInformation
                }
              </h2>

              <dl className="mt-7 space-y-6">
                <div
                  className="
                    border-b border-border pb-5
                  "
                >
                  <dt className="text-sm text-muted">
                    {t.projectDetail.role}
                  </dt>

                  <dd className="mt-2 font-semibold">
                    {role}
                  </dd>
                </div>

                <div
                  className="
                    border-b border-border pb-5
                  "
                >
                  <dt className="text-sm text-muted">
                    {t.projectDetail.type}
                  </dt>

                  <dd className="mt-2 font-semibold">
                    {type}
                  </dd>
                </div>

                <div
                  className="
                    border-b border-border pb-5
                  "
                >
                  <dt className="text-sm text-muted">
                    {t.projectDetail.year}
                  </dt>

                  <dd className="mt-2 font-semibold">
                    {details.year}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-muted">
                    {t.projectDetail.statusLabel}
                  </dt>

                  <dd
                    className="
                      mt-2 inline-flex
                      rounded-full border
                      border-emerald-400/20
                      bg-emerald-400/10
                      px-3 py-1.5
                      text-sm font-semibold
                      text-emerald-300
                    "
                  >
                    {
                      t.projectDetail.status[
                        statusKey
                      ]
                    }
                  </dd>
                </div>
              </dl>
            </motion.aside>
          </div>

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
            className="
              mt-16 overflow-hidden
              rounded-[2rem]
              border border-border
              bg-card/60 p-3
            "
          >
            <img
              src={project.image}
              alt={`${project.title} preview`}
              width="1200"
              height="750"
              fetchPriority="high"
              decoding="async"
              className="
                aspect-video w-full
                rounded-[1.5rem] object-cover
              "
            />
          </motion.div>
        </div>
      </section>

      <section
        className="
          border-y border-border/70
          bg-surface/30 px-6 py-24
          sm:px-8 lg:px-12 lg:py-32
        "
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={t.projectDetail.overview}
            title={project.title}
            description={overview}
          />

          <div
            className="
              mt-14 grid gap-7
              lg:grid-cols-2
            "
          >
            <article
              className="
                rounded-3xl border border-border
                bg-card/60 p-7 sm:p-8
              "
            >
              <h2
                className="
                  font-heading text-2xl
                  font-bold
                "
              >
                {t.projectDetail.problem}
              </h2>

              <p
                className="
                  mt-5 leading-8 text-muted
                "
              >
                {problem}
              </p>
            </article>

            <article
              className="
                rounded-3xl border
                border-primary/30
                bg-primary/10 p-7 sm:p-8
              "
            >
              <h2
                className="
                  font-heading text-2xl
                  font-bold
                "
              >
                {t.projectDetail.solution}
              </h2>

              <p
                className="
                  mt-5 leading-8 text-muted
                "
              >
                {solution}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        className="
          px-6 py-24 sm:px-8
          lg:px-12 lg:py-32
        "
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={t.projectDetail.features}
            title={t.projectDetail.features}
            description={description}
          />

          <div
            className="
              mt-14 grid gap-6
              md:grid-cols-2
            "
          >
            {details.features.map(
              (feature, index) => (
                <motion.article
                  key={feature.title.en}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.07,
                  }}
                  className="
                    rounded-3xl border
                    border-border bg-card/60
                    p-7 transition
                    hover:border-primary/40
                    sm:p-8
                  "
                >
                  <span
                    className="
                      flex h-11 w-11
                      items-center justify-center
                      rounded-2xl bg-primary/15
                      font-heading font-bold
                      text-primary
                    "
                  >
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <h3
                    className="
                      mt-6 font-heading
                      text-xl font-bold
                    "
                  >
                    {feature.title[language] ||
                      feature.title.en}
                  </h3>

                  <p
                    className="
                      mt-4 leading-7
                      text-muted
                    "
                  >
                    {feature.description[
                      language
                    ] ||
                      feature.description.en}
                  </p>
                </motion.article>
              )
            )}
          </div>
        </div>
      </section>

      <section
        className="
          border-y border-border/70
          bg-surface/30 px-6 py-24
          sm:px-8 lg:px-12 lg:py-32
        "
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={
              t.projectDetail.process
            }
            title={
              t.projectDetail.process
            }
            description={overview}
          />

          <div className="mt-14 space-y-6">
            {details.process.map(
              (step, index) => (
                <motion.article
                  key={step.title.en}
                  initial={{
                    opacity: 0,
                    x: -25,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.07,
                  }}
                  className="
                    grid gap-5 rounded-3xl
                    border border-border
                    bg-card/60 p-7
                    md:grid-cols-[auto_1fr]
                    md:items-start sm:p-8
                  "
                >
                  <span
                    className="
                      flex h-14 w-14
                      items-center justify-center
                      rounded-2xl bg-primary
                      font-heading font-bold
                      text-white
                    "
                  >
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <div>
                    <h3
                      className="
                        font-heading text-xl
                        font-bold
                      "
                    >
                      {step.title[language] ||
                        step.title.en}
                    </h3>

                    <p
                      className="
                        mt-3 leading-7
                        text-muted
                      "
                    >
                      {step.description[
                        language
                      ] ||
                        step.description.en}
                    </p>
                  </div>
                </motion.article>
              )
            )}
          </div>
        </div>
      </section>

      <section
        className="
          px-6 py-24 sm:px-8
          lg:px-12 lg:py-32
        "
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={
              t.projectDetail.challenges
            }
            title={
              t.projectDetail.challenges
            }
            description={solution}
          />

          <div
            className="
              mt-14 grid gap-7
              lg:grid-cols-2
            "
          >
            {details.challenges.map(
              (challenge) => (
                <article
                  key={challenge.title.en}
                  className="
                    rounded-3xl border
                    border-border bg-card/60
                    p-7 sm:p-8
                  "
                >
                  <span
                    className="
                      text-xs font-semibold
                      uppercase tracking-[0.16em]
                      text-amber-300
                    "
                  >
                    {
                      t.projectDetail
                        .challengeLabel
                    }
                  </span>

                  <h3
                    className="
                      mt-3 font-heading
                      text-xl font-bold
                    "
                  >
                    {challenge.title[language] ||
                      challenge.title.en}
                  </h3>

                  <p
                    className="
                      mt-4 leading-7
                      text-muted
                    "
                  >
                    {challenge.description[
                      language
                    ] ||
                      challenge.description.en}
                  </p>

                  <div
                    className="
                      mt-7 rounded-2xl
                      border border-primary/20
                      bg-primary/10 p-5
                    "
                  >
                    <span
                      className="
                        text-xs font-semibold
                        uppercase
                        tracking-[0.16em]
                        text-primary
                      "
                    >
                      {
                        t.projectDetail
                          .resolutionLabel
                      }
                    </span>

                    <p
                      className="
                        mt-3 leading-7
                        text-muted
                      "
                    >
                      {challenge.resolution[
                        language
                      ] ||
                        challenge.resolution.en}
                    </p>
                  </div>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      <section
        className="
          border-y border-border/70
          bg-surface/30 px-6 py-24
          sm:px-8 lg:px-12 lg:py-32
        "
      >
        <div
          className="
            mx-auto grid max-w-7xl
            gap-12 lg:grid-cols-2
          "
        >
          <div>
            <SectionHeading
              eyebrow={
                t.projectDetail.learnings
              }
              title={
                t.projectDetail.learnings
              }
              description={overview}
            />

            <ul className="mt-10 space-y-4">
              {learnings.map((learning) => (
                <li
                  key={learning}
                  className="
                    flex items-start gap-4
                    rounded-2xl border
                    border-border bg-card/60
                    p-5 text-muted
                  "
                >
                  <span
                    className="
                      flex h-7 w-7 shrink-0
                      items-center justify-center
                      rounded-full
                      bg-primary/15
                      font-bold text-primary
                    "
                  >
                    ✓
                  </span>

                  <span className="leading-7">
                    {learning}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2
              className="
                font-heading text-3xl
                font-bold
              "
            >
              {
                t.projectDetail
                  .technologies
              }
            </h2>

            <div
              className="
                mt-8 flex flex-wrap gap-3
              "
            >
              {project.technologies.map(
                (technology) => (
                  <span
                    key={technology}
                    className="
                      rounded-full border
                      border-border bg-card/60
                      px-5 py-3
                      font-medium text-muted
                    "
                  >
                    {technology}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        className="
          px-6 py-24 sm:px-8
          lg:px-12 lg:py-32
        "
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={
              t.projectDetail.gallery
            }
            title={
              t.projectDetail.gallery
            }
            description={
              t.projectDetail
                .galleryDescription
            }
          />

          <ProjectGallery
            screenshots={details.screenshots}
            language={language}
          />
        </div>
      </section>

      <section
        className="
          border-t border-border
          px-6 py-16 sm:px-8 lg:px-12
        "
      >
        <div
          className="
            mx-auto grid max-w-7xl
            gap-5 sm:grid-cols-2
          "
        >
          <Link
            to={`/projects/${previousProject.slug}`}
            className="
              group rounded-3xl border
              border-border bg-card/60
              p-6 transition duration-300
              hover:border-primary/40
            "
          >
            <p className="text-sm text-muted">
              ←{" "}
              {
                t.projectDetail
                  .previousProject
              }
            </p>

            <p
              className="
                mt-2 font-heading text-xl
                font-bold transition
                group-hover:text-primary
              "
            >
              {previousProject.title}
            </p>
          </Link>

          <Link
            to={`/projects/${nextProject.slug}`}
            className="
              group rounded-3xl border
              border-border bg-card/60
              p-6 text-right
              transition duration-300
              hover:border-primary/40
            "
          >
            <p className="text-sm text-muted">
              {
                t.projectDetail.nextProject
              }{" "}
              →
            </p>

            <p
              className="
                mt-2 font-heading text-xl
                font-bold transition
                group-hover:text-primary
              "
            >
              {nextProject.title}
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
