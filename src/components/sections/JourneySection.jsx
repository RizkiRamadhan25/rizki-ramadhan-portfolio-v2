import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { useLanguage } from "../../context/language-context";
import { journeyItems } from "../../data/journey";
import {
  gsap,
  Observer,
  ScrollTrigger,
  prefersReducedMotion,
} from "../../lib/gsap";

import "../../styles/journey-depth-stack.css";

const PARTICLE_COUNT = 230;
const PARTICLE_DEPTH = 4300;
const PARTICLE_NEAR = 140;

function seededRandom(seed) {
  let value = seed >>> 0;

  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createDepthParticles() {
  const random = seededRandom(24081999);

  return Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
    id: index,
    x: (random() - 0.5) * 1900,
    y: (random() - 0.5) * 1200,
    z: PARTICLE_NEAR + random() * PARTICLE_DEPTH,
    weight: 0.45 + random() * 0.95,
  }));
}

const DEPTH_PARTICLES = createDepthParticles();

function drawDepthField(ctx, width, height, dpr, progress, pointer) {
  ctx.clearRect(0, 0, width * dpr, height * dpr);
  ctx.save();
  ctx.scale(dpr, dpr);

  const cameraDepth = progress * 3300;
  const vanishingX = width * (0.5 + (pointer.x - 0.5) * 0.05);
  const vanishingY = height * (0.47 + (pointer.y - 0.5) * 0.035);
  const perspective = Math.max(680, width * 0.62);

  for (const particle of DEPTH_PARTICLES) {
    let relativeZ = particle.z - cameraDepth;

    while (relativeZ <= PARTICLE_NEAR) {
      relativeZ += PARTICLE_DEPTH;
    }

    const scale = perspective / relativeZ;
    const x = vanishingX + particle.x * scale;
    const y = vanishingY + particle.y * scale;

    if (
      x < -40 ||
      x > width + 40 ||
      y < -40 ||
      y > height + 40
    ) {
      continue;
    }

    const depthFactor = Math.min(1, Math.max(0, 1 - relativeZ / PARTICLE_DEPTH));
    const radius = Math.min(1.8, 0.25 + scale * 1.45 * particle.weight);
    const alpha = 0.08 + depthFactor * 0.48;

    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgb(218, 227, 255)";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const vignette = ctx.createRadialGradient(
    vanishingX,
    vanishingY,
    0,
    vanishingX,
    vanishingY,
    Math.max(width, height) * 0.68
  );

  vignette.addColorStop(0, "rgba(78, 96, 155, 0.10)");
  vignette.addColorStop(0.46, "rgba(22, 27, 43, 0.04)");
  vignette.addColorStop(1, "rgba(4, 6, 10, 0)");

  ctx.globalAlpha = 1;
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  ctx.restore();
}

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

