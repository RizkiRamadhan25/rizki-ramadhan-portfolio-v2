import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import "../../styles/editorial-project-gallery.css";

export default function EditorialProjectGallery({ screenshots, language, projectTitle }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const closeRef = useRef(null);
  const previousFocusRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const activeShot = activeIndex === null ? null : screenshots[activeIndex];

  const labels = language === "id"
    ? { open: "Perbesar gambar", close: "Tutup galeri", previous: "Gambar sebelumnya", next: "Gambar berikutnya", of: "dari" }
    : { open: "Enlarge image", close: "Close gallery", previous: "Previous image", next: "Next image", of: "of" };

  useEffect(() => {
    if (activeIndex === null) return undefined;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveIndex(null);
      } else if (event.key === "ArrowRight" && screenshots.length > 1) {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % screenshots.length);
      } else if (event.key === "ArrowLeft" && screenshots.length > 1) {
        event.preventDefault();
        setActiveIndex((index) => (index - 1 + screenshots.length) % screenshots.length);
      } else if (event.key === "Tab") {
        const buttons = document.querySelectorAll(".ed-gallery-lightbox button");
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, screenshots.length]);

  useEffect(() => {
    if (activeIndex === null) previousFocusRef.current?.focus();
  }, [activeIndex]);

  const open = (index, target) => {
    previousFocusRef.current = target;
    setActiveIndex(index);
  };

  return (
    <>
      <div className="ed-detail-gallery-grid">
        {screenshots.map((shot, index) => (
          <figure key={shot.src} className="ed-gallery-item">
            <button
              type="button"
              className="ed-gallery-item__button"
              onClick={(event) => open(index, event.currentTarget)}
              aria-label={`${labels.open}: ${shot.alt[language] || shot.alt.en}`}
            >
              <img src={shot.src} alt={shot.alt[language] || shot.alt.en} loading="lazy" decoding="async" />
              <span className="ed-gallery-item__action" aria-hidden="true">↗</span>
            </button>
            <figcaption>FIG. {String(index + 1).padStart(2, "0")} / {shot.caption[language] || shot.caption.en}</figcaption>
          </figure>
        ))}
      </div>

      {createPortal(
        <AnimatePresence>
          {activeShot && (
            <motion.div
              className="ed-gallery-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={`${projectTitle} / ${activeShot.caption[language] || activeShot.caption.en}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.25 }}
              onClick={() => setActiveIndex(null)}
            >
              <div className="ed-gallery-lightbox__top" onClick={(event) => event.stopPropagation()}>
                <span>{projectTitle} / {String(activeIndex + 1).padStart(2, "0")} {labels.of} {String(screenshots.length).padStart(2, "0")}</span>
                <button ref={closeRef} type="button" onClick={() => setActiveIndex(null)} aria-label={labels.close}>×</button>
              </div>
              <div className="ed-gallery-lightbox__stage" onClick={(event) => event.stopPropagation()}>
                {screenshots.length > 1 && <button type="button" className="ed-gallery-lightbox__arrow" onClick={() => setActiveIndex((index) => (index - 1 + screenshots.length) % screenshots.length)} aria-label={labels.previous}>←</button>}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeShot.src}
                    src={activeShot.src}
                    alt={activeShot.alt[language] || activeShot.alt.en}
                    initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.025 }}
                    transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeOut" }}
                  />
                </AnimatePresence>
                {screenshots.length > 1 && <button type="button" className="ed-gallery-lightbox__arrow" onClick={() => setActiveIndex((index) => (index + 1) % screenshots.length)} aria-label={labels.next}>→</button>}
              </div>
              <p className="ed-gallery-lightbox__caption">{activeShot.caption[language] || activeShot.caption.en}</p>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
