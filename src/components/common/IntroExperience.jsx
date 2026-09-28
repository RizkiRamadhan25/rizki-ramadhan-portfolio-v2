import { useLayoutEffect, useRef } from "react";

import "../../styles/identity-monument.css";

import {
  gsap,
  ScrollSmoother,
  ScrollTrigger,
  prefersReducedMotion,
} from "../../lib/gsap";

const wait = (duration) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });

const withTimeout = (promise, timeout = 3500) =>
  Promise.race([
    promise,
    wait(timeout),
  ]);

const getMinimumLoaderDuration = () => {
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  if (!connection) {
    return 900;
  }

  if (connection.saveData) {
    return 1150;
  }

  switch (connection.effectiveType) {
    case "slow-2g":
      return 1500;
    case "2g":
      return 1300;
    case "3g":
      return 1050;
    case "4g":
    default:
      return 800;
  }
};

const createFontTask = () => {
  if (!document.fonts?.ready) {
    return Promise.resolve();
  }

  return document.fonts.ready.catch(() => undefined);
};

const createImageTask = (image) => {
  if (!image) {
    return Promise.resolve();
  }

  if (image.complete) {
    if (typeof image.decode === "function") {
      return image.decode().catch(() => undefined);
    }

    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const finish = () => {
      image.removeEventListener("load", finish);
      image.removeEventListener("error", finish);

      if (typeof image.decode === "function") {
        image.decode().catch(() => undefined).finally(resolve);
        return;
      }

      resolve();
    };

    image.addEventListener("load", finish, { once: true });
    image.addEventListener("error", finish, { once: true });
  });
};

const collectCriticalTasks = () => {
  // Do not wait for the whole website. The portfolio contains large
  // off-screen media and project assets, so waiting for window.load or
  // every eager image can make the intro appear frozen on a cold load.
  const tasks = [
    withTimeout(createFontTask(), 2200),
  ];

  const criticalImages = Array.from(document.images).filter((image) => {
    if (!image.currentSrc && !image.src) {
      return false;
    }

    if (image.loading === "lazy") {
      return false;
    }

    // Only imagery belonging to the first/home screen is critical
    // to the initial reveal. Everything below it may continue loading
    // after the portfolio becomes interactive.
    const section = image.closest("section");

    return !section || section.id === "home";
  });

  criticalImages.forEach((image) => {
    tasks.push(
      withTimeout(createImageTask(image), 3000)
    );
  });

  return tasks;
};

