import { useEffect, useRef } from "react";

import { gsap, prefersReducedMotion } from "../../lib/gsap";

export default function EditorialCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const pointerQuery = window.matchMedia("(min-width: 901px) and (hover: hover) and (pointer: fine)");
    if (!cursor || !gsap) return undefined;

    let cleanupPointer = () => {};
    const setupPointer = () => {
      cleanupPointer();
      if (!pointerQuery.matches || prefersReducedMotion()) {
        cursor.classList.remove("is-visible", "is-interactive");
        document.documentElement.classList.remove("ed-custom-cursor");
        return;
      }

      document.documentElement.classList.add("ed-custom-cursor");
      const moveX = gsap.quickTo(cursor, "x", { duration: 0.26, ease: "power3.out" });
      const moveY = gsap.quickTo(cursor, "y", { duration: 0.26, ease: "power3.out" });
      let hasPosition = false;

      const handleMove = (event) => {
        if (event.pointerType !== "mouse") return;
        if (!hasPosition) {
          gsap.set(cursor, { x: event.clientX, y: event.clientY });
          hasPosition = true;
        } else {
          moveX(event.clientX);
          moveY(event.clientY);
        }

        const editable = event.target?.closest?.("input, textarea, [contenteditable='true']");
        const interactive = event.target?.closest?.("a, button, [data-cursor]");
        cursor.classList.toggle("is-visible", !editable);
        cursor.classList.toggle("is-interactive", Boolean(interactive) && !editable);
      };
      const handleLeave = (event) => {
        if (!event.relatedTarget) cursor.classList.remove("is-visible", "is-interactive");
      };

      window.addEventListener("pointermove", handleMove, { passive: true });
      document.addEventListener("mouseout", handleLeave);
      cleanupPointer = () => {
        window.removeEventListener("pointermove", handleMove);
        document.removeEventListener("mouseout", handleLeave);
        moveX.tween?.kill?.();
        moveY.tween?.kill?.();
        cursor.classList.remove("is-visible", "is-interactive");
        document.documentElement.classList.remove("ed-custom-cursor");
      };
    };

    setupPointer();
    pointerQuery.addEventListener("change", setupPointer);
    return () => {
      pointerQuery.removeEventListener("change", setupPointer);
      cleanupPointer();
    };
  }, []);

  return <div ref={cursorRef} className="ed-pointer" aria-hidden="true"><span className="ed-pointer-orbit" /><span className="ed-pointer-ring"><span className="ed-pointer-core" /></span></div>;
}
