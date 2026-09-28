import { useLayoutEffect, useRef } from "react";

import { gsap, prefersReducedMotion } from "../../lib/gsap";

export default function TypewriterRole({ text, active = true }) {
  const textRef = useRef(null);

  useLayoutEffect(() => {
    if (!textRef.current) {
      return undefined;
    }

    if (!active) {
      textRef.current.textContent = "";
      return undefined;
    }

    if (!gsap || prefersReducedMotion()) {
      textRef.current.textContent = text;
      return undefined;
    }

    const target = textRef.current;
    const state = { count: 0 };

    const render = () => {
      target.textContent = text.slice(0, Math.round(state.count));
    };

    target.textContent = "";

    const timeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.45,
    });

    timeline
      .to(state, {
        count: text.length,
        duration: Math.max(1.4, text.length * 0.065),
        ease: "none",
        onUpdate: render,
      })
      .to({}, { duration: 1.15 })
      .to(state, {
        count: 0,
        duration: Math.max(0.9, text.length * 0.035),
        ease: "none",
        onUpdate: render,
      })
      .to({}, { duration: 0.45 });

    return () => timeline.kill();
  }, [text, active]);

  return (
    <span className="typewriter" aria-label={text}>
      <span ref={textRef} aria-hidden="true" />
      <span className="typewriter__caret" aria-hidden="true" />
    </span>
  );
}
