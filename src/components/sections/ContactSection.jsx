import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../../context/language-context";

import {
  gsap,
  Observer,
  ScrollSmoother,
  ScrollTrigger,
  prefersReducedMotion,
} from "../../lib/gsap";
import "../../styles/contact-footer-gsap.css";

const CONTACT_EMAIL = "riski.rama2509@gmail.com";
const INSTAGRAM_URL = "https://www.instagram.com/rizkirama_25/?hl=en";
const PORTRAIT_URL = "/images/profile-cutout.png";

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/RizkiRamadhan25",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rizki-ramadhan-507593357/",
  },
  {
    label: "Instagram",
    href: INSTAGRAM_URL,
  },
];

function ContactWaveText({ text }) {
  const characters = Array.from(text);

  const renderLine = (className) => (
    <span className={className} aria-hidden="true">
      {characters.map((character, index) => (
        <span
          key={`${className}-${index}-${character}`}
          className="contact-link-wave__char"
          style={{
            "--char-index": index,
            "--char-reverse-index": characters.length - index - 1,
          }}
        >
          {character === " " ? "\u00A0" : character}
        </span>
      ))}
    </span>
  );

  return (
    <span className="contact-link-wave" aria-hidden="true">
      {renderLine("contact-link-wave__line contact-link-wave__line--primary")}
      {renderLine("contact-link-wave__line contact-link-wave__line--secondary")}
    </span>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 19V5" />
      <path d="M6.5 10.5 12 5l5.5 5.5" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5.5h16v11H8l-4 3v-14Z" />
      <path d="M8 9h8M8 12.5h5" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m21 3-8.2 18-2.2-7.6L3 10.2 21 3Z" />
      <path d="M10.6 13.4 21 3" />
    </svg>
  );
}