export default function IntroExperience({ onReveal }) {
  const rootRef = useRef(null);
  const counterRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) {
      onReveal?.();
      return undefined;
    }

    const html = document.documentElement;
    const body = document.body;
    const smootherWrapper = document.getElementById("smooth-wrapper");
    const previousScrollRestoration = window.history.scrollRestoration;

    let hasRevealed = false;
    let revealFrame;
    let progressTween;
    let finishTimeline;
    let failSafeTimer;
    let cancelled = false;

    const snapToTop = () => {
      const smoother = ScrollSmoother?.get?.();
      smoother?.scrollTo?.(0, false);
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    const revealPage = () => {
      if (hasRevealed) {
        return;
      }

      hasRevealed = true;
      root.dataset.complete = "true";
      onReveal?.();
    };

    const unlockPage = () => {
      if (failSafeTimer) {
        window.clearTimeout(failSafeTimer);
        failSafeTimer = undefined;
      }

      snapToTop();
      revealPage();

      html.classList.remove("intro-is-active");
      body.classList.remove("intro-is-active");
      smootherWrapper?.removeAttribute("inert");

      revealFrame = window.requestAnimationFrame(() => {
        snapToTop();

        window.requestAnimationFrame(() => {
          ScrollTrigger?.refresh?.();
          ScrollTrigger?.update?.();
          window.history.scrollRestoration = previousScrollRestoration;
        });
      });
    };

    const forceComplete = () => {
      if (cancelled || hasRevealed) {
        return;
      }

      progressTween?.kill();
      finishTimeline?.kill();

      updateCounter(100);

      gsap.set(root, {
        autoAlpha: 0,
        display: "none",
        pointerEvents: "none",
      });

      unlockPage();
    };

    const updateCounter = (value) => {
      const rounded = Math.max(0, Math.min(100, Math.round(value)));

      if (counterRef.current) {
        counterRef.current.textContent = `${rounded}%`;
      }

      root.style.setProperty("--loader-progress", String(rounded / 100));
    };

    window.history.scrollRestoration = "manual";
    html.classList.add("intro-is-active");
    body.classList.add("intro-is-active");
    smootherWrapper?.setAttribute("inert", "");
    snapToTop();

    if (!gsap || prefersReducedMotion()) {
      root.style.display = "none";
      unlockPage();

      return () => {
        if (revealFrame) {
          window.cancelAnimationFrame(revealFrame);
        }

        html.classList.remove("intro-is-active");
        body.classList.remove("intro-is-active");
        smootherWrapper?.removeAttribute("inert");
        window.history.scrollRestoration = previousScrollRestoration;
      };
    }

    const progress = { value: 0 };
    const minimumDuration = getMinimumLoaderDuration();
    const startedAt = performance.now();
    const backdrop = root.querySelector("[data-intro-backdrop]");

    const context = gsap.context(() => {

      gsap.set(root, {
        autoAlpha: 1,
      });

      gsap.set(backdrop, {
        autoAlpha: 1,
        scale: 1,
        transformOrigin: "50% 50%",
      });

      gsap.set("[data-intro-meta]", {
        autoAlpha: 0,
        y: 12,
      });

      gsap.set(counterRef.current, {
        autoAlpha: 1,
        scale: 1,
        filter: "blur(0px)",
        transformOrigin: "50% 50%",
      });

      gsap.to("[data-intro-meta]", {
        autoAlpha: 1,
        y: 0,
        duration: 0.52,
        stagger: 0.055,
        ease: "power3.out",
      });

      // A restrained initial crawl. Real resource completion takes over below.
      progressTween = gsap.to(progress, {
        value: 12,
        duration: 0.55,
        ease: "power1.out",
        onUpdate() {
          updateCounter(progress.value);
        },
      });
    }, root);

    failSafeTimer = window.setTimeout(() => {
      forceComplete();
    }, 6000);

    const criticalTasks = collectCriticalTasks();
    const taskCount = Math.max(criticalTasks.length, 1);
    let completedTasks = 0;

    const trackedTasks = criticalTasks.map((task) =>
      withTimeout(Promise.resolve(task))
        .catch(() => undefined)
        .then(() => {
          if (cancelled) {
            return;
          }

          completedTasks += 1;

          // Real readiness drives the loader from 12% to 92%.
          const target = 12 + (completedTasks / taskCount) * 80;

          progressTween?.kill();
          progressTween = gsap.to(progress, {
            value: Math.min(target, 92),
            duration: 0.28,
            ease: "power2.out",
            overwrite: true,
            onUpdate() {
              updateCounter(progress.value);
            },
          });
        })
    );

    Promise.all([
      ...trackedTasks,
      wait(Math.max(0, minimumDuration - (performance.now() - startedAt))),
    ]).then(() => {
      if (cancelled) {
        return;
      }

      progressTween?.kill();

      progressTween = gsap.to(progress, {
        value: 100,
        duration: 0.42,
        ease: "power3.inOut",
        overwrite: true,
        onUpdate() {
          updateCounter(progress.value);
        },
        onComplete() {
          if (cancelled) {
            return;
          }

          finishTimeline = gsap.timeline({
            defaults: {
              overwrite: "auto",
            },
          });

          finishTimeline
            // Hold 100% very briefly so the completion reads clearly.
            .to({}, { duration: 0.12 })
            .to(
              "[data-intro-meta]:not([data-intro-name])",
              {
                autoAlpha: 0,
                y: -12,
                duration: 0.38,
                stagger: 0.025,
                ease: "power2.in",
              },
              0
            )
            // Zoom into the 100% number, as if the camera moves through it.
            .to(
              counterRef.current,
              {
                scale: 7.5,
                autoAlpha: 0,
                filter: "blur(12px)",
                duration: 1.08,
                ease: "power4.inOut",
              },
              0.08
            )
            .to(
              backdrop,
              {
                scale: 1.075,
                autoAlpha: 0,
                duration: 0.92,
                ease: "power3.inOut",
              },
              0.22
            )
            .call(
              () => {
                snapToTop();
                revealPage();
                root.style.pointerEvents = "none";
              },
              null,
              0.72
            )
            .to(
              "[data-intro-name]",
              {
                autoAlpha: 0,
                duration: 0.14,
                ease: "none",
              },
              0.72
            )
            .to(
              root,
              {
                autoAlpha: 0,
                duration: 0.4,
                ease: "power2.out",
              },
              0.74
            )
            .set(root, {
              display: "none",
            })
            .call(unlockPage);
        },
      });
    }).catch(() => {
      forceComplete();
    });

    return () => {
      cancelled = true;

      if (revealFrame) {
        window.cancelAnimationFrame(revealFrame);
      }

      if (failSafeTimer) {
        window.clearTimeout(failSafeTimer);
      }

      progressTween?.kill();
      finishTimeline?.kill();
      context.revert();

      html.classList.remove("intro-is-active");
      body.classList.remove("intro-is-active");
      smootherWrapper?.removeAttribute("inert");
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, [onReveal]);

  return (
    <div
      ref={rootRef}
      className="intro-tear-loader intro-loader--clean"
      data-intro-experience
      aria-hidden="true"
    >
      <div className="intro-tear-backdrop" data-intro-backdrop />

      <div className="intro-loader-meta intro-loader-meta--top">
        <span className="monument-identity" data-intro-meta>
          Portfolio / 2026
        </span>

        <span className="monument-identity" data-intro-meta>
          Jakarta / ID
        </span>
      </div>

      <div className="intro-loader-meta intro-loader-meta--bottom">
        <span className="monument-identity" data-intro-meta>
          Informatic / Creative Development
        </span>

        <span
          className="monument-identity"
          data-intro-meta
          data-intro-name
        >
          Rizki Ramadhan
        </span>
      </div>

      <strong
        ref={counterRef}
        className="intro-loader-counter"
      >
        0%
      </strong>
    </div>
  );
}
