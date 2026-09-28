import { useLayoutEffect } from "react";

import { gsap, prefersReducedMotion } from "../lib/gsap";

export function useGlassTilt(
  rootRef,
  selector,
  { rotateX = 5, rotateY = 7, lift = 4 } = {}
) {
  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root || !gsap || prefersReducedMotion()) {
      return undefined;
    }

    const elements = Array.from(root.querySelectorAll(selector));
    const cleanups = [];

    elements.forEach((element) => {
      gsap.set(element, {
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      });

      const setRotateX = gsap.quickTo(element, "rotationX", {
        duration: 0.45,
        ease: "power3.out",
      });
      const setRotateY = gsap.quickTo(element, "rotationY", {
        duration: 0.45,
        ease: "power3.out",
      });
      const setY = gsap.quickTo(element, "y", {
        duration: 0.45,
        ease: "power3.out",
      });

      const onMove = (event) => {
        if (event.pointerType === "touch") {
          return;
        }

        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        setRotateY(x * rotateY);
        setRotateX(y * -rotateX);
        setY(-lift);
      };

      const onLeave = () => {
        setRotateX(0);
        setRotateY(0);
        setY(0);
      };

      element.addEventListener("pointermove", onMove);
      element.addEventListener("pointerleave", onLeave);

      cleanups.push(() => {
        element.removeEventListener("pointermove", onMove);
        element.removeEventListener("pointerleave", onLeave);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [rootRef, selector, rotateX, rotateY, lift]);
}
