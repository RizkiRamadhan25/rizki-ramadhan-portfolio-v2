import { useLayoutEffect, useRef } from "react";

import { useLanguage } from "../../context/language-context";
import {
  gsap,
  ScrollTrigger,
  prefersReducedMotion,
} from "../../lib/gsap";
import "../../styles/about-luke-style.css";

const ABOUT_PORTRAIT = "/images/profile-cutout.png";

export default function AboutSection() {
  const { language } = useLanguage();

  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const copyRef = useRef(null);
  const portraitRef = useRef(null);
  const glowRef = useRef(null);

  const isIndonesian = language === "id";

  const titleLines = isIndonesian
    ? ["Belajar teknologi", "dengan membangun", "sesuatu yang bermakna."]
    : ["Learning technology by", "building something", "meaningful."];

  const description = isIndonesian
    ? "Nama saya Rizki Ramadhan. Saya mahasiswa Teknik Informatika yang tertarik pada web development, software engineering, data science, dan artificial intelligence."
    : "My name is Rizki Ramadhan. I am an Informatics Engineering student interested in web development, software engineering, data science, and artificial intelligence.";

  useLayoutEffect(() => {
    const root = rootRef.current;
    const title = titleRef.current;
    const copy = copyRef.current;
    const portrait = portraitRef.current;
    const glow = glowRef.current;

    if (!root || !title || !copy || !portrait || !glow || !gsap) {
      return undefined;
    }

    const context = gsap.context(() => {
      const titleLinesNodes = gsap.utils.toArray(
        ".about-luke__title-line-inner",
        title
      );

      if (prefersReducedMotion()) {
        gsap.set([...titleLinesNodes, copy, portrait, glow], {
          autoAlpha: 1,
          filter: "blur(0px)",
          scale: 1,
        });

        return;
      }

      // Tidak ada pin / sticky timeline.
      // Halaman tetap scroll normal menuju section berikutnya.
      gsap.set(titleLinesNodes, {
        autoAlpha: 0,
        filter: "blur(14px)",
      });

      gsap.set(copy, {
        autoAlpha: 0,
        filter: "blur(12px)",
      });

      gsap.set(portrait, {
        autoAlpha: 0,
        filter: "blur(10px)",
        scale: 0.985,
        transformOrigin: "50% 100%",
      });

      gsap.fromTo(glow,
        { autoAlpha: 0.28, scale: 0.72, xPercent: 12, yPercent: 10 },
        {
          autoAlpha: 0.82,
          scale: 1.22,
          xPercent: -7,
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.1,
          },
        }
      );

      // Reveal typography utama satu per satu per baris,
      // murni menggunakan opacity + blur. Tidak ada translate / animasi naik.
      titleLinesNodes.forEach((line, index) => {
        gsap.to(line, {
          autoAlpha: 1,
          filter: "blur(0px)",
          ease: "none",
          scrollTrigger: {
            id: `about-title-line-${index}`,
            trigger: line,
            start: "top 88%",
            end: "top 58%",
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });
      });

      // Seluruh paragraf muncul sekaligus sebagai satu blok.
      gsap.to(copy, {
        autoAlpha: 1,
        filter: "blur(0px)",
        ease: "none",
        scrollTrigger: {
          id: "about-copy-fade",
          trigger: copy,
          start: "top 90%",
          end: "top 66%",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });

      // Foto hanya fade + very subtle scale. Tidak bergoyang dan tidak bergeser.
      gsap.to(portrait, {
        autoAlpha: 1,
        filter: "blur(0px)",
        scale: 1,
        ease: "none",
        scrollTrigger: {
          id: "about-portrait-fade",
          trigger: root,
          start: "top 78%",
          end: "top 42%",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger?.refresh?.();
    }, root);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section
      id="about"
      ref={rootRef}
      className="about-luke"
      aria-labelledby="about-luke-title"
    >
      <div className="about-luke__stage">
        <div ref={glowRef} className="about-luke__glow" aria-hidden="true" />
        <div className="about-luke__noise" aria-hidden="true" />

        <h2
          id="about-luke-title"
          ref={titleRef}
          className="about-luke__title"
        >
          {titleLines.map((line, index) => (
            <span key={index} className="about-luke__title-line">
              <span className="about-luke__title-line-inner">{line}</span>
            </span>
          ))}
        </h2>

        <div className="about-luke__copy-wrap">
          <p ref={copyRef} className="about-luke__copy">
            {description}
          </p>
        </div>

        <div ref={portraitRef} className="about-luke__portrait">
          <img
            src={ABOUT_PORTRAIT}
            alt="Rizki Ramadhan"
            width="1100"
            height="1500"
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        </div>
      </div>
    </section>
  );
}
