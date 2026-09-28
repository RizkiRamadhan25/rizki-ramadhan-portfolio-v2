import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import TransitionLink from "../components/common/TransitionLink";

import { useLanguage } from "../context/language-context";
import { journeyItems } from "../data/journey";
import { profile } from "../data/profile";
import { projectArt } from "../data/projectArt";
import { projects } from "../data/projects";
import { skillGroups } from "../data/skills";
import { usePageMetadata } from "../hooks/usePageMetadata";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap";

const youtubeUrl = "https://youtu.be/jOkEioAkGPU";
const instagramUrl = "https://www.instagram.com/rizkirama_25/?hl=en";

const learningCopy = {
  id: {
    heading: ["BELAJAR", "LEWAT", "PROYEK"],
    supporting: "Saya belajar dengan membangun sesuatu yang nyata.",
    index: "01 / CATATAN BELAJAR",
    title: "Belajar Python dengan Membangun",
    body: "Langkah pertama saya lahir dari eksperimen dan proyek.",
    watch: "Tonton di YouTube",
    introduction: "Nama saya Rizki Ramadhan. Saya mahasiswa Teknik Informatika yang tertarik pada web development, software engineering, data science, dan artificial intelligence.",
    aboutTitle: "Belajar teknologi dengan membangun sesuatu yang bermakna.",
  },
  en: {
    heading: ["LEARNING", "BY", "DOING"],
    supporting: "I don't just learn it. I build it.",
    index: "01 / LEARNING LOG",
    title: "Learning Python by Building",
    body: "My first steps weren't courses. They were experiments.",
    watch: "Watch on YouTube",
    introduction: "My name is Rizki Ramadhan. I am an Informatics Engineering student interested in web development, software engineering, data science, and artificial intelligence.",
    aboutTitle: "Learning technology by building something meaningful.",
  },
};

function SectionLabel({ number, children }) {
  return <div className="ed-section-label"><span>{number}</span><span>{children}</span></div>;
}

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true" className="ed-arrow">{diagonal ? "↗" : "→"}</span>;
}

