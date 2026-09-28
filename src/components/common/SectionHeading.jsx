import { useLayoutEffect, useRef } from "react";

import {
  gsap,
  SplitText,
  prefersReducedMotion,
} from "../../lib/gsap";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}) {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const eyebrowRef = useRef(null);
  const descriptionRef = useRef(null);

  useLayoutEffect(() => {
    if (!gsap || !SplitText || prefersReducedMotion() || !titleRef.current) {
      return undefined;
    }

    const context = gsap.context(() => {
      SplitText.create(titleRef.current, {
        type: "lines,words",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.words, {
            yPercent: 112,
            autoAlpha: 0,
            rotateX: -14,
            transformOrigin: "50% 100%",
            duration: 0.85,
            stagger: 0.035,
            ease: "power3.out",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 82%",
              once: true,
            },
          });
        },
      });

      gsap.from([eyebrowRef.current, descriptionRef.current], {
        y: 18,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 84%",
          once: true,
        },
      });
    }, rootRef);

    return () => context.revert();
  }, [eyebrow, title, description]);

  const alignment = align === "center" ? "mx-auto text-center" : "text-left";

  return (
    <div ref={rootRef} className={`section-heading max-w-3xl ${alignment}`}>
      <p ref={eyebrowRef} className="section-heading__eyebrow">
        {eyebrow}
      </p>

      <h2 ref={titleRef} className="section-heading__title">
        {title}
      </h2>

      <p ref={descriptionRef} className="section-heading__description">
        {description}
      </p>
    </div>
  );
}
