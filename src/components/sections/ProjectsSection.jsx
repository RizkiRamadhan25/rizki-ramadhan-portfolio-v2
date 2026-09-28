import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";

import { projects } from "../../data/projects";
import {
  gsap,
  ScrollTrigger,
  prefersReducedMotion,
} from "../../lib/gsap";

import "../../styles/projects-hover-showcase.css";

function formatDisplayTitle(title) {
  return title
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

function getProjectDisplayTitle(title) {
  const displayTitle = formatDisplayTitle(title).toUpperCase();

  if (displayTitle === "CPU SCHEDULING SIMULATOR") {
    return "CPU SCHEDULING";
  }

  return displayTitle;
}

function renderWaveText(text, keyPrefix = "char") {
  const characters = [...text];

  return characters.map((char, index) => {
    const isSpace = char === " ";
    const reverseIndex = characters.length - 1 - index;

    return (
      <span
        key={`${keyPrefix}-${index}`}
        className={`project-wave-char${isSpace ? " is-space" : ""}`}
        style={{
          "--char-delay-in": `${index * 6}ms`,
          "--char-delay-out": `${reverseIndex * 6}ms`,
        }}
        aria-hidden="true"
      >
        {isSpace ? "\u00A0" : char}
      </span>
    );
  });
}

function ProjectWaveTitle({ project }) {
  const title = getProjectDisplayTitle(project.title);

  return (
    <h3 className="project-horizon-title" aria-label={title}>
      <span className="project-horizon-line-window">
        <span className="project-horizon-title__layer project-horizon-title__layer--base">
          {renderWaveText(title, `${project.id}-base`)}
        </span>

        <span className="project-horizon-title__layer project-horizon-title__layer--clone">
          {renderWaveText(title, `${project.id}-clone`)}
        </span>
      </span>
    </h3>
  );
}

const previewPlacementPattern = ["center", "left", "right", "center", "right", "left"];
const previewRotationPattern = [-6.8, 4.9, -3.6, 6.1, -5.2, 3.8];
const rowOffsets = ["0vw", "2.2vw", "-1.15vw", "1.35vw", "-0.7vw", "1.6vw"];

export default function ProjectsSection() {
  const sectionRef = useRef(null);
  const listRef = useRef(null);
  const previewRef = useRef(null);
  const previewImageRef = useRef(null);
  const previewVisibleRef = useRef(false);
  const pointerTargetRef = useRef({ x: 0, y: 0 });
  const pointerCurrentRef = useRef({ x: 0, y: 0 });
  const activePlacementRef = useRef("center");
  const activeRotationRef = useRef(-5.4);
  const wobbleSeedRef = useRef(0);

  const featuredProjects = useMemo(
    () => projects.filter((project) => project.featured),
    []
  );

  const setPreviewContent = (project) => {
    if (!previewImageRef.current) return;

    previewImageRef.current.src = project.image;
    previewImageRef.current.alt = `${project.title} project preview`;
  };

  const getSafePreviewPosition = useCallback((clientX, clientY, placement = "center") => {
    const preview = previewRef.current;
    const width = preview?.offsetWidth || 300;
    const height = preview?.offsetHeight || 216;
    const padding = 24;

    let desiredX;
    let desiredY;

    if (placement === "left") {
      desiredX = clientX - width * 0.58;
      desiredY = clientY - height * 0.04;
    } else if (placement === "right") {
      desiredX = clientX + width * 0.58;
      desiredY = clientY + height * 0.02;
    } else {
      desiredX = clientX;
      desiredY = clientY - height * 0.12;
    }

    return {
      x: gsap.utils.clamp(
        width / 2 + padding,
        window.innerWidth - width / 2 - padding,
        desiredX
      ),
      y: gsap.utils.clamp(
        height / 2 + padding,
        window.innerHeight - height / 2 - padding,
        desiredY
      ),
    };
  }, []);

  const updatePreviewTarget = useCallback((clientX, clientY, immediate = false) => {
    if (!gsap || !previewRef.current) return;

    const safe = getSafePreviewPosition(
      clientX,
      clientY,
      activePlacementRef.current
    );

    pointerTargetRef.current = safe;

    if (immediate) {
      pointerCurrentRef.current = { ...safe };
      gsap.set(previewRef.current, { x: safe.x, y: safe.y });
    }
  }, [getSafePreviewPosition]);

  const showPreview = (project, index, event) => {
    if (
      !gsap ||
      !previewRef.current ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    setPreviewContent(project);
    activePlacementRef.current =
      previewPlacementPattern[index % previewPlacementPattern.length];
    activeRotationRef.current =
      previewRotationPattern[index % previewRotationPattern.length];
    wobbleSeedRef.current = index * 1.31 + 0.65;

    const clientX = event?.clientX ?? window.innerWidth * 0.5;
    const clientY = event?.clientY ?? window.innerHeight * 0.5;

    updatePreviewTarget(clientX, clientY, true);
    previewVisibleRef.current = true;

    gsap.killTweensOf(previewRef.current);
    gsap.fromTo(
      previewRef.current,
      {
        autoAlpha: 0,
        scale: 0.76,
        rotation: activeRotationRef.current * 1.45,
      },
      {
        autoAlpha: 1,
        scale: 1,
        rotation: activeRotationRef.current,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      }
    );
  };

  const movePreview = (event) => {
    if (!previewVisibleRef.current || event.pointerType === "touch") return;
    updatePreviewTarget(event.clientX, event.clientY, false);
  };

  const hidePreview = () => {
    previewVisibleRef.current = false;

    if (!gsap || !previewRef.current) return;

    gsap.to(previewRef.current, {
      autoAlpha: 0,
      scale: 0.8,
      rotation: activeRotationRef.current * 1.18,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    const preview = previewRef.current;

    if (!section || !list || !gsap || !ScrollTrigger) return undefined;

    const rows = gsap.utils.toArray("[data-project-index-card]", list);

    const context = gsap.context(() => {
      if (preview) {
        gsap.set(preview, {
          xPercent: -50,
          yPercent: -50,
          autoAlpha: 0,
          scale: 0.76,
          rotation: activeRotationRef.current,
          transformOrigin: "50% 50%",
        });
      }

      if (!prefersReducedMotion()) {
        rows.forEach((row, index) => {
          gsap.fromTo(
            row,
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.84,
              ease: "power3.out",
              scrollTrigger: {
                trigger: row,
                start: "top 92%",
                once: true,
              },
              delay: index * 0.03,
            }
          );
        });
      }

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onLeave: hidePreview,
        onLeaveBack: hidePreview,
      });
    }, section);

    const handlePointerMove = (event) => {
      if (!previewVisibleRef.current || event.pointerType === "touch") return;
      updatePreviewTarget(event.clientX, event.clientY, false);
    };

    const followPointer = () => {
      if (!previewVisibleRef.current || !previewRef.current) return;

      const current = pointerCurrentRef.current;
      const target = pointerTargetRef.current;
      const t = gsap.ticker.time;
      const wobbleSeed = wobbleSeedRef.current;
      const baseRotation = activeRotationRef.current;

      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;

      const driftX = Math.sin(t * 1.45 + wobbleSeed) * 5.2;
      const driftY = Math.cos(t * 1.15 + wobbleSeed * 0.85) * 4.4;
      const driftRotation = baseRotation + Math.sin(t * 1.08 + wobbleSeed * 0.4) * 0.92;

      gsap.set(previewRef.current, {
        x: current.x + driftX,
        y: current.y + driftY,
        rotation: driftRotation,
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    gsap.ticker.add(followPointer);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      gsap.ticker.remove(followPointer);
      context.revert();
    };
  }, [featuredProjects.length, updatePreviewTarget]);


  const previewPortal =
    typeof document !== "undefined"
      ? createPortal(
          <div ref={previewRef} className="project-hover-preview" aria-hidden="true">
            <img
              ref={previewImageRef}
              src={featuredProjects[0]?.image}
              alt=""
              width="1400"
              height="900"
              decoding="async"
            />
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <section
        id="projects"
        ref={sectionRef}
        className="projects-section projects-horizon-section"
      >
        <div className="projects-horizon-shell">
          <div ref={listRef} className="projects-horizon-list">
            {featuredProjects.map((project, index) => {
              const displayTitle = getProjectDisplayTitle(project.title);
              const isWideTitle = displayTitle === "CPU SCHEDULING";

              return (
                <div
                  key={project.id}
                  className={`project-horizon-row${
                    isWideTitle ? " project-horizon-row--wide" : ""
                  }`}
                  data-project-index-card
                >
                  <Link
                    to={`/projects/${project.slug}`}
                    className="project-horizon-hitbox"
                    aria-label={`View project: ${displayTitle}`}
                    style={{ "--project-offset": rowOffsets[index % rowOffsets.length] }}
                    onPointerEnter={(event) => showPreview(project, index, event)}
                    onPointerMove={movePreview}
                    onPointerLeave={hidePreview}
                    onFocus={(event) => showPreview(project, index, event)}
                    onBlur={hidePreview}
                  >
                    <span className="project-horizon-row__number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <ProjectWaveTitle project={project} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {previewPortal}
    </>
  );
}
