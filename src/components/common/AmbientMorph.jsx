import { useLayoutEffect, useRef } from "react";

import {
  gsap,
  MorphSVGPlugin,
  prefersReducedMotion,
} from "../../lib/gsap";

export default function AmbientMorph() {
  const rootRef = useRef(null);
  const morphRef = useRef(null);

  useLayoutEffect(() => {
    if (!gsap || !MorphSVGPlugin || prefersReducedMotion()) {
      return undefined;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        repeat: -1,
        defaults: {
          duration: 11,
          ease: "sine.inOut",
        },
      });

      timeline
        .to(morphRef.current, {
          morphSVG: "#ambient-shape-b",
          rotation: 12,
          transformOrigin: "50% 50%",
        })
        .to(morphRef.current, {
          morphSVG: "#ambient-shape-c",
          rotation: -7,
        })
        .to(morphRef.current, {
          morphSVG: "#ambient-shape-a",
          rotation: 0,
        });

      gsap.to("[data-ambient-orbit]", {
        rotation: 360,
        transformOrigin: "50% 50%",
        duration: 48,
        ease: "none",
        repeat: -1,
      });
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="ambient-scene"
      aria-hidden="true"
    >
      <svg
        className="ambient-scene__svg"
        viewBox="0 0 1000 1000"
        role="presentation"
      >
        <defs>
          <radialGradient id="ambient-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.5" />
            <stop offset="58%" stopColor="#4f46e5" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g data-ambient-orbit>
          <circle
            cx="500"
            cy="500"
            r="330"
            fill="none"
            stroke="rgba(255,255,255,0.035)"
            strokeWidth="1"
            strokeDasharray="3 18"
          />
        </g>

        <path
          id="ambient-shape-a"
          ref={morphRef}
          d="M786 361C835 482 791 637 681 728C572 819 397 847 278 772C159 697 96 519 153 389C210 260 386 180 529 202C672 223 737 240 786 361Z"
          fill="url(#ambient-gradient)"
        />

        <path
          id="ambient-shape-b"
          d="M805 420C836 554 741 716 610 774C478 832 309 787 218 681C127 575 113 405 205 294C297 182 496 142 636 199C776 255 774 285 805 420Z"
          fill="none"
          visibility="hidden"
        />

        <path
          id="ambient-shape-c"
          d="M744 266C855 373 868 563 776 687C685 811 487 856 349 792C212 728 126 554 165 408C203 262 367 163 512 173C656 183 633 159 744 266Z"
          fill="none"
          visibility="hidden"
        />
      </svg>
    </div>
  );
}
