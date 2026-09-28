import { useLayoutEffect, useRef } from "react";

import { useLanguage } from "../../context/language-context";
import { ScrollSmoother, ScrollTrigger } from "../../lib/gsap";

const languages = [
  {
    code: "id",
    label: "ID",
    fullName: "Bahasa Indonesia",
  },
  {
    code: "en",
    label: "EN",
    fullName: "English",
  },
];

function capturePosition() {
  const viewportMarker = window.innerHeight * 0.4;
  const anchor = Array.from(document.querySelectorAll("section[id]"))
    .find((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= viewportMarker && rect.bottom >= viewportMarker;
    });
  const smoother = ScrollSmoother?.get?.();

  return {
    anchor,
    top: anchor?.getBoundingClientRect().top ?? 0,
    y: smoother?.scrollTop?.() ?? window.scrollY,
  };
}

function restorePosition(position) {
  const smoother = ScrollSmoother?.get?.();
  const currentY = smoother?.scrollTop?.() ?? window.scrollY;
  const currentTop = position.anchor?.isConnected
    ? position.anchor.getBoundingClientRect().top
    : null;
  const targetY = Number.isFinite(currentTop)
    ? currentY + currentTop - position.top
    : position.y;

  if (Math.abs(targetY - currentY) < 1) {
    return;
  }

  if (smoother?.scrollTop) {
    smoother.scrollTop(targetY);
  } else {
    window.scrollTo({ top: targetY, left: 0, behavior: "auto" });
  }
}

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();
  const pendingPositionRef = useRef(null);
  const lastVisiblePositionRef = useRef(null);

  useLayoutEffect(() => {
    const position = pendingPositionRef.current;

    if (!position) {
      return undefined;
    }

    pendingPositionRef.current = null;

    restorePosition(position);
    const frame = window.requestAnimationFrame(() => {
      ScrollTrigger?.refresh?.();
      restorePosition(position);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [language]);

  useLayoutEffect(() => {
    const query = window.matchMedia("(max-width: 1024px)");
    let observedWidth = window.innerWidth;
    let scrollFrame = 0;
    let firstFrame = 0;
    let secondFrame = 0;

    lastVisiblePositionRef.current = capturePosition();

    const handleScroll = () => {
      if (window.innerWidth !== observedWidth || scrollFrame) {
        return;
      }

      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        if (window.innerWidth === observedWidth) {
          lastVisiblePositionRef.current = capturePosition();
        }
      });
    };

    const handleChange = () => {
      const position = lastVisiblePositionRef.current ?? capturePosition();
      observedWidth = window.innerWidth;

      window.cancelAnimationFrame(scrollFrame);
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      firstFrame = window.requestAnimationFrame(() => {
        restorePosition(position);
        secondFrame = window.requestAnimationFrame(() => {
          restorePosition(position);
          lastVisiblePositionRef.current = capturePosition();
        });
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    query.addEventListener("change", handleChange);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      query.removeEventListener("change", handleChange);
      window.cancelAnimationFrame(scrollFrame);
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, []);

  const selectLanguage = (newLanguage) => {
    if (newLanguage === language) {
      return;
    }

    pendingPositionRef.current = capturePosition();

    changeLanguage(newLanguage);
  };

  return (
    <div className="ed-language" aria-label="Language selector">
      {languages.map((item) => {
        const isActive = language === item.code;

        return (
          <button
            key={item.code}
            type="button"
            title={item.fullName}
            data-cursor={item.label}
            aria-label={`Switch to ${item.fullName}`}
            aria-pressed={isActive}
            onClick={() => selectLanguage(item.code)}
            className={isActive ? "is-active" : ""}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