export default function JourneySection() {
  const { language, t } = useLanguage();

  const rootRef = useRef(null);
  const sceneRef = useRef(null);
  const deckRef = useRef(null);
  const canvasRef = useRef(null);
  const stageRefs = useRef([]);
  const connectorPathRef = useRef(null);
  const connectorGlowRef = useRef(null);
  const connectorIndicatorHaloRef = useRef(null);
  const connectorIndicatorCoreRef = useRef(null);
  const progressRef = useRef(0);
  const progressFillRef = useRef(null);
  const progressCurrentRef = useRef(null);
  const vanishRingRef = useRef(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });
  const [compactLayout, setCompactLayout] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 1024px)").matches
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const query = window.matchMedia("(max-width: 1024px)");
    const handleChange = (event) => setCompactLayout(event.matches);

    query.addEventListener?.("change", handleChange);

    return () => query.removeEventListener?.("change", handleChange);
  }, []);

  const localizedItems = useMemo(
    () =>
      journeyItems.map((item, index) => ({
        ...item,
        index,
        period: item.period[language] || item.period.en,
        title: item.title[language] || item.title.en,
        description: item.description[language] || item.description.en,
        highlights: item.highlights[language] || item.highlights.en,
        statusLabel: t.journey.status[item.status],
      })),
    [language, t.journey.status]
  );

  useEffect(() => {
    const scene = sceneRef.current;
    const canvas = canvasRef.current;

    if (!scene || !canvas) {
      return undefined;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    let frameId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = scene.getBoundingClientRect();

      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const render = () => {
      drawDepthField(
        ctx,
        width,
        height,
        dpr,
        progressRef.current,
        pointerRef.current
      );

      frameId = window.requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    frameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const scene = sceneRef.current;
    const deck = deckRef.current;

    if (!root || !scene || !deck || !gsap || !ScrollTrigger) {
      return undefined;
    }

    stageRefs.current = stageRefs.current.slice(0, journeyItems.length);

    if (prefersReducedMotion()) {
      gsap.set(stageRefs.current, {
        clearProps: "transform,opacity,filter",
      });
      return undefined;
    }

    let observer;

    const context = gsap.context(() => {
      const connectorPath = connectorPathRef.current;
      const connectorGlow = connectorGlowRef.current;
      const connectorLength = connectorPath?.getTotalLength?.() || 1;

      gsap.set([connectorPath, connectorGlow], {
        strokeDasharray: `0 ${connectorLength}`,
        strokeDashoffset: 0,
      });

      gsap.set(
        [connectorIndicatorHaloRef.current, connectorIndicatorCoreRef.current],
        {
          autoAlpha: 0,
        }
      );

      const getOffsets = (index) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const compact = width < 900;

        const desktop = [
          { x: -0.18, y: 0.005 },
          { x: 0.17, y: -0.02 },
          { x: -0.09, y: -0.045 },
          { x: 0.095, y: -0.07 },
        ];

        const mobile = [
          { x: -0.03, y: 0.02 },
          { x: 0.04, y: -0.005 },
          { x: -0.025, y: -0.03 },
          { x: 0.025, y: -0.055 },
        ];

        const source = compact ? mobile : desktop;
        const preset = source[index % source.length];

        return {
          x: width * preset.x,
          y: height * preset.y,
        };
      };

      const updateScene = (progress) => {
        progressRef.current = progress;

        const count = journeyItems.length;
        const cameraMax = Math.max(1, count - 1 + 0.78);
        const camera = progress * cameraMax;
        const perspectiveDistance = window.innerWidth < 900 ? 760 : 1080;

        let nearestIndex = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;

        stageRefs.current.forEach((stage, index) => {
          if (!stage) {
            return;
          }

          const relative = index - camera;
          const offsets = getOffsets(index);

          if (Math.abs(relative) < nearestDistance) {
            nearestDistance = Math.abs(relative);
            nearestIndex = index;
          }

          let z;
          let scale = 1;
          let blur;
          let rotateX;
          let rotateY;

          if (relative >= 0) {
            z = -relative * perspectiveDistance;
            blur = Math.min(7, relative * 1.7);
            rotateX = relative * -1.1;
            rotateY = (index % 2 === 0 ? -1 : 1) * relative * 1.4;
          } else {
            const passed = -relative;

            z = passed * perspectiveDistance * 0.72;
            scale = 1 + passed * 0.18;
            blur = Math.min(15, passed * 10);
            rotateX = passed * 1.2;
            rotateY = (index % 2 === 0 ? 1 : -1) * passed * 1.5;
          }

          const activeClarity = clamp01(1 - Math.abs(relative) * 0.78);

          // Only the current Journey and the immediately following Journey
          // are allowed to remain visible.
          //
          // relative = 0  -> current item, fully visible
          // relative = 1  -> next item, intentionally faint
          // relative < 0  -> previous item fades away rapidly
          // relative > ~1.7 -> future items remain fully hidden
          const activeVisibility = clamp01(
            1 - Math.abs(relative) / 0.72
          );

          const nextVisibility =
            relative > 0
              ? clamp01(1 - Math.abs(relative - 1) / 0.68) * 0.14
              : 0;

          const stageVisibility = Math.max(
            activeVisibility,
            nextVisibility
          );

          gsap.set(stage, {
            xPercent: -50,
            yPercent: -50,
            x: offsets.x,
            y: offsets.y,
            z,
            scale,
            autoAlpha: stageVisibility,
            visibility: stageVisibility > 0.002 ? "visible" : "hidden",
            filter: `blur(${blur}px)`,
            rotateX,
            rotateY,
            zIndex: Math.round(1000 - Math.abs(relative) * 100),
          });

          const title = stage.querySelector("h3");

          if (title) {
            gsap.set(title, {
              yPercent: (1 - activeClarity) * 12,
              autoAlpha: 0.45 + activeClarity * 0.55,
            });
          }

          const details = stage.querySelectorAll("[data-journey-depth-detail]");

          if (details.length) {
            gsap.set(details, {
              autoAlpha: 0.32 + activeClarity * 0.68,
              y: (1 - activeClarity) * 10,
            });
          }
        });

        const connectorProgress = clamp01(progress);
        const connectorDrawnLength = connectorLength * connectorProgress;

        gsap.set([connectorPath, connectorGlow], {
          strokeDasharray: `${connectorDrawnLength} ${connectorLength}`,
          strokeDashoffset: 0,
        });

        if (
          connectorPath &&
          connectorIndicatorHaloRef.current &&
          connectorIndicatorCoreRef.current
        ) {
          const point = connectorPath.getPointAtLength(
            connectorDrawnLength
          );
          const indicatorVisible =
            connectorProgress > 0.004 && connectorProgress < 0.998;

          gsap.set(
            [
              connectorIndicatorHaloRef.current,
              connectorIndicatorCoreRef.current,
            ],
            {
              attr: {
                cx: point.x,
                cy: point.y,
              },
              autoAlpha: indicatorVisible ? 1 : 0,
            }
          );

          gsap.set(connectorIndicatorHaloRef.current, {
            attr: {
              r:
                10 +
                Math.sin(connectorProgress * Math.PI * 14) * 1.5,
            },
          });

          gsap.set(connectorIndicatorCoreRef.current, {
            attr: {
              r:
                3.1 +
                Math.sin(connectorProgress * Math.PI * 18) * 0.35,
            },
          });
        }

        if (progressFillRef.current) {
          gsap.set(progressFillRef.current, {
            scaleX: Math.max(0.025, progress),
          });
        }

        if (progressCurrentRef.current) {
          progressCurrentRef.current.textContent = String(
            Math.min(journeyItems.length, nearestIndex + 1)
          ).padStart(2, "0");
        }

        if (vanishRingRef.current) {
          gsap.set(vanishRingRef.current, {
            scale: 0.88 + progress * 0.72,
            rotate: progress * 56,
            autoAlpha: 0.34 - progress * 0.14,
          });
        }
      };

      updateScene(0);

      ScrollTrigger.create({
        id: "journey-depth-stack",
        trigger: root,
        start: "top top",
        end: () =>
          `+=${Math.max(
            window.innerHeight * (journeyItems.length * 1.48),
            4200
          )}`,
        pin: scene,
        scrub: 0.85,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => updateScene(self.progress),
        onRefresh: (self) => updateScene(self.progress),
      });

      observer = Observer?.create?.({
        target: scene,
        type: "wheel,touch,pointer",
        preventDefault: false,
        tolerance: 8,
        onUp: () => {
          gsap.to(deck, {
            rotateX: -1.4,
            rotateY: 0.55,
            duration: 0.25,
            ease: "power2.out",
            overwrite: "auto",
          });

          gsap.to(deck, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.62,
            delay: 0.08,
            ease: "power3.out",
            overwrite: "auto",
          });
        },
        onDown: () => {
          gsap.to(deck, {
            rotateX: 1.4,
            rotateY: -0.55,
            duration: 0.25,
            ease: "power2.out",
            overwrite: "auto",
          });

          gsap.to(deck, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.62,
            delay: 0.08,
            ease: "power3.out",
            overwrite: "auto",
          });
        },
      });

      const handlePointerMove = (event) => {
        const rect = scene.getBoundingClientRect();

        pointerRef.current = {
          x: clamp01((event.clientX - rect.left) / rect.width),
          y: clamp01((event.clientY - rect.top) / rect.height),
        };

        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          gsap.to(deck, {
            rotateY: (pointerRef.current.x - 0.5) * 1.25,
            rotateX: (0.5 - pointerRef.current.y) * 0.85,
            duration: 0.65,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
      };

      const handlePointerLeave = () => {
        pointerRef.current = { x: 0.5, y: 0.5 };

        gsap.to(deck, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.7,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      scene.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });
      scene.addEventListener("pointerleave", handlePointerLeave);

      return () => {
        scene.removeEventListener("pointermove", handlePointerMove);
        scene.removeEventListener("pointerleave", handlePointerLeave);
        observer?.kill?.();
      };
    }, root);

    return () => {
      context.revert();
    };
  }, []);

  if (prefersReducedMotion() || compactLayout) {
    return (
      <section
        key="journey-compact"
        id="journey"
        className={`journey-depth journey-depth--reduced${
          compactLayout ? " journey-depth--responsive" : ""
        }`}
      >
        <header>
          <p>{t.journey.eyebrow}</p>
          <h2>{t.journey.title}</h2>
          <span>{t.journey.description}</span>
        </header>

        <div className="journey-depth__reduced-list">
          {localizedItems.map((item) => (
            <article key={item.id}>
              <span>{item.period}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section key="journey-desktop" id="journey" ref={rootRef} className="journey-depth">
      <div ref={sceneRef} className="journey-depth__scene">
<div className="journey-depth__vignette" aria-hidden="true" />
<div className="journey-depth__vanish" aria-hidden="true">
          <span ref={vanishRingRef} data-journey-vanish-ring />
        </div>

        <svg
          className="journey-depth__connectors"
          viewBox="0 0 1000 700"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <filter
              id="journey-connector-glow"
              x="-80%"
              y="-80%"
              width="260%"
              height="260%"
            >
              <feGaussianBlur stdDeviation="5.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter
              id="journey-indicator-glow"
              x="-120%"
              y="-120%"
              width="340%"
              height="340%"
            >
              <feGaussianBlur stdDeviation="6.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            className="journey-depth__connector-base"
            d="M 315 555
               C 430 540, 585 495, 655 405
               S 590 285, 455 245
               S 505 165, 585 118"
          />

          <path
            ref={connectorGlowRef}
            className="journey-depth__connector-glow"
            d="M 315 555
               C 430 540, 585 495, 655 405
               S 590 285, 455 245
               S 505 165, 585 118"
          />

          <path
            ref={connectorPathRef}
            className="journey-depth__connector-progress"
            d="M 315 555
               C 430 540, 585 495, 655 405
               S 590 285, 455 245
               S 505 165, 585 118"
          />

          <circle
            ref={connectorIndicatorHaloRef}
            className="journey-depth__connector-indicator-halo"
            cx="315"
            cy="555"
            r="10"
          />

          <circle
            ref={connectorIndicatorCoreRef}
            className="journey-depth__connector-indicator-core"
            cx="315"
            cy="555"
            r="3.2"
          />
        </svg>

        <div ref={deckRef} className="journey-depth__deck">
          {localizedItems.map((item, index) => (
            <article
              key={item.id}
              ref={(element) => {
                stageRefs.current[index] = element;
              }}
              className="journey-depth__stage"
              data-journey-depth-stage
            >
              <div className="journey-depth__stage-top">
                <span className="journey-depth__period">
                  {item.period}
                </span>
              </div>

              <h3>{item.title}</h3>

              <p
                className="journey-depth__description"
                data-journey-depth-detail
              >
                {item.description}
              </p>

              <div
                className="journey-depth__meta"
                data-journey-depth-detail
              >
                <span
                  className={`journey-depth__status journey-depth__status--${item.status}`}
                >
                  {item.statusLabel}
                </span>
              </div>

              <ul
                className="journey-depth__highlights"
                data-journey-depth-detail
              >
                {item.highlights.slice(0, 4).map((highlight, highlightIndex) => (
                  <li key={highlight}>
                    <span>
                      {String(highlightIndex + 1).padStart(2, "0")}
                    </span>
                    <p>{highlight}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
