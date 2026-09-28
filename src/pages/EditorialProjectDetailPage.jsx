import { useLayoutEffect, useRef } from "react";
import { useParams } from "react-router";
import TransitionLink from "../components/common/TransitionLink";

import { useLanguage } from "../context/language-context";
import EditorialProjectGallery from "../components/project/EditorialProjectGallery";
import { projectArt } from "../data/projectArt";
import { projectDetails } from "../data/projectDetails";
import { projects } from "../data/projects";
import { usePageMetadata } from "../hooks/usePageMetadata";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap";

function DetailSection({ index, label, children, className = "" }) {
  return <section className={`ed-detail-section ${className}`}><div className="ed-detail-section-index">{index} / {label}</div><div className="ed-detail-section-body">{children}</div></section>;
}

export default function EditorialProjectDetailPage() {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const pageRef = useRef(null);
  const index = projects.findIndex((item) => item.slug === slug);
  const project = projects[index];
  const detail = projectDetails[slug];
  const previous = projects[index - 1];
  const next = projects[index + 1];
  const tx = t.projectDetail;

  usePageMetadata({
    title: project ? `${project.title} | Rizki Ramadhan` : `${tx.notFound.title} | Rizki Ramadhan`,
    description: project?.description[language] || tx.notFound.description,
    path: `/projects/${slug}`,
    type: project ? "article" : "website",
    robots: project ? "index, follow" : "noindex, nofollow",
    language,
  });

  useLayoutEffect(() => {
    if (!gsap || !ScrollTrigger || prefersReducedMotion() || !pageRef.current) return undefined;
    const context = gsap.context(() => {
      gsap.fromTo(".ed-detail-hero .ed-detail-enter", { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out" });
      gsap.utils.toArray(".ed-detail-section, .ed-detail-gallery, .ed-detail-navigation").forEach((element) => {
        gsap.fromTo(element, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: element, start: "top 90%", once: true } });
      });
    }, pageRef);
    return () => context.revert();
  }, [slug]);

  if (!project || !detail) return <main className="ed-detail ed-container ed-detail-missing"><span>404 / PROJECT</span><h1>{tx.notFound.title}</h1><p>{tx.notFound.description}</p><TransitionLink className="ed-text-link" to="/#projects">{tx.back} ↗</TransitionLink></main>;

  return (
    <main ref={pageRef} className="ed-detail">
      <div className="ed-container">
        <div className="ed-detail-hero">
          <TransitionLink className="ed-detail-back ed-detail-enter" to="/#projects">← {tx.back}</TransitionLink>
          <div className="ed-detail-hero-meta ed-detail-enter"><span>PROJECT / 0{index + 1}</span><span>{detail.year}</span><span>{project.status === "completed" ? tx.status.completed : tx.status.inProgress}</span></div>
          <h1 className="ed-detail-enter">{project.title}<span>.</span></h1>
          <div className="ed-detail-hero-bottom ed-detail-enter"><p>{project.description[language]}</p><span>{project.category[language]}</span></div>
        </div>
        <div className="ed-detail-art"><img src={projectArt[slug]} alt={`${project.title} project preview`} /><span>FIG. 0{index + 1} / {project.title.toUpperCase()}</span></div>
        <div className="ed-detail-facts"><div><span>{tx.role}</span><strong>{detail.role[language]}</strong></div><div><span>{tx.type}</span><strong>{detail.type[language]}</strong></div><div><span>{tx.year}</span><strong>{detail.year}</strong></div><div><span>{tx.statusLabel}</span><strong>{project.status === "completed" ? tx.status.completed : tx.status.inProgress}</strong></div></div>

        <DetailSection index="01" label={tx.overview}><h2>{tx.overview}<span className="ed-orange">.</span></h2><p className="ed-detail-lead">{detail.overview[language]}</p></DetailSection>
        <DetailSection index="02" label={tx.problem}><h2>{tx.problem}<span className="ed-orange">.</span></h2><p>{detail.problem[language]}</p></DetailSection>
        <DetailSection index="03" label={tx.solution}><h2>{tx.solution}<span className="ed-orange">.</span></h2><p>{detail.solution[language]}</p></DetailSection>
        <DetailSection index="04" label={tx.features}><h2>{tx.features}<span className="ed-orange">.</span></h2><div className="ed-detail-list">{detail.features.map((feature, itemIndex) => <div key={itemIndex}><span>0{itemIndex + 1}</span><div><h3>{feature.title[language]}</h3><p>{feature.description[language]}</p></div></div>)}</div></DetailSection>
        <DetailSection index="05" label={tx.process}><h2>{tx.process}<span className="ed-orange">.</span></h2><div className="ed-detail-list">{detail.process.map((step, itemIndex) => <div key={itemIndex}><span>0{itemIndex + 1}</span><div><h3>{step.title[language]}</h3><p>{step.description[language]}</p></div></div>)}</div></DetailSection>
        <DetailSection index="06" label={tx.challenges}><h2>{tx.challenges}<span className="ed-orange">.</span></h2><div className="ed-detail-list">{detail.challenges.map((challenge, itemIndex) => <div key={itemIndex}><span>0{itemIndex + 1}</span><div><h3>{challenge.title[language]}</h3><p><b>{tx.challengeLabel} / </b>{challenge.description[language]}</p><p><b>{tx.resolutionLabel} / </b>{challenge.resolution[language]}</p></div></div>)}</div></DetailSection>
        <DetailSection index="07" label={tx.learnings}><h2>{tx.learnings}<span className="ed-orange">.</span></h2><ul className="ed-detail-learnings">{detail.learnings[language].map((learning, itemIndex) => <li key={learning}><span>0{itemIndex + 1}</span>{learning}</li>)}</ul></DetailSection>
        <DetailSection index="08" label={tx.technologies}><h2>{tx.technologies}<span className="ed-orange">.</span></h2><div className="ed-detail-tech">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div><div className="ed-detail-resources"><span>{project.repository ? <a href={project.repository} target="_blank" rel="noreferrer">{tx.repository} ↗</a> : tx.repositoryUnavailable}</span><span>{project.demo ? <a href={project.demo} target="_blank" rel="noreferrer">{tx.liveDemo} ↗</a> : tx.demoUnavailable}</span></div></DetailSection>
        <div className="ed-detail-gallery"><div className="ed-detail-section-index">09 / {tx.gallery}</div><div><h2>{tx.gallery}<span className="ed-orange">.</span></h2><p>{tx.galleryDescription}</p><EditorialProjectGallery key={slug} screenshots={detail.screenshots} language={language} projectTitle={project.title} /></div></div>
        <nav className="ed-detail-navigation" aria-label="Project navigation"><div>{previous && <TransitionLink to={`/projects/${previous.slug}`}><span>← {tx.previousProject}</span><strong>{previous.title}</strong></TransitionLink>}</div><div>{next && <TransitionLink to={`/projects/${next.slug}`}><span>{tx.nextProject} →</span><strong>{next.title}</strong></TransitionLink>}</div></nav>
      </div>
      <footer className="ed-footer ed-container"><TransitionLink className="ed-footer-logo" to="/#home" data-cursor="TOP">RR<span>.</span></TransitionLink><span>© 2026 Rizki Ramadhan. {t.footer.rights}</span><span>JAKARTA / INDONESIA</span><TransitionLink to="/#home" data-cursor="TOP">{t.navbar.home} ↑</TransitionLink></footer>
    </main>
  );
}
