import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router";

import { PageTransitionContext } from "../../context/page-transition-context";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import "../../styles/page-transition.css";

const ENTER_DURATION = 1;
const HOLD_DURATION = 0.7;
const EXIT_DURATION = 1;

export default function PageTransition({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const coverRef = useRef(null);
  const pendingRef = useRef(null);
  const [transitioning, setTransitioning] = useState(false);

  const navigateWithTransition = useCallback((to, options) => {
    if (pendingRef.current) return;
    if (!gsap) {
      navigate(to, options);
      return;
    }

    const cover = coverRef.current;
    if (!cover) {
      navigate(to, options);
      return;
    }

    pendingRef.current = { fromKey: location.key };
    setTransitioning(true);
    gsap.killTweensOf(cover);
    gsap.set(cover, { yPercent: 100, visibility: "visible" });
    gsap.to(cover, {
      yPercent: 0,
      duration: ENTER_DURATION,
      ease: "power2.inOut",
      onComplete: () => navigate(to, options),
    });
  }, [location.key, navigate]);

  useLayoutEffect(() => {
    if (!pendingRef.current || pendingRef.current.fromKey === location.key) return undefined;

    let secondFrame = 0;
    let exitTween;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        ScrollTrigger?.refresh?.();
        exitTween = gsap.to(coverRef.current, {
          yPercent: 100,
          delay: HOLD_DURATION,
          duration: EXIT_DURATION,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(coverRef.current, { visibility: "hidden", yPercent: 100 });
            pendingRef.current = null;
            setTransitioning(false);
          },
        });
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      exitTween?.kill();
    };
  }, [location.key]);

  return (
    <PageTransitionContext.Provider value={navigateWithTransition}>
      {children}
      {createPortal(
        <div ref={coverRef} className="ed-page-transition" aria-hidden="true" style={{ pointerEvents: transitioning ? "auto" : "none" }}>
          <div className="ed-page-transition__top"><span>RR.</span><span>PORTFOLIO / 2026</span></div>
          <div className="ed-page-transition__title">SELECTED<br />WORK<span>↗</span></div>
          <div className="ed-page-transition__bottom"><span>RIZKI RAMADHAN</span><span>✳</span></div>
        </div>,
        document.body
      )}
    </PageTransitionContext.Provider>
  );
}
