import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router";

import { gsap, prefersReducedMotion, ScrollSmoother, ScrollTrigger } from "../../lib/gsap";

export default function ScrollManager({ enabled = true }) {
  const location = useLocation();
  const lastPathRef = useRef(null);
  const tweenRef = useRef(null);

  useLayoutEffect(() => {
    const previousPath = lastPathRef.current;
    lastPathRef.current = location.pathname;
    if (!enabled) return undefined;

    tweenRef.current?.kill?.();
    tweenRef.current = null;
    ScrollTrigger?.refresh?.();

    const smoother = ScrollSmoother?.get?.();
    const readScroll = () => smoother?.scrollTop?.() ?? window.scrollY;
    const writeScroll = (value) => {
      if (smoother?.scrollTop) smoother.scrollTop(value);
      else window.scrollTo({ top: value, left: 0, behavior: "auto" });
      ScrollTrigger?.update?.();
    };

    if (!location.hash) {
      writeScroll(0);
      return undefined;
    }

    const section = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (!section) return undefined;

    const current = readScroll();
    const headerOffset = (document.querySelector(".ed-header")?.getBoundingClientRect().height ?? 76) + 12;
    const target = Math.max(0, smoother?.offset?.(section, `top ${headerOffset}px`) ?? current + section.getBoundingClientRect().top - headerOffset);
    const routeChanged = previousPath !== location.pathname;

    // A newly mounted route must be positioned before the transition reveals it.
    if (routeChanged || prefersReducedMotion() || !gsap || Math.abs(target - current) < 2) {
      writeScroll(target);
      return undefined;
    }

    const position = { value: current };
    tweenRef.current = gsap.to(position, {
      value: target,
      duration: Math.min(1.45, 0.65 + Math.abs(target - current) / 2600),
      ease: "power2.inOut",
      onUpdate: () => writeScroll(position.value),
      onComplete: () => {
        writeScroll(target);
        ScrollTrigger?.refresh?.();
        tweenRef.current = null;
      },
    });

    return () => {
      tweenRef.current?.kill?.();
      tweenRef.current = null;
    };
  }, [enabled, location.pathname, location.hash, location.key]);

  return null;
}