export default function ContactSection() {
  const { language, t } = useLanguage();
  const rootRef = useRef(null);
  const portraitRef = useRef(null);
  const marqueeTrackRef = useRef(null);
  const smokeRef = useRef(null);
  const modalRef = useRef(null);
  const modalCardRef = useRef(null);
  const firstInputRef = useRef(null);
  const modalObserverRef = useRef(null);
  const messageButtonRef = useRef(null);
  const isMessageOpenRef = useRef(false);
  const modalScrollPositionRef = useRef(0);

  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  useLayoutEffect(() => {
    const root = rootRef.current;
    const portrait = portraitRef.current;
    const marqueeTrack = marqueeTrackRef.current;
    const smoke = smokeRef.current;

    if (!root || !portrait || !marqueeTrack || !gsap) {
      return undefined;
    }

    const splitInstances = [];
    let pointerObserver;

    const context = gsap.context(() => {
      const reduced = prefersReducedMotion();
      const socialRows = gsap.utils.toArray("[data-contact-social]", root);
      const actionButtons = gsap.utils.toArray("[data-contact-action]", root);
      const footerMeta = gsap.utils.toArray("[data-contact-meta]", root);

      if (!reduced) {
        gsap.set(portrait, {
          autoAlpha: 0,
          yPercent: 8,
          scale: 0.96,
          transformOrigin: "50% 100%",
        });

        gsap.set(actionButtons, {
          autoAlpha: 0,
          x: 30,
          scale: 0.92,
        });

        gsap.set(footerMeta, {
          autoAlpha: 0,
          y: 14,
        });

        gsap.to(portrait, {
          autoAlpha: 1,
          yPercent: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            id: "contact-portrait-reveal",
            trigger: root,
            start: "top 82%",
            end: "top 34%",
            scrub: 0.9,
            invalidateOnRefresh: true,
          },
        });

        gsap.to(actionButtons, {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            id: "contact-actions-reveal",
            trigger: root,
            start: "top 58%",
            once: true,
          },
        });

        gsap.to(footerMeta, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            id: "contact-meta-reveal",
            trigger: root,
            start: "top 54%",
            once: true,
          },
        });

        // Keep contact links visible even when the page is opened directly at #contact.
        // Only animate their vertical offset so ScrollTrigger can never leave them at opacity: 0.
        gsap.set(socialRows, { autoAlpha: 1 });
        gsap.fromTo(
          socialRows,
          { y: 18 },
          {
            y: 0,
            duration: 0.68,
            stagger: 0.075,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              id: "contact-social-reveal",
              trigger: socialRows[0] || root,
              start: "top 88%",
              once: true,
            },
          }
        );
      }

      // Continuous, intentionally relaxed marquee.
      if (!reduced) {
        gsap.to(marqueeTrack, {
          xPercent: -50,
          duration: 22,
          repeat: -1,
          ease: "none",
        });
      }

      // Bottom red smoke / shadow: slow organic motion, not a glow pulse.
      if (smoke && !reduced) {
        const smokeBlobs = gsap.utils.toArray("[data-smoke-blob]", smoke);

        smokeBlobs.forEach((blob, index) => {
          const direction = index % 2 === 0 ? 1 : -1;

          gsap.to(blob, {
            xPercent: direction * (12 + index * 2.4),
            yPercent: -(10 + index * 3.2),
            scale: 1.12 + index * 0.035,
            rotate: direction * (4 + index * 1.8),
            opacity: 0.52 + (index % 3) * 0.12,
            duration: 6.8 + index * 1.35,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });

        gsap.fromTo(
          smoke,
          { autoAlpha: 0.18 },
          {
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              id: "contact-smoke-scroll",
              trigger: root,
              start: "top 86%",
              end: "top 30%",
              scrub: 1.2,
            },
          }
        );
      }

      // Observer adds a tiny, inertial portrait response without fighting scroll.
      if (Observer && !reduced) {
        pointerObserver = Observer.create({
          target: root,
          type: "pointer,touch",
          onMove(self) {
            if (isMessageOpenRef.current) return;

            const x = gsap.utils.clamp(-10, 10, self.deltaX * 0.11);
            const y = gsap.utils.clamp(-7, 7, self.deltaY * 0.08);

            gsap.to(portrait, {
              x,
              y,
              duration: 1,
              overwrite: "auto",
              ease: "power3.out",
            });
          },
          onStop() {
            gsap.to(portrait, {
              x: 0,
              y: 0,
              duration: 1.2,
              overwrite: "auto",
              ease: "power3.out",
            });
          },
          tolerance: 8,
        });
      }

      ScrollTrigger?.refresh?.();
    }, root);

    return () => {
      pointerObserver?.kill?.();
      splitInstances.forEach((split) => split?.revert?.());
      context.revert();
    };
  }, []);

  const closeMessage = useCallback(() => {
    if (!isMessageOpen) return;

    if (!gsap || !modalRef.current || !modalCardRef.current) {
      isMessageOpenRef.current = false;
      setIsMessageOpen(false);

      window.requestAnimationFrame(() => {
        messageButtonRef.current?.focus?.({ preventScroll: true });
      });
      return;
    }

    gsap.timeline({
      onComplete: () => {
        isMessageOpenRef.current = false;
        setIsMessageOpen(false);

        window.requestAnimationFrame(() => {
          messageButtonRef.current?.focus?.({ preventScroll: true });
        });
      },
    })
      .to(modalCardRef.current, {
        autoAlpha: 0,
        scale: 0.965,
        y: 20,
        filter: "blur(10px)",
        duration: 0.34,
        ease: "power2.in",
      })
      .to(modalRef.current, {
        autoAlpha: 0,
        duration: 0.25,
        ease: "power2.inOut",
      }, "-=0.15");
  }, [isMessageOpen]);

  useEffect(() => {
    if (!isMessageOpen) {
      modalObserverRef.current?.kill?.();
      modalObserverRef.current = null;
      return undefined;
    }

    const smoother = ScrollSmoother?.get?.();
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    const currentScroll =
      typeof smoother?.scrollTop === "function"
        ? smoother.scrollTop()
        : window.scrollY;

    modalScrollPositionRef.current = Number.isFinite(currentScroll)
      ? currentScroll
      : window.scrollY;

    if (smoother?.paused) {
      smoother.paused(true);
    } else {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }

    document.body.classList.add("contact-message-open");

    if (Observer) {
      modalObserverRef.current = Observer.create({
        target: window,
        type: "wheel,touch,scroll",
        preventDefault: true,
        allowClicks: true,
      });
    }

    const frame = window.requestAnimationFrame(() => {
      firstInputRef.current?.focus?.({ preventScroll: true });
    });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMessage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
      modalObserverRef.current?.kill?.();
      modalObserverRef.current = null;
      document.body.classList.remove("contact-message-open");

      const savedScroll = modalScrollPositionRef.current;

      if (smoother?.paused) {
        smoother.paused(false);

        window.requestAnimationFrame(() => {
          smoother.scrollTo?.(savedScroll, false);
          ScrollTrigger?.update?.();
        });
      } else {
        document.documentElement.style.overflow = previousHtmlOverflow;
        document.body.style.overflow = previousBodyOverflow;

        window.requestAnimationFrame(() => {
          window.scrollTo({
            top: savedScroll,
            left: 0,
            behavior: "auto",
          });
          ScrollTrigger?.update?.();
        });
      }
    };
  }, [isMessageOpen, closeMessage]);

  useLayoutEffect(() => {
    if (!isMessageOpen || !modalRef.current || !modalCardRef.current || !gsap) {
      return undefined;
    }

    const context = gsap.context(() => {
      const fields = gsap.utils.toArray("[data-message-field]", modalCardRef.current);

      const timeline = gsap.timeline({
        defaults: {
          overwrite: "auto",
        },
      });

      timeline
        .fromTo(
          modalRef.current,
          {
            autoAlpha: 0,
            backdropFilter: "blur(0px)",
          },
          {
            autoAlpha: 1,
            backdropFilter: "blur(24px)",
            duration: 0.42,
            ease: "power2.out",
          }
        )
        .fromTo(
          modalCardRef.current,
          {
            autoAlpha: 0,
            scale: 0.9,
            y: 64,
            rotateX: 7,
            filter: "blur(18px)",
            transformPerspective: 1200,
            transformOrigin: "50% 60%",
          },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 0.86,
            ease: "power4.out",
          },
          "-=0.22"
        )
        .from(
          fields,
          {
            autoAlpha: 0,
            y: 18,
            duration: 0.52,
            stagger: 0.055,
            ease: "power3.out",
          },
          "-=0.48"
        );
    }, modalRef);

    return () => context.revert();
  }, [isMessageOpen]);

  const openMessage = () => {
    isMessageOpenRef.current = true;
    setFormMessage("");
    setIsMessageOpen(true);
  };

  const scrollHome = () => {
    const smoother = ScrollSmoother?.get?.();
    const targetY = 0;
    const duration = 2.35;

    // ScrollSmoother case: animate the smoother's scrollTop directly so the
    // button always reaches the absolute top of the document.
    if (smoother?.scrollTop) {
      const state = {
        y: smoother.scrollTop(),
      };

      gsap.to(state, {
        y: targetY,
        duration,
        ease: "power3.inOut",
        overwrite: "auto",
        onUpdate: () => {
          smoother.scrollTop(state.y);
          ScrollTrigger?.update?.();
        },
      });

      return;
    }

    // Fallback when ScrollSmoother is not available.
    const state = {
      y: window.scrollY,
    };

    gsap.to(state, {
      y: targetY,
      duration,
      ease: "power3.inOut",
      overwrite: "auto",
      onUpdate: () => {
        window.scrollTo({
          top: state.y,
          left: 0,
          behavior: "auto",
        });
        ScrollTrigger?.update?.();
      },
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const email = CONTACT_EMAIL;
    const data = new FormData(event.currentTarget);
    const name = data.get("name")?.toString().trim() || "";
    const sender = data.get("email")?.toString().trim() || "";
    const subject = data.get("subject")?.toString().trim() || "Portfolio message";
    const message = data.get("message")?.toString().trim() || "";

    if (!email) {
      setFormMessage(t.contact.emailUnavailable);
      return;
    }

    const body = [
      message,
      "",
      `Name: ${name}`,
      `Email: ${sender}`,
    ].join("\n");

    window.location.href =
      `mailto:${email}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
  };

  const email = CONTACT_EMAIL;

  return (
    <section
      id="contact"
      ref={rootRef}
      className="contact-footer"
      aria-label="Contact Rizki Ramadhan"
    >
      <div ref={smokeRef} className="contact-footer__smoke" aria-hidden="true">
        <i data-smoke-blob />
        <i data-smoke-blob />
        <i data-smoke-blob />
        <i data-smoke-blob />
        <i data-smoke-blob />
      </div>

      <div className="contact-footer__content">
        <nav className="contact-footer__links" aria-label="Social links">
          {SOCIAL_LINKS.map((item) => (
            <a
              key={item.label}
              data-contact-social
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
            >
              <ContactWaveText text={item.label} />
            </a>
          ))}

          <a
            data-contact-social
            href={`mailto:${email}`}
            aria-label={email}
          >
            <ContactWaveText text={email} />
          </a>
        </nav>

        <div ref={portraitRef} className="contact-footer__portrait">
          <img
            src={PORTRAIT_URL}
            alt="Rizki Ramadhan holding a camera"
            width="1100"
            height="1500"
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        </div>

        <div className="contact-footer__actions">
          <button
            ref={messageButtonRef}
            type="button"
            data-contact-action
            className="contact-footer__round-action contact-footer__round-action--message"
            onClick={openMessage}
            aria-label={language === "id" ? "Buka formulir pesan" : "Open message form"}
          >
            <MessageIcon />
          </button>

          <button
            type="button"
            data-contact-action
            className="contact-footer__round-action contact-footer__round-action--up"
            onClick={scrollHome}
            aria-label={language === "id" ? "Kembali ke atas" : "Back to top"}
          >
            <ArrowUpIcon />
          </button>
        </div>
      </div>

      <div className="contact-footer__marquee" aria-label="Rizki Ramadhan">
        <div ref={marqueeTrackRef} className="contact-footer__marquee-track">
          <span>RIZKI RAMADHAN</span>
          <span aria-hidden="true">RIZKI RAMADHAN</span>
        </div>
      </div>

      <div className="contact-footer__meta">
        <p data-contact-meta>© 2026 Rizki Ramadhan. {language === "id" ? "Hak cipta dilindungi." : "All rights reserved."}</p>
        <p data-contact-meta>Jakarta / Indonesia</p>
      </div>

      {isMessageOpen && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={modalRef}
              className="contact-message"
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-message-title"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  closeMessage();
                }
              }}
            >
          <div ref={modalCardRef} className="contact-message__glass">
            <button
              type="button"
              className="contact-message__close"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={closeMessage}
              aria-label={language === "id" ? "Tutup formulir pesan" : "Close message form"}
            >
              <span className="contact-message__close-label">{language === "id" ? "TUTUP" : "CLOSE"}</span>
              <span className="contact-message__close-x" aria-hidden="true">×</span>
            </button>

            <div className="contact-message__scroll">
            <header data-message-field className="contact-message__header">
              <p>{language === "id" ? "KONTAK / PESAN" : "CONTACT / MESSAGE"}</p>
              <h2 id="contact-message-title">{t.contact.formTitle}</h2>
              <span>
                {t.contact.formDescription}
              </span>
            </header>

            <form className="contact-message__form" onSubmit={handleSubmit}>
              <div className="contact-message__row" data-message-field>
                <label>
                  <span>{t.contact.form.name}</span>
                  <input
                    ref={firstInputRef}
                    type="text"
                    name="name"
                    placeholder={t.contact.form.namePlaceholder}
                    autoComplete="name"
                    required
                  />
                </label>

                <label>
                  <span>{t.contact.form.email}</span>
                  <input
                    type="email"
                    name="email"
                    placeholder={t.contact.form.emailPlaceholder}
                    autoComplete="email"
                    required
                  />
                </label>
              </div>

              <label data-message-field>
                <span>{t.contact.form.subject}</span>
                <input
                  type="text"
                  name="subject"
                  placeholder={t.contact.form.subjectPlaceholder}
                  required
                />
              </label>

              <label data-message-field>
                <span>{t.contact.form.message}</span>
                <textarea
                  name="message"
                  rows="7"
                  placeholder={t.contact.form.messagePlaceholder}
                  required
                />
              </label>

              {formMessage && (
                <p className="contact-message__status" role="status" aria-live="polite">
                  {formMessage}
                </p>
              )}

              <button
                type="submit"
                data-message-field
                className="contact-message__send"
              >
                <SendIcon />
                <span>{t.contact.form.send}</span>
              </button>
            </form>
            </div>
          </div>
        </div>,
            document.body
          )
        : null}
    </section>
  );
}