function ContactForm({ t }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    const body = `${form.message}\n\n${form.name}\n${form.email}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className="ed-contact-form" onSubmit={submit}>
      <div className="ed-form-heading"><span>{t.contact.formTitle}</span><span>↘</span></div>
      <p>{t.contact.formDescription}</p>
      <div className="ed-form-grid">
        <label>{t.contact.form.name}<input name="name" value={form.name} onChange={update} placeholder={t.contact.form.namePlaceholder} required /></label>
        <label>{t.contact.form.email}<input name="email" type="email" value={form.email} onChange={update} placeholder={t.contact.form.emailPlaceholder} required /></label>
      </div>
      <label>{t.contact.form.subject}<input name="subject" value={form.subject} onChange={update} placeholder={t.contact.form.subjectPlaceholder} required /></label>
      <label>{t.contact.form.message}<textarea name="message" rows="4" value={form.message} onChange={update} placeholder={t.contact.form.messagePlaceholder} required /></label>
      <button type="submit" className="ed-form-submit">{t.contact.form.send}<Arrow diagonal /></button>
    </form>
  );
}

export default function EditorialHomePage() {
  const { language, t } = useLanguage();
  const copy = learningCopy[language] || learningCopy.en;
  const rootRef = useRef(null);
  const previewRef = useRef(null);
  const previewImageRef = useRef(null);

  usePageMetadata({ title: t.metadata.title, description: t.metadata.description, path: "/", language });

  useLayoutEffect(() => {
    if (!gsap || !ScrollTrigger || prefersReducedMotion() || !rootRef.current) return undefined;
    const context = gsap.context(() => {
      gsap.fromTo(".ed-hero .ed-reveal", { y: 42, opacity: 0 }, { y: 0, opacity: 1, duration: 1.05, stagger: 0.12, ease: "power3.out", delay: 0.1 });
      gsap.fromTo(".ed-hero-portrait", { y: 70, opacity: 0, rotate: -3 }, { y: 0, opacity: 1, rotate: 0, duration: 1.25, ease: "power3.out", delay: 0.25 });
      gsap.to(".ed-hero-disc", { yPercent: 18, rotate: 16, ease: "none", scrollTrigger: { trigger: ".ed-hero", start: "top top", end: "bottom top", scrub: 1.2 } });
      gsap.utils.toArray(".ed-scroll-reveal").forEach((element) => {
        gsap.fromTo(element, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: "power2.out", scrollTrigger: { trigger: element, start: "top 88%", once: true } });
      });
      gsap.utils.toArray(".ed-work-row").forEach((row) => {
        gsap.fromTo(row, { x: -28, opacity: 0 }, { x: 0, opacity: 1, duration: 0.72, ease: "power2.out", scrollTrigger: { trigger: row, start: "top 92%", once: true } });
      });
    }, rootRef);
    return () => context.revert();
  }, []);

  const movePreview = (event) => {
    if (!previewRef.current || !gsap || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    gsap.to(previewRef.current, { x: event.clientX + 26, y: event.clientY - 110, duration: 0.35, ease: "power3.out" });
  };
  const showPreview = (project) => {
    if (!previewRef.current || !previewImageRef.current || !gsap) return;
    previewImageRef.current.src = projectArt[project.slug];
    previewImageRef.current.alt = project.title;
    gsap.to(previewRef.current, { opacity: 1, scale: 1, duration: 0.25, ease: "power2.out" });
  };
  const hidePreview = () => {
    if (previewRef.current && gsap) gsap.to(previewRef.current, { opacity: 0, scale: 0.92, duration: 0.2 });
  };

  return (
    <main ref={rootRef} className="ed-home">
      <section id="home" className="ed-hero ed-container">
        <div className="ed-hero-topline ed-reveal"><span>INDEPENDENT PORTFOLIO <span className="ed-orange">✳</span> 2026</span><span>JAKARTA, INDONESIA</span></div>
        <div className="ed-hero-grid">
          <div className="ed-hero-art" aria-label="Portrait of Rizki Ramadhan">
            <div className="ed-hero-disc" />
            <img className="ed-hero-portrait" src="/images/profile-cutout.png" alt="Rizki Ramadhan holding a camera" />
            <span className="ed-hero-art-note">FIG. 01 — RIZKI / RAMADHAN</span>
          </div>
          <div className="ed-hero-copy">
            <div className="ed-overline ed-reveal">{t.hero.greeting} <span className="ed-orange">✳</span></div>
            <h1 className="ed-hero-name ed-reveal">RIZKI<br /><span>RAMA</span>DHAN<span className="ed-orange">.</span></h1>
            <div className="ed-hero-role ed-reveal"><span className="ed-role-mark">↳</span><span>{t.hero.role}</span></div>
            <p className="ed-hero-description ed-reveal">{t.hero.tagline} {t.hero.description}</p>
            <Link className="ed-text-link ed-reveal" to="/#projects" data-cursor="GO">{t.hero.viewProjects}<Arrow diagonal /></Link>
          </div>
        </div>
        <div className="ed-hero-bottomline ed-reveal"><span>SCROLL TO EXPLORE ↓</span><span>01 / 06</span></div>
      </section>

      <section className="ed-learning ed-container" aria-labelledby="learning-heading">
        <SectionLabel number="00 / 06">{copy.index}</SectionLabel>
        <div className="ed-learning-grid">
          <div className="ed-learning-copy ed-scroll-reveal">
            <p className="ed-kicker">THE METHOD / CARA BELAJAR</p>
            <h2 id="learning-heading">{copy.heading.map((line, index) => <span key={line} className={index === 1 ? "ed-outline-word" : ""}>{line}</span>)}</h2>
            <p>{copy.supporting}</p>
            <div className="ed-learning-caption"><span>{copy.title}</span><span>{copy.body}</span></div>
            <a href={youtubeUrl} target="_blank" rel="noreferrer" className="ed-text-link" data-cursor="WATCH">{copy.watch}<Arrow diagonal /></a>
          </div>
          <div className="ed-learning-media ed-scroll-reveal">
            <video src="/videos/learning-python-preview.mp4" autoPlay loop muted playsInline preload="metadata" aria-label={copy.title} />
            <div className="ed-media-caption"><span>PLAY / 001</span><span>YouTube : Rizki Ramadhan</span></div>
          </div>
        </div>
      </section>

      <section id="projects" className="ed-section ed-projects ed-container">
        <SectionLabel number="01 / 06">{t.projects.eyebrow}</SectionLabel>
        <div className="ed-section-intro ed-scroll-reveal"><h2>{language === "id" ? <>PILIHAN <em>KARYA</em></> : <>SELECTED <em>WORK</em></>}</h2><div><strong className="ed-intro-original">{t.projects.title}</strong><p>{t.projects.description}</p></div></div>
        <div className="ed-work-index" onMouseMove={movePreview} onMouseLeave={hidePreview}>
          {projects.map((project, index) => (
            <TransitionLink key={project.slug} className="ed-work-row" to={`/projects/${project.slug}`} data-cursor="VIEW" onMouseEnter={() => showPreview(project)} onFocus={() => showPreview(project)} onBlur={hidePreview}>
              <span className="ed-work-number">0{index + 1}</span>
              <span className="ed-work-main"><strong>{project.title}</strong><small>{project.description[language]}</small><img className="ed-work-mobile-image" src={projectArt[project.slug]} alt="" loading="lazy" /></span>
              <span className="ed-work-category">{project.category[language]}<small>{project.status === "completed" ? t.projects.completed : t.projects.inProgress}</small></span>
              <Arrow diagonal />
            </TransitionLink>
          ))}
        </div>
        <div className="ed-projects-footnote">[ 05 ] {language === "id" ? "PROYEK / EKSPERIMEN / PROSES" : "PROJECTS / EXPERIMENTS / PROCESS"}</div>
      </section>

      <section id="about" className="ed-section ed-about ed-container">
        <SectionLabel number="02 / 06">{t.about.eyebrow}</SectionLabel>
        <div className="ed-about-grid">
          <div className="ed-about-statement ed-scroll-reveal"><span className="ed-asterisk">✳</span><h2>{copy.aboutTitle}</h2></div>
          <div className="ed-about-info ed-scroll-reveal"><p className="ed-about-lead">{copy.introduction}</p><p>{t.about.description}</p><p>{t.about.paragraphTwo}</p><div className="ed-focus"><span className="ed-kicker">{t.about.focusTitle}</span>{t.about.focusItems.map((item, index) => <div key={item}><span>0{index + 1}</span>{item}</div>)}</div></div>
        </div>
        <div className="ed-stats">{t.about.stats.map((stat) => <div key={stat.label} className="ed-scroll-reveal"><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div>
      </section>

      <section id="skills" className="ed-section ed-skills ed-container">
        <SectionLabel number="03 / 06">{t.skills.eyebrow}</SectionLabel>
        <div className="ed-section-intro ed-scroll-reveal"><h2>{language === "id" ? <>PERANGKAT <em>KERJA</em></> : <>THE <em>TOOLKIT</em></>}</h2><div><strong className="ed-intro-original">{t.skills.title}</strong><p>{t.skills.description}</p></div></div>
        <div className="ed-skills-list">{skillGroups.map((group, index) => <div key={group.id} className="ed-skill-row ed-scroll-reveal"><div className="ed-skill-heading"><span>0{index + 1} /</span><h3>{group.title[language]}</h3></div><div className="ed-skill-tags">{group.items.map((item) => <span key={item}>{item}</span>)}</div></div>)}</div>
      </section>

      <section id="journey" className="ed-section ed-journey ed-container">
        <SectionLabel number="04 / 06">{t.journey.eyebrow}</SectionLabel>
        <div className="ed-section-intro ed-scroll-reveal"><h2>{language === "id" ? <>DALAM <em>PROSES</em></> : <>IN <em>PROGRESS</em></>}</h2><div><strong className="ed-intro-original">{t.journey.title}</strong><p>{t.journey.description}</p></div></div>
        <div className="ed-timeline">{journeyItems.map((item, index) => <article key={item.id} className="ed-timeline-item ed-scroll-reveal"><div className="ed-timeline-index">0{index + 1}<span /></div><div className="ed-timeline-meta"><span>{item.period[language]}</span><span>{t.journey.status[item.status]}</span></div><div className="ed-timeline-content"><h3>{item.title[language]}</h3><p>{item.description[language]}</p><div className="ed-timeline-highlights"><span>{t.journey.highlights}</span><ul>{item.highlights[language].map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></div></div></article>)}</div>
      </section>

      <section className="ed-name-marquee" aria-label="Rizki Ramadhan">
        <div className="ed-name-marquee-track" aria-hidden="true">
          {[0, 1].map((group) => <div className="ed-name-marquee-group" key={group}>
            {[0, 1].map((item) => <div className="ed-name-marquee-item" key={item}>
              <span className="ed-name-marquee-text"><span>RIZKI</span><span>RAMADHAN</span></span>
              <span className="ed-name-marquee-logo">R<span>R</span><span className="ed-name-marquee-dot">.</span></span>
            </div>)}
          </div>)}
        </div>
      </section>

      <section id="contact" className="ed-section ed-contact">
        <div className="ed-container"><SectionLabel number="05 / 06">{t.contact.eyebrow}</SectionLabel><div className="ed-contact-header ed-scroll-reveal"><div><span className="ed-kicker">{t.contact.availabilityTitle} — 2026</span><h2>{language === "id" ? <>MARI <em>TERHUBUNG</em><span>.</span></> : <>LET'S <em>CONNECT</em><span>.</span></>}</h2></div><div><strong className="ed-intro-original">{t.contact.title}</strong><p>{t.contact.description}</p><p>{t.contact.availabilityDescription}</p></div></div>
          <div className="ed-contact-grid"><div className="ed-contact-links ed-scroll-reveal"><span className="ed-kicker">{t.contact.socialTitle} / {t.contact.informationTitle}</span><a href={`mailto:${profile.email}`}>EMAIL <Arrow diagonal /><small>{profile.email}</small></a><a href={profile.github} target="_blank" rel="noreferrer">GITHUB <Arrow diagonal /></a><a href={profile.linkedin} target="_blank" rel="noreferrer">LINKEDIN <Arrow diagonal /></a><a href={instagramUrl} target="_blank" rel="noreferrer">INSTAGRAM <Arrow diagonal /></a><p>{t.contact.informationDescription}</p><p>{t.contact.locationLabel}: {t.contact.locationValue}</p></div><div className="ed-scroll-reveal"><ContactForm t={t} /></div></div>
        </div>
      </section>
      <footer className="ed-footer ed-container"><Link to="/#home" className="ed-footer-logo" data-cursor="TOP">RR<span>.</span></Link><span>© 2026 Rizki Ramadhan. {t.footer.rights}</span><span>JAKARTA / INDONESIA</span><Link to="/#home" data-cursor="TOP">BACK TO TOP ↑</Link></footer>
      {createPortal(<div ref={previewRef} className="ed-cursor-preview" aria-hidden="true"><img ref={previewImageRef} src={projectArt.savepoint} alt="" /></div>, document.body)}
    </main>
  );
}
