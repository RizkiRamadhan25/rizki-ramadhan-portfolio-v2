import { useLayoutEffect, useRef } from "react";

import { gsap, prefersReducedMotion } from "../../lib/gsap";
import { profile } from "../../data/profile";

export default function ThreeDPortrait({
  role,
  compact = false,
  priority = false,
  showLabel = true,
  cinematic = false,
  active = true,
}) {
  const rootRef = useRef(null);
  const cardRef = useRef(null);
  const glareRef = useRef(null);

  useLayoutEffect(() => {
    const card = cardRef.current;
    const root = rootRef.current;

    if (!active || !card || !root || !gsap || prefersReducedMotion()) {
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.set(card, {
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      });

      gsap.from(card, {
        opacity: 0,
        y: 52,
        rotateX: 9,
        rotateY: -11,
        duration: 1.1,
        delay: priority ? 0.18 : 0,
        ease: "power3.out",
        scrollTrigger: priority
          ? undefined
          : {
              trigger: root,
              start: "top 82%",
              once: true,
            },
      });

      gsap.from("[data-depth-layer]", {
        opacity: 0,
        scale: 0.92,
        stagger: 0.08,
        duration: 0.9,
        delay: priority ? 0.35 : 0.1,
        ease: "power2.out",
        scrollTrigger: priority
          ? undefined
          : {
              trigger: root,
              start: "top 82%",
              once: true,
            },
      });
    }, root);

    const rotateX = gsap.quickTo(card, "rotationX", {
      duration: 0.55,
      ease: "power3.out",
    });

    const rotateY = gsap.quickTo(card, "rotationY", {
      duration: 0.55,
      ease: "power3.out",
    });

    const moveX = gsap.quickTo(card, "x", {
      duration: 0.55,
      ease: "power3.out",
    });

    const moveY = gsap.quickTo(card, "y", {
      duration: 0.55,
      ease: "power3.out",
    });

    const handlePointerMove = (event) => {
      if (event.pointerType === "touch") {
        return;
      }

      const rect = root.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      rotateY(x * 12);
      rotateX(y * -9);
      moveX(x * 8);
      moveY(y * 7);

      if (glareRef.current) {
        glareRef.current.style.setProperty("--glare-x", `${(x + 0.5) * 100}%`);
        glareRef.current.style.setProperty("--glare-y", `${(y + 0.5) * 100}%`);
      }
    };

    const reset = () => {
      rotateX(0);
      rotateY(0);
      moveX(0);
      moveY(0);
    };

    root.addEventListener("pointermove", handlePointerMove);
    root.addEventListener("pointerleave", reset);

    return () => {
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", reset);
      context.revert();
    };
  }, [active, cinematic, priority]);

  return (
    <div
      ref={rootRef}
      className={`portrait-scene ${compact ? "portrait-scene--compact" : ""} ${cinematic ? "portrait-scene--cinematic" : ""}`}
    >
      <div className="portrait-scene__halo" data-depth-layer />
      <div className="portrait-scene__back portrait-scene__back--one" data-depth-layer />
      <div className="portrait-scene__back portrait-scene__back--two" data-depth-layer />

      <div ref={cardRef} className="portrait-card">
        <div
          ref={glareRef}
          className="portrait-card__glare"
          aria-hidden="true"
        />

        <div className="portrait-card__media" style={{ transform: "translateZ(32px)" }}>
          <img
            src={profile.profileImage}
            alt={profile.name}
            width="800"
            height="800"
            fetchPriority={priority ? "high" : undefined}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
        </div>

        {showLabel && (
          <div
            className="portrait-card__label glass-panel"
            style={{ transform: "translateZ(62px)" }}
          >
            <p>{profile.name}</p>
            <span>{role}</span>
          </div>
        )}

        <span
          className="portrait-card__edge portrait-card__edge--top"
          aria-hidden="true"
          style={{ transform: "translateZ(48px)" }}
        />
        <span
          className="portrait-card__edge portrait-card__edge--right"
          aria-hidden="true"
          style={{ transform: "translateZ(48px)" }}
        />
      </div>
    </div>
  );
}
