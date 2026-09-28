import { useLayoutEffect, useRef, useState } from "react";
import { useLanguage } from "../../context/language-context";

import {
  gsap,
  ScrollTrigger,
  prefersReducedMotion,
} from "../../lib/gsap";
import "../../styles/skills-wave-section.css";

const skillGroups = [
  {
    id: "programming",
    title: { id: "Bahasa Pemrograman", en: "Programming Languages" },
    items: ["Python", "PHP", "JavaScript", "HTML", "CSS", "SQL"],
  },
  {
    id: "frameworks",
    title: { id: "Framework dan Pustaka", en: "Frameworks and Libraries" },
    items: [
      "Laravel",
      "React",
      "Tailwind CSS",
      "Pandas",
      "Scikit-learn",
      "Chart.js",
    ],
  },
  {
    id: "databases",
    title: { id: "Basis Data", en: "Databases" },
    items: ["MongoDB", "MySQL"],
  },
  {
    id: "tools",
    title: { id: "Alat dan Platform", en: "Tools and Platforms" },
    items: [
      "Git",
      "GitHub",
      "VS Code",
      "Laragon",
      "Jupyter Notebook",
      "MongoDB Compass",
    ],
  },
  {
    id: "learning",
    title: { id: "Sedang Dipelajari", en: "Currently Learning" },
    items: [
      "React",
      "Software Engineering",
      "Data Science",
      "Object-Oriented Analysis and Design",
    ],
  },
];

const clamp01 = (value) => Math.min(1, Math.max(0, value));

