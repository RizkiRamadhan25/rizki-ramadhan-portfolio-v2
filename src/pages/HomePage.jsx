import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useOutletContext } from "react-router";

import AboutSection from "../components/sections/AboutSection";
import ContactSection from "../components/sections/ContactSection";
import JourneySection from "../components/sections/JourneySection";
import ProjectsSection from "../components/sections/ProjectsSection";
import SkillsSection from "../components/sections/SkillsSection";
import "../styles/hero-vintage-cursor.css";
import "../styles/navigation-menu.css";
import "../styles/identity-monument.css";
import "../styles/learning-log-section.css";
import { useLanguage } from "../context/language-context";
import { profile } from "../data/profile";
import { usePageMetadata } from "../hooks/usePageMetadata";
import {
  gsap,
  ScrollSmoother,
  ScrollTrigger,
  prefersReducedMotion,
} from "../lib/gsap";

const YOUTUBE_URL = "https://youtu.be/jOkEioAkGPU";
const LOCAL_VIDEO_URL = "/videos/learning-python-preview.mp4";

export default function HomePage() {
  const { language, t } = useLanguage();
  const { introRevealed = true } = useOutletContext() || {};

  const heroRef = useRef(null);
  const heroCopyRef = useRef(null);
  const mediaColumnRef = useRef(null);
  const videoShellRef = useRef(null);
  const localVideoRef = useRef(null);
  const videoCreditRef = useRef(null);
  const captionRef = useRef(null);
  const pawTrailLayerRef = useRef(null);
  const persistentNameRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuOverlayRef = useRef(null);
  const menuCloseRef = useRef(null);
  const menuTargetRef = useRef(null);
  const menuScrollPositionRef = useRef(0);
  const menuNavigationTweenRef = useRef(null);
  const sectionIndicatorRef = useRef(null);
  const [activeSectionId, setActiveSectionId] = useState("home");
  const [compactLayout, setCompactLayout] = useState(() =>
    window.matchMedia("(max-width: 1024px)").matches
  );

  useLayoutEffect(() => {
    const query = window.matchMedia("(max-width: 1024px)");
    const handleChange = (event) => setCompactLayout(event.matches);

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  usePageMetadata({
    title: t.metadata.title,
    description: t.metadata.description,
    path: "/",
    language,
  });

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const pawLayer = pawTrailLayerRef.current;

    if (
      !hero ||
      !pawLayer ||
      !gsap ||
      !introRevealed ||
      prefersReducedMotion()
    ) {
      return undefined;
    }

    const finePointer = window.matchMedia?.("(hover: hover) and (pointer: fine)");

    if (finePointer && !finePointer.matches) {
      return undefined;
    }

    let lastX = -1000;
    let lastY = -1000;
    let lastStamp = 0;
    let pawIndex = 0;

    const spawnPaw = (x, y, angle, speed) => {
      const mark = document.createElement("span");
      mark.className = "hero-paw-trail";
      mark.style.left = `${x}px`;
      mark.style.top = `${y}px`;
      mark.style.setProperty("--paw-rotation", `${angle + 90}deg`);
      mark.style.setProperty("--paw-scale", String(0.82 + Math.min(speed, 1) * 0.22));
      mark.dataset.side = String(pawIndex % 2);

      pawIndex += 1;
      pawLayer.appendChild(mark);

      gsap.fromTo(
        mark,
        {
          autoAlpha: 0,
          scale: 0.45,
          y: 4,
        },
        {
          autoAlpha: 0.72,
          scale: 1,
          y: 0,
          duration: 0.18,
          ease: "power3.out",
          onComplete() {
            gsap.to(mark, {
              autoAlpha: 0,
              scale: 0.8,
              duration: 1.25,
              delay: 0.55,
              ease: "power2.in",
              onComplete() {
                mark.remove();
              },
            });
          },
        }
      );
    };

    const handlePointerMove = (event) => {
      if (event.pointerType === "touch") {
        return;
      }

      const rect = hero.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!inside) {
        lastX = -1000;
        lastY = -1000;
        return;
      }

      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      const now = performance.now();

      if (lastX < -500) {
        lastX = localX;
        lastY = localY;
        lastStamp = now;
        return;
      }

      const dx = localX - lastX;
      const dy = localY - lastY;
      const distance = Math.hypot(dx, dy);
      const deltaTime = Math.max(16, now - lastStamp);

      if (distance < 42 && deltaTime < 120) {
        return;
      }

      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const speed = Math.min(1, distance / deltaTime / 0.85);

      spawnPaw(localX, localY, angle, speed);

      lastX = localX;
      lastY = localY;
      lastStamp = now;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      gsap.killTweensOf(pawLayer.querySelectorAll(".hero-paw-trail"));
      pawLayer.replaceChildren();
    };
  }, [introRevealed]);

  useLayoutEffect(() => {
    const persistentName = persistentNameRef.current;

    if (!persistentName || !introRevealed) {
      return undefined;
    }

    if (!gsap || prefersReducedMotion()) {
      persistentName.classList.add("is-settled");
      persistentName.style.opacity = "1";
      persistentName.style.visibility = "visible";
      return undefined;
    }

    const getLoaderCornerOffset = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const rect = persistentName.getBoundingClientRect();
      const computed = window.getComputedStyle(persistentName);

      const finalLeft = Number.parseFloat(computed.left) || 0;
      const finalTop = Number.parseFloat(computed.top) || 0;
      const rightPad = Math.max(24, Math.min(viewportWidth * 0.034, 56));
      const bottomPad = Math.max(24, Math.min(viewportWidth * 0.034, 56));

      return {
        x: viewportWidth - rightPad - rect.width - finalLeft,
        y: viewportHeight - bottomPad - rect.height - finalTop,
      };
    };

    const context = gsap.context(() => {
      const from = getLoaderCornerOffset();

      gsap.set(persistentName, {
        x: from.x,
        y: from.y,
        scale: 1.08,
        autoAlpha: 0,
        zIndex: 10060,
        transformOrigin: "50% 50%",
      });

      const timeline = gsap.timeline({
        defaults: {
          overwrite: "auto",
        },
      });

      timeline
        .to(
          persistentName,
          {
            autoAlpha: 1,
            duration: 0.12,
            ease: "none",
          },
          0
        )
        .to(
          persistentName,
          {
            x: 0,
            y: 0,
            scale: 1,
            duration: 1.18,
            ease: "power4.inOut",
          },
          0.04
        )
        .set(persistentName, {
          clearProps: "transform",
          zIndex: 1900,
        })
        .call(() => {
          persistentName.classList.add("is-settled");
        });
    });

    return () => context.revert();
  }, [introRevealed]);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const heroCopy = heroCopyRef.current;
    const mediaColumn = mediaColumnRef.current;
    const videoShell = videoShellRef.current;
    const videoCredit = videoCreditRef.current;
    const caption = captionRef.current;

    if (
      !hero ||
      !heroCopy ||
      !mediaColumn ||
      !videoShell ||
      !videoCredit ||
      !caption ||
      !gsap ||
      !introRevealed
    ) {
      return undefined;
    }

    ScrollTrigger?.getById?.("learning-log-hero")?.kill?.();

    const getMediaCenterOffsetX = () => {
      const heroRect = hero.getBoundingClientRect();
      const mediaRect = mediaColumn.getBoundingClientRect();

      return (
        heroRect.left +
        heroRect.width / 2 -
        (mediaRect.left + mediaRect.width / 2)
      );
    };

    const context = gsap.context(() => {
      if (prefersReducedMotion() || compactLayout) {
        gsap.set(heroCopy, { autoAlpha: 1, y: 0 });
        gsap.set(mediaColumn, { x: 0, y: 0 });
        gsap.set(videoShell, {
          scale: 1,
          y: 0,
          transformOrigin: "50% 50%",
        });
        gsap.set(videoCredit, { autoAlpha: 1, y: 0 });
        gsap.set(caption, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(heroCopy, {
        autoAlpha: 1,
        y: 0,
      });

      gsap.set(mediaColumn, {
        x: 0,
        y: 0,
      });

      gsap.set(videoShell, {
        scale: 0.96,
        y: 0,
        transformOrigin: "50% 50%",
      });

      gsap.set(videoCredit, {
        autoAlpha: 1,
        y: 0,
      });

      gsap.set(caption, {
        autoAlpha: 0,
        y: 32,
      });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "learning-log-hero",
          trigger: hero,
          start: "top top",
          end: "+=180%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(
          heroCopy,
          {
            autoAlpha: 0,
            y: -36,
            duration: 0.3,
          },
          0
        )
        .to(
          videoCredit,
          {
            autoAlpha: 0,
            y: 14,
            duration: 0.2,
          },
          0.12
        )
        .to(
          mediaColumn,
          {
            x: () => getMediaCenterOffsetX(),
            y: () => -Math.min(42, window.innerHeight * 0.045),
            duration: 0.64,
            ease: "power3.inOut",
          },
          0.1
        )
        .to(
          videoShell,
          {
            scale: 1.4,
            duration: 0.72,
            ease: "power3.inOut",
          },
          0.1
        )
        .to(
          caption,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.28,
            ease: "power2.out",
          },
          0.5
        );
    }, hero);

    const frame = window.requestAnimationFrame(() => ScrollTrigger?.refresh?.());

    return () => {
      window.cancelAnimationFrame(frame);
      context.revert();
    };
  }, [introRevealed, compactLayout]);

  useLayoutEffect(() => {
    const video = localVideoRef.current;

    if (!video || !introRevealed) {
      return undefined;
    }

    let cancelled = false;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const startPlayback = async () => {
      if (cancelled) {
        return;
      }

      try {
        await video.play();
      } catch (error) {
        console.warn(
          "[Learning video] Autoplay belum diizinkan browser.",
          error
        );
      }
    };

    const handleError = () => {
      const source = video.currentSrc || LOCAL_VIDEO_URL;

      console.error(
        `[Learning video] File video tidak dapat dimuat: ${source}. ` +
          `Pastikan file tersedia di public/videos/learning-python-preview.mp4`
      );
    };

    video.addEventListener("error", handleError);

    const observer = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            startPlayback();
          } else {
            video.pause();
          }
        }, { threshold: 0.1 })
      : null;

    if (observer) {
      observer.observe(video);
    } else {
      startPlayback();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      video.pause();
      video.removeEventListener("error", handleError);
    };
  }, [introRevealed]);

  const menuItems = useMemo(() =>
    language === "id"
      ? [
          { id: "home", label: "Beranda", index: "01" },
          { id: "about", label: "Tentang Saya", index: "02" },
          { id: "skills", label: "Keahlian", index: "03" },
          { id: "projects", label: "Proyek", index: "04" },
          { id: "journey", label: "Perjalanan", index: "05" },
          { id: "contact", label: "Kontak", index: "06" },
        ]
      : [
          { id: "home", label: "Home", index: "01" },
          { id: "about", label: "About Me", index: "02" },
          { id: "skills", label: "Skills", index: "03" },
          { id: "projects", label: "Projects", index: "04" },
          { id: "journey", label: "Journey", index: "05" },
          { id: "contact", label: "Contact", index: "06" },
        ], [language]);

  useLayoutEffect(() => {
    if (!introRevealed || !ScrollTrigger) {
      return undefined;
    }

    const indicator = sectionIndicatorRef.current;

    if (!indicator) {
      return undefined;
    }

    const segmentNodes = Array.from(
      indicator.querySelectorAll(
        ".portfolio-section-indicator__segment"
      )
    );

    let ranges = [];
    let visualRanges = [];
    let scrollFrame = null;
    let rebuildFrameOne = null;
    let rebuildFrameTwo = null;
    let resizeTimer = null;

    const clamp = (min, max, value) =>
      Math.min(max, Math.max(min, value));

    const getSmoother = () =>
      ScrollSmoother?.get?.();

    const getScrollY = () =>
      getSmoother()?.scrollTop?.() ??
      window.scrollY ??
      0;

    const getSectionScrollY = (section) => {
      if (!section) {
        return 0;
      }

      const smoother = getSmoother();
      const smootherOffset =
        smoother?.offset?.(
          section,
          "top top"
        );

      if (Number.isFinite(smootherOffset)) {
        return smootherOffset;
      }

      return (
        getScrollY() +
        section.getBoundingClientRect().top
      );
    };

    const measureVisualRanges = () => {
      visualRanges = segmentNodes.map(
        (segment) => ({
          top: segment.offsetTop,
          height: segment.offsetHeight,
        })
      );
    };

    const updateHead = (
      index,
      localProgress
    ) => {
      const visual = visualRanges[index];

      if (!visual) {
        return;
      }

      indicator.style.setProperty(
        "--portfolio-head-top",
        `${
          visual.top +
          visual.height * localProgress
        }px`
      );
    };

    const updateIndicator = () => {
      if (!ranges.length) {
        return;
      }

      const maxScroll = Math.max(
        1,
        ScrollTrigger.maxScroll(window)
      );

      const currentY = clamp(
        0,
        maxScroll,
        getScrollY()
      );

      let activeIndex = 0;

      ranges.forEach(
        (range, index) => {
          if (currentY >= range.start) {
            activeIndex = index;
          }
        }
      );

      if (
        maxScroll - currentY <=
        Math.max(
          6,
          window.innerHeight * 0.012
        )
      ) {
        activeIndex =
          menuItems.length - 1;
      }

      activeIndex = Math.min(
        activeIndex,
        ranges.length - 1
      );

      const activeRange =
        ranges[activeIndex];

      const localProgress = clamp(
        0,
        1,
        (currentY - activeRange.start) /
          Math.max(
            1,
            activeRange.end -
              activeRange.start
          )
      );

      ranges.forEach(
        (_range, index) => {
          const progress =
            index < activeIndex
              ? 1
              : index > activeIndex
                ? 0
                : localProgress;

          indicator.style.setProperty(
            `--portfolio-section-progress-${index}`,
            String(progress)
          );
        }
      );

      const activeItem =
        menuItems[activeIndex];

      if (activeItem) {
        setActiveSectionId(
          (current) =>
            current === activeItem.id
              ? current
              : activeItem.id
        );
      }

      updateHead(
        activeIndex,
        localProgress
      );
    };

    const scheduleIndicatorUpdate = () => {
      if (scrollFrame) {
        return;
      }

      scrollFrame =
        window.requestAnimationFrame(() => {
          scrollFrame = null;
          updateIndicator();
        });
    };

    const rebuildRanges = () => {
      const maxScroll = Math.max(
        1,
        ScrollTrigger.maxScroll(window)
      );

      const viewportHeight = Math.max(
        1,
        window.innerHeight
      );

      const activationOffset =
        viewportHeight * 0.56;

      const sectionStarts =
        menuItems.map((item, index) => {
          if (index === 0) {
            return 0;
          }

          const section =
            document.getElementById(
              item.id
            );

          if (!section) {
            return 0;
          }

          return clamp(
            0,
            maxScroll,
            getSectionScrollY(section) -
              activationOffset
          );
        });

      for (
        let index = 1;
        index < sectionStarts.length;
        index += 1
      ) {
        sectionStarts[index] =
          Math.max(
            sectionStarts[index],
            sectionStarts[index - 1] + 1
          );

        sectionStarts[index] =
          Math.min(
            sectionStarts[index],
            maxScroll
          );
      }

      const contactIndex =
        menuItems.findIndex(
          (item) =>
            item.id === "contact"
        );

      if (contactIndex > 0) {
        const minimumContactRange =
          Math.max(
            140,
            viewportHeight * 0.26
          );

        const latestContactStart =
          Math.max(
            sectionStarts[
              contactIndex - 1
            ] + 1,
            maxScroll -
              minimumContactRange
          );

        sectionStarts[contactIndex] =
          Math.min(
            sectionStarts[contactIndex],
            latestContactStart
          );

        sectionStarts[contactIndex] =
          Math.max(
            sectionStarts[contactIndex],
            sectionStarts[
              contactIndex - 1
            ] + 1
          );
      }

      ranges = menuItems.map(
        (item, index) => {
          const start =
            index === 0
              ? 0
              : sectionStarts[index];

          const end =
            index <
            menuItems.length - 1
              ? Math.max(
                  start + 1,
                  sectionStarts[
                    index + 1
                  ]
                )
              : maxScroll;

          const duration =
            Math.max(
              1,
              end - start
            );

          const weight = clamp(
            0.52,
            5,
            duration /
              viewportHeight
          );

          indicator.style.setProperty(
            `--portfolio-section-weight-${index}`,
            String(weight)
          );

          return {
            id: item.id,
            start,
            end,
            duration,
          };
        }
      );

      window.requestAnimationFrame(() => {
        measureVisualRanges();
        updateIndicator();
      });
    };

    const scheduleStableRebuild = () => {
      if (rebuildFrameOne) {
        window.cancelAnimationFrame(
          rebuildFrameOne
        );
      }

      if (rebuildFrameTwo) {
        window.cancelAnimationFrame(
          rebuildFrameTwo
        );
      }

      rebuildFrameOne =
        window.requestAnimationFrame(() => {
          rebuildFrameOne = null;

          rebuildFrameTwo =
            window.requestAnimationFrame(() => {
              rebuildFrameTwo = null;
              rebuildRanges();
            });
        });
    };

    const handleRefresh = () => {
      scheduleStableRebuild();
    };

    const handleResize = () => {
      if (resizeTimer) {
        window.clearTimeout(
          resizeTimer
        );
      }

      resizeTimer =
        window.setTimeout(() => {
          scheduleStableRebuild();
        }, 140);
    };

    window.addEventListener(
      "scroll",
      scheduleIndicatorUpdate,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      handleResize,
      { passive: true }
    );

    ScrollTrigger.addEventListener(
      "refresh",
      handleRefresh
    );

    ScrollTrigger.addEventListener(
      "scrollEnd",
      scheduleIndicatorUpdate
    );

    scheduleStableRebuild();

    return () => {
      window.removeEventListener(
        "scroll",
        scheduleIndicatorUpdate
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      ScrollTrigger.removeEventListener(
        "refresh",
        handleRefresh
      );

      ScrollTrigger.removeEventListener(
        "scrollEnd",
        scheduleIndicatorUpdate
      );

      if (scrollFrame) {
        window.cancelAnimationFrame(
          scrollFrame
        );
      }

      if (rebuildFrameOne) {
        window.cancelAnimationFrame(
          rebuildFrameOne
        );
      }

      if (rebuildFrameTwo) {
        window.cancelAnimationFrame(
          rebuildFrameTwo
        );
      }

      if (resizeTimer) {
        window.clearTimeout(
          resizeTimer
        );
      }
    };
  }, [introRevealed, language, menuItems]);

  useLayoutEffect(() => {
    const smoother = ScrollSmoother?.get?.();

    if (menuOpen) {
      menuScrollPositionRef.current = smoother?.scrollTop?.() ?? window.scrollY;

      document.documentElement.classList.add("portfolio-menu-open");
      document.body.classList.add("portfolio-menu-open");
      smoother?.paused?.(true);

      window.requestAnimationFrame(() => {
        menuCloseRef.current?.focus?.({ preventScroll: true });
      });

      return undefined;
    }

    const targetId = menuTargetRef.current;
    const savedScrollPosition = menuScrollPositionRef.current;

    menuTargetRef.current = null;

    document.documentElement.classList.remove("portfolio-menu-open");
    document.body.classList.remove("portfolio-menu-open");

    if (!targetId) {
      if (smoother?.scrollTop) {
        smoother.scrollTop(savedScrollPosition);
        smoother.paused?.(false);

        window.requestAnimationFrame(() => {
          smoother.scrollTop(savedScrollPosition);
        });
      } else {
        window.scrollTo({
          top: savedScrollPosition,
          left: 0,
          behavior: "auto",
        });
      }

      return undefined;
    }

    smoother?.paused?.(false);

    window.requestAnimationFrame(() => {
      const target = document.getElementById(targetId);

      if (!target) {
        return;
      }

      window.history.replaceState(null, "", `#${targetId}`);

      const activeSmoother = ScrollSmoother?.get?.();

      // Stop the previous navigation tween if the user chooses another
      // destination before the current auto-scroll has finished.
      menuNavigationTweenRef.current?.kill?.();
      menuNavigationTweenRef.current = null;

      if (!gsap || prefersReducedMotion()) {
        if (activeSmoother?.scrollTo) {
          activeSmoother.scrollTo(target, false, "top top");
        } else {
          target.scrollIntoView({
            behavior: "auto",
            block: "start",
          });
        }

        return;
      }

      const currentY =
        activeSmoother?.scrollTop?.() ??
        window.scrollY ??
        0;

      const fallbackTargetY =
        currentY + target.getBoundingClientRect().top;

      const resolvedTargetY =
        targetId === "home"
          ? 0
          : activeSmoother?.offset?.(target, "top top") ??
            fallbackTargetY;

      const targetY = Math.max(0, resolvedTargetY);
      const distance = Math.abs(targetY - currentY);
      const viewportDistance =
        distance / Math.max(window.innerHeight, 1);

      // Nearby sections remain responsive, while longer jumps receive
      // more time so the movement never feels like a sudden snap.
      const duration = gsap.utils.clamp(
        2.1,
        4.2,
        1.95 + viewportDistance * 0.38
      );

      const scrollState = {
        y: currentY,
      };

      menuNavigationTweenRef.current = gsap.to(scrollState, {
        y: targetY,
        duration,
        ease: "power3.inOut",
        overwrite: true,
        onUpdate: () => {
          if (activeSmoother?.scrollTop) {
            activeSmoother.scrollTop(scrollState.y);
          } else {
            window.scrollTo({
              top: scrollState.y,
              left: 0,
              behavior: "auto",
            });
          }

          ScrollTrigger?.update?.();
        },
        onComplete: () => {
          menuNavigationTweenRef.current = null;

          if (activeSmoother?.scrollTop) {
            activeSmoother.scrollTop(targetY);
          } else {
            window.scrollTo({
              top: targetY,
              left: 0,
              behavior: "auto",
            });
          }

          ScrollTrigger?.update?.();
        },
      });
    });

    return undefined;
  }, [menuOpen]);

  useLayoutEffect(
    () => () => {
      document.documentElement.classList.remove("portfolio-menu-open");
      document.body.classList.remove("portfolio-menu-open");
      ScrollSmoother?.get?.()?.paused?.(false);
      menuNavigationTweenRef.current?.kill?.();
      menuNavigationTweenRef.current = null;
    },
    []
  );

  useLayoutEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const overlay = menuOverlayRef.current;

    if (!overlay) {
      return undefined;
    }

    const preventScroll = (event) => {
      event.preventDefault();
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = Array.from(
        overlay.querySelectorAll("[data-menu-focusable]")
      ).filter((element) => !element.hasAttribute("disabled"));

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, [menuOpen]);

  const openMenu = () => {
    if (!introRevealed) {
      return;
    }

    menuTargetRef.current = null;
    setMenuOpen(true);
  };

  const closeMenu = () => {
    menuTargetRef.current = null;
    setMenuOpen(false);
  };

  const navigateFromMenu = (event, targetId) => {
    event.preventDefault();
    menuTargetRef.current = targetId;
    setMenuOpen(false);
  };

  const navigateFromIndicator = (targetId) => {
    if (!introRevealed || menuOpen) {
      return;
    }

    const target = document.getElementById(targetId);

    if (!target) {
      return;
    }

    window.history.replaceState(null, "", `#${targetId}`);

    const activeSmoother = ScrollSmoother?.get?.();

    menuNavigationTweenRef.current?.kill?.();
    menuNavigationTweenRef.current = null;

    if (!gsap || prefersReducedMotion()) {
      if (activeSmoother?.scrollTo) {
        activeSmoother.scrollTo(target, false, "top top");
      } else {
        target.scrollIntoView({ behavior: "auto", block: "start" });
      }
      return;
    }

    const currentY =
      activeSmoother?.scrollTop?.() ?? window.scrollY ?? 0;

    const fallbackTargetY =
      currentY + target.getBoundingClientRect().top;

    const smootherTargetY =
      activeSmoother?.offset?.(target, "top top");

    const resolvedTargetY =
      targetId === "home"
        ? 0
        : Number.isFinite(smootherTargetY)
          ? smootherTargetY
          : fallbackTargetY;

    const maxScroll = Math.max(
      0,
      ScrollTrigger?.maxScroll?.(window) ??
        document.documentElement.scrollHeight - window.innerHeight
    );

    const targetY = Math.min(maxScroll, Math.max(0, resolvedTargetY));
    const distance = Math.abs(targetY - currentY);
    const viewportDistance = distance / Math.max(window.innerHeight, 1);
    const duration = gsap.utils.clamp(
      2.15,
      4.35,
      1.95 + viewportDistance * 0.38
    );

    const scrollState = { y: currentY };

    menuNavigationTweenRef.current = gsap.to(scrollState, {
      y: targetY,
      duration,
      ease: "power3.inOut",
      overwrite: true,
      onUpdate: () => {
        if (activeSmoother?.scrollTop) {
          activeSmoother.scrollTop(scrollState.y);
        } else {
          window.scrollTo({ top: scrollState.y, left: 0, behavior: "auto" });
        }
        ScrollTrigger?.update?.();
      },
      onComplete: () => {
        menuNavigationTweenRef.current = null;
        if (activeSmoother?.scrollTop) {
          activeSmoother.scrollTop(targetY);
        } else {
          window.scrollTo({ top: targetY, left: 0, behavior: "auto" });
        }
        ScrollTrigger?.update?.();
      },
    });
  };

  const learningTitle = language === "id"
    ? {
        lineOne: "BELAJAR",
        lineTwo: "LEWAT",
        lineThree: "PROYEK",
        supporting: "Saya belajar dengan membangun sesuatu yang nyata.",
        credit: "YouTube : Rizki Ramadhan",
        captionIndex: "01 / CATATAN BELAJAR",
        captionTitle: "Belajar Python dengan Membangun",
        captionBody: "Langkah pertama saya lahir dari eksperimen dan proyek.",
        cta: "Tonton di YouTube",
      }
    : {
        lineOne: "LEARNING",
        lineTwo: "BY",
        lineThree: "DOING",
        supporting: "I don't just learn it. I build it.",
        credit: "YouTube : Rizki Ramadhan",
        captionIndex: "01 / LEARNING LOG",
        captionTitle: "Learning Python by Building",
        captionBody: "My first steps weren't courses. They were experiments.",
        cta: "Watch on YouTube",
      };

  const persistentUi = (
    <div className="portfolio-persistent-ui" aria-hidden={false}>
      <p
        ref={persistentNameRef}
        className="portfolio-persistent-name monument-identity"
        aria-label={profile.name}
      >
        {profile.name}
      </p>

      <button
        type="button"
        className={`portfolio-menu-trigger${menuOpen ? " is-open" : ""}${introRevealed ? "" : " is-hidden"}`}
        aria-label={language === "id" ? "Buka menu navigasi" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls="portfolio-navigation-overlay"
        onClick={openMenu}
      >
        <span />
        <span />
        <span />
      </button>

      <aside
        ref={sectionIndicatorRef}
        className={`portfolio-section-indicator${introRevealed && !menuOpen ? " is-visible" : ""}`}
        aria-label={language === "id" ? "Posisi halaman saat ini" : "Current section"}
      >
        <div className="portfolio-section-indicator__track">
          <div className="portfolio-section-indicator__segments">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`portfolio-section-indicator__segment${
                  item.id === activeSectionId ? " is-active" : ""
                }`}
                style={{
                  "--section-progress": `var(--portfolio-section-progress-${index}, 0)`,
                  "--section-weight": `var(--portfolio-section-weight-${index}, 1)`,
                }}
                aria-label={
                  language === "id" ? `Ke ${item.label}` : `Go to ${item.label}`
                }
                data-section-label={item.label}
                aria-current={item.id === activeSectionId ? "location" : undefined}
                onClick={() => navigateFromIndicator(item.id)}
              >
                <span className="portfolio-section-indicator__segment-rail" />
                <span className="portfolio-section-indicator__segment-fill" />
              </button>
            ))}
          </div>

          <div className="portfolio-section-indicator__head">
            <span
              key={`${activeSectionId}-${language}`}
              className="portfolio-section-indicator__label"
            >
              {menuItems.find((item) => item.id === activeSectionId)?.label}
            </span>

          </div>
        </div>
      </aside>

      <div
        id="portfolio-navigation-overlay"
        ref={menuOverlayRef}
        className={`portfolio-menu-overlay${menuOpen ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={language === "id" ? "Menu navigasi" : "Navigation menu"}
        aria-hidden={!menuOpen}
      >
        <div className="portfolio-menu-shell">
          <div className="portfolio-menu-topbar" data-menu-chrome>
            <div className="portfolio-menu-heading">
              <span className="portfolio-menu-eyebrow">
                {language === "id" ? "NAVIGASI" : "NAVIGATION"}
              </span>
              <strong>{profile.name}</strong>
            </div>

            <button
              ref={menuCloseRef}
              type="button"
              className="portfolio-menu-close"
              data-menu-focusable
              onClick={closeMenu}
              aria-label={language === "id" ? "Tutup menu" : "Close menu"}
            >
              <span>{language === "id" ? "TUTUP" : "CLOSE"}</span>
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <nav className="portfolio-menu-grid" aria-label="Primary">
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="portfolio-menu-card"
                data-menu-card
                data-menu-focusable
                onClick={(event) => navigateFromMenu(event, item.id)}
              >
                <span className="portfolio-menu-card__index">{item.index}</span>
                <span className="portfolio-menu-card__label">{item.label}</span>
                <span className="portfolio-menu-card__arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </nav>

          <div className="portfolio-menu-footer" data-menu-chrome>
            <span>PORTFOLIO / 2026</span>
            <span>JAKARTA / ID</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {typeof document !== "undefined"
        ? createPortal(persistentUi, document.body)
        : persistentUi}

      <main>
        <section id="home" ref={heroRef} className="learning-hero">
          <div className="learning-hero__background" aria-hidden="true" />
          <div ref={pawTrailLayerRef} className="hero-paw-trail-layer" aria-hidden="true" />

          <div className="learning-hero__inner">
            <div ref={heroCopyRef} className="learning-hero__copy">
              <h1 className="learning-hero__title horizon-display" aria-label={language === "id" ? "Belajar lewat proyek" : "Learning by doing"}>
                <span>{learningTitle.lineOne}</span>
                <span>{learningTitle.lineTwo}</span>
                <span>{learningTitle.lineThree}</span>
              </h1>

              <p className="learning-hero__supporting montserrat-copy">
                {learningTitle.supporting}
              </p>
            </div>

            <div ref={mediaColumnRef} className="learning-hero__media-column">
              <div ref={videoShellRef} className="learning-hero__video-shell">
                <div className="learning-hero__video-frame">
                  <video
                    ref={localVideoRef}
                    className="learning-hero__video"
                    src={LOCAL_VIDEO_URL}
                    muted
                    loop
                    playsInline
                    preload="none"
                    poster="/images/og-cover.png"
                    disablePictureInPicture
                    controls={false}
                    aria-label="Learning Python by Building"
                  />
                </div>

                <p ref={videoCreditRef} className="learning-hero__video-credit montserrat-copy">
                  {learningTitle.credit}
                </p>
              </div>

              <div ref={captionRef} className="learning-hero__caption">
                <p className="learning-hero__caption-index montserrat-copy">
                  {learningTitle.captionIndex}
                </p>
                <h2 className="learning-hero__caption-title montserrat-copy">
                  {learningTitle.captionTitle}
                </h2>
                <p className="learning-hero__caption-body montserrat-copy">
                  {learningTitle.captionBody}
                </p>
                <a
                  className="learning-hero__button montserrat-copy"
                  href={YOUTUBE_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  {learningTitle.cta}
                </a>
              </div>
            </div>
          </div>
        </section>

        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <JourneySection />
        <ContactSection />
      </main>
    </>
  );
}
