import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { Observer } from "gsap/Observer";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, Observer, SplitText, MorphSVGPlugin);

export { gsap, ScrollTrigger, ScrollSmoother, Observer, SplitText, MorphSVGPlugin };

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export function canAnimate() {
  return Boolean(gsap && ScrollTrigger) && !prefersReducedMotion();
}