export default function SkillsSection() {
  const { language, t } = useLanguage();
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const listRef = useRef(null);
  const groupsRef = useRef(null);
  const redRibbonRef = useRef(null);
  const redMaskPathRef = useRef(null);
  const [compactLayout, setCompactLayout] = useState(() =>
    window.matchMedia("(max-width: 1024px)").matches
  );

  useLayoutEffect(() => {
    const query = window.matchMedia("(max-width: 1024px)");
    const handleChange = (event) => setCompactLayout(event.matches);

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const list = listRef.current;
    const groups = groupsRef.current;
    const redRibbon = redRibbonRef.current;
    const redMaskPath = redMaskPathRef.current;

    if (
      !root ||
      !stage ||
      !list ||
      !groups ||
      !redRibbon ||
      !redMaskPath ||
      !gsap ||
      !ScrollTrigger
    ) {
      return undefined;
    }

    if (compactLayout) {
      ScrollTrigger.getById("skills-wave-entry")?.kill();
      ScrollTrigger.getById("skills-wave-scroll")?.kill();
      return undefined;
    }

    const context = gsap.context(() => {
      const rows = gsap.utils.toArray("[data-skill-row]", list);
      const panels = gsap.utils.toArray("[data-skill-panel]", groups);
      const panelItems = panels.map((panel) =>
        gsap.utils.toArray("[data-skill-item]", panel)
      );

      const maxIndex = skillGroups.length - 1;

      /*
       * Total SVG path length used by the scroll-synced dash animation.
       *
       * This declaration was accidentally removed in v24 while the old
       * virtual-Y lookup table was being deleted. Without it, assigning
       * `ribbonPathLength = redPath.getTotalLength()` throws a ReferenceError
       * and prevents the whole React page from mounting.
       */
      let ribbonPathLength = 0;

      const render = (
        position,
        entrance = 1,
        ribbonScrollProgress = 0
      ) => {
        const rowHeight =
          rows[0]?.getBoundingClientRect().height ||
          window.innerHeight * 0.2;
        const desiredCenter =
          window.innerHeight * 0.5 - rowHeight * 0.5;

        /*
         * The complete category list is intentionally taller than the
         * viewport and travels vertically as scroll progresses.
         */
        const trackY = desiredCenter - position * rowHeight;

        // Both columns use the same Y value, so every skill group remains
        // horizontally aligned with its title while scrolling.
        gsap.set(list, {
          y: trackY,
        });

        gsap.set(groups, {
          y: trackY,
        });

        rows.forEach((row, index) => {
          const distance = Math.abs(index - position);
          const influence = Math.exp(-1.32 * distance * distance);

          const entryVisibility = 0.18 + 0.82 * entrance;
          const visibleInfluence = influence * entryVisibility;

          /*
           * Three readable states:
           *
           * 1. Current group
           *    -> white / full visibility.
           *
           * 2. Groups already passed
           *    -> medium gray instead of almost black.
           *
           * 3. Groups not reached yet
           *    -> keep the original dark treatment.
           *
           * passedAmount changes continuously from 0 -> 1 as the scroll
           * moves beyond a row, so the transition never snaps abruptly.
           */
          const passedAmount = gsap.utils.clamp(
            0,
            1,
            position - index
          );

          const inactiveColor = gsap.utils.interpolate(
            "#242424",
            "#7a7a7a",
            passedAmount
          );

          const inactiveOpacity =
            0.18 + 0.46 * passedAmount;

          gsap.set(row, {
            x: 56 - 92 * influence,
            scale: 0.95 + 0.065 * influence,
            opacity:
              (
                inactiveOpacity +
                (1 - inactiveOpacity) * influence
              ) * entryVisibility,
            color: gsap.utils.interpolate(
              inactiveColor,
              "#f6f6f3",
              visibleInfluence
            ),
            transformOrigin: "0% 50%",
          });
        });

        panels.forEach((panel, index) => {
          const distance = Math.abs(index - position);
          const influence = Math.exp(-1.18 * distance * distance);

          // The panel itself is no longer independently translated.
          // Its exit animation is the shared vertical track movement:
          // it travels upward with the matching title and naturally
          // passes beyond the top edge of the screen.
          const panelEntrance = 0.12 + 0.88 * entrance;

          gsap.set(panel, {
            autoAlpha:
              (0.12 + 0.88 * influence) * panelEntrance,
            scale: 0.97 + 0.03 * influence,
            filter: `blur(${(1 - influence) * 4 + (1 - entrance) * 2}px)`,
            pointerEvents:
              entrance > 0.92 && influence > 0.58
                ? "auto"
                : "none",
          });

          panelItems[index].forEach((item, itemIndex) => {
            const itemInfluence = clamp01(
              influence - itemIndex * 0.018
            );

            gsap.set(item, {
              autoAlpha:
                (0.12 + 0.88 * itemInfluence) * panelEntrance,
              scale: 0.985 + 0.015 * itemInfluence,
            });
          });
        });

        /*
         * RED RIBBON — MASKED GSAP REVEAL V27
         * ------------------------------------------------------------------
         * The visible red path is NEVER dashed.
         *
         * A second invisible white path lives inside an SVG mask and is the
         * only path animated by GSAP. Its reveal dash grows from screen-left
         * and uses a ROUND linecap, so the moving red endpoint stays rounded.
         *
         * The gap is longer than the entire path, therefore the dash pattern
         * cannot wrap around and expose the real right endpoint prematurely.
         *
         * Raw ScrollTrigger progress maps directly to visible mask length:
         *
         *   0%   -> mask completely closed
         *   25%  -> first quarter revealed from screen-left
         *   50%  -> half revealed
         *   75%  -> three quarters revealed
         *   100% -> full red path revealed and already outside screen-right
         */
        const progress = clamp01(
          ribbonScrollProgress
        );

        /*
         * Grow the MASK itself from the beginning of the path.
         *
         * This is important for the moving tip:
         * - the mask uses a ROUND linecap,
         * - the first dash grows from 0 -> full path length,
         * - the gap is deliberately longer than the complete path,
         *   so the pattern can never wrap around and reveal screen-right early.
         *
         * Result: the red ribbon's moving endpoint stays rounded throughout
         * the entire scroll, not only when the complete path is visible.
         */
        const maskVisibleLength =
          ribbonPathLength * progress;

        gsap.set(redRibbon, {
          y: 0,
          height: "100%",
          force3D: true,
        });

        gsap.set(redMaskPath, {
          strokeDasharray:
            `${maskVisibleLength} ${
              ribbonPathLength * 2 + 48
            }`,
          strokeDashoffset: 0,
        });
      };

      ribbonPathLength =
        redMaskPath.getTotalLength();

      /*
       * Force the ribbon canvas to match the pinned 100vh stage.
       * This inline height intentionally overrides the old CSS 280svh value,
       * so no CSS replacement is required.
       */
      gsap.set(redRibbon, {
        y: 0,
        height: "100%",
        force3D: true,
      });

      /*
       * The white mask begins fully offset, so at page load absolutely no
       * portion of the red ribbon — including its real right endpoint — can
       * be visible.
       */
      gsap.set(redMaskPath, {
        strokeDasharray:
          `0 ${ribbonPathLength * 2 + 48}`,
        strokeDashoffset: 0,
      });

      if (prefersReducedMotion()) {
        render(maxIndex, 1, 1);
        return;
      }

      ScrollTrigger.getById("skills-wave-entry")?.kill();
      ScrollTrigger.getById("skills-wave-scroll")?.kill();

      const state = {
        position: 0,
        entrance: 0.08,
        ribbonProgress: 0,
      };

      // Before the Skills section fully arrives, the first group is only
      // a subtle preview. It becomes fully white exactly as Skills reaches
      // the top of the viewport.
      render(
        state.position,
        state.entrance,
        state.ribbonProgress
      );

      gsap.to(state, {
        entrance: 1,
        ease: "none",
        onUpdate: () =>
          render(
            state.position,
            state.entrance,
            state.ribbonProgress
          ),
        scrollTrigger: {
          id: "skills-wave-entry",
          trigger: root,
          start: "top 92%",
          end: "top top",
          scrub: 1.35,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(state, {
        position: maxIndex,
        ease: "none",
        onUpdate: () =>
          render(
            state.position,
            state.entrance,
            state.ribbonProgress
          ),
        scrollTrigger: {
          id: "skills-wave-scroll",
          trigger: root,
          start: "top top",
          end: `+=${skillGroups.length * 92}%`,
          scrub: 1.85,

          /*
           * Raw ScrollTrigger progress drives the reveal-mask directly.
           * Because the visible red path is clipped by that mask, the right
           * endpoint cannot appear until the scroll reaches the end of Skills.
           */
          onUpdate: (self) => {
            state.ribbonProgress =
              clamp01(self.progress);

            render(
              state.position,
              state.entrance,
              state.ribbonProgress
            );
          },

          pin: stage,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: false,
        },
      });

      ScrollTrigger.refresh();
    }, root);

    return () => context.revert();
  }, [compactLayout]);

  return (
    <section
      id="skills"
      ref={rootRef}
      className="skills-wave"
      aria-labelledby="skills-wave-title"
    >
      <h2 id="skills-wave-title" className="skills-wave__sr-only">
        {t.navbar.skills}
      </h2>

      <div ref={stageRef} className="skills-wave__stage">
        <svg
          ref={redRibbonRef}
          className="skills-wave__red-ribbon"
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <mask
              id="skills-ribbon-reveal-mask"
              x="-320"
              y="-220"
              width="2500"
              height="1400"
              maskUnits="userSpaceOnUse"
              style={{ maskType: "alpha" }}
            >
              <path
                ref={redMaskPathRef}
                d="
                  M -220 48
                  C 120 76, 390 160, 540 300
                  C 660 412, 650 540, 770 650
                  C 910 780, 1070 805, 1220 735
                  C 1380 662, 1528 646, 1705 694
                  C 1810 722, 1940 740, 2160 746
                "
                fill="none"
                stroke="white"
                /*
                 * Match the visible ribbon's 92px stroke exactly.
                 * Equal diameters make the moving reveal tip a true
                 * semicircle instead of a wide bullet/rounded rectangle.
                 */
                strokeWidth="92"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </mask>
          </defs>

          <path
            className="skills-wave__red-ribbon-path"
            d="
              M -220 48
              C 120 76, 390 160, 540 300
              C 660 412, 650 540, 770 650
              C 910 780, 1070 805, 1220 735
              C 1380 662, 1528 646, 1705 694
              C 1810 722, 1910 738, 2015 744
            "
            mask="url(#skills-ribbon-reveal-mask)"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 1 }}
          />
        </svg>

        <div className="skills-wave__desktop">
          <div
            ref={listRef}
            className="skills-wave__list"
            aria-label="Skill groups"
          >
            {skillGroups.map((group) => (
              <div
                key={group.id}
                className="skills-wave__row"
                data-skill-row
                aria-hidden="true"
              >
                <span className="skills-wave__row-title">
                  {group.title[language]}
                </span>
              </div>
            ))}
          </div>

          <div ref={groupsRef} className="skills-wave__panels">
            {skillGroups.map((group) => (
              <div
                key={group.id}
                className="skills-wave__panel"
                data-skill-panel
                aria-label={group.title[language]}
              >
                <div className="skills-wave__items">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="skills-wave__item"
                      data-skill-item
                    >
                      <span className="skills-wave__item-label">
                        {item}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="skills-wave__mobile">
          {skillGroups.map((group) => (
            <article
              key={group.id}
              className="skills-wave__mobile-group"
            >
              <h3>{group.title[language]}</h3>

              <div className="skills-wave__mobile-items">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
