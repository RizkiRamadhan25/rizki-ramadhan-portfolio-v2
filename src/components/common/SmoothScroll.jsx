import { useLayoutEffect } from "react";
import { useLocation } from "react-router";

import {
  ScrollSmoother,
  ScrollTrigger,
  prefersReducedMotion,
} from "../../lib/gsap";

export default function SmoothScroll() {
  const location = useLocation();

  useLayoutEffect(() => {
    if (!ScrollSmoother || prefersReducedMotion()) {
      ScrollSmoother?.get?.()?.kill?.();
      return undefined;
    }

    const current = ScrollSmoother.get?.();
    current?.kill?.();

    ScrollTrigger?.config?.({ ignoreMobileResize: true });

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.25,
      effects: true,
      smoothTouch: 0.28,
    });

    return () => {
      smoother?.kill?.();
    };
  }, []);

  useLayoutEffect(() => {
    const refresh = window.requestAnimationFrame(() => {
      ScrollTrigger?.refresh?.();
    });

    return () => window.cancelAnimationFrame(refresh);
  }, [location.pathname, location.hash]);

  return null;
}
