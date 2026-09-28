import { useEffect, useLayoutEffect, useRef, useState } from "react";

import "../../styles/project-intro-gateway.css";
import {
  gsap,
  ScrollSmoother,
  ScrollTrigger,
  prefersReducedMotion,
} from "../../lib/gsap";

const projects = [
  {
    name: "SavePoint",
    image: "/images/intro-projects/savepoint.svg",
  },
  {
    name: "Laras",
    image: "/images/intro-projects/laras.svg",
  },
  {
    name: "CPU Scheduling",
    image: "/images/intro-projects/cpu-scheduling.svg",
  },
  {
    name: "WartegSmart",
    image: "/images/intro-projects/wartegsmart.svg",
  },
  {
    name: "Serenity",
    image: "/images/intro-projects/serenity.svg",
  },
];

const AUTO_SPEED = 78;
const MAX_GRAVITY_WORDS = 20;
const WORD_GRAVITY = 2300;
const WORD_BOUNCE = 0.28;
const WORD_SIDE_BOUNCE = 0.5;
const WORD_FLOOR_FRICTION = 0.82;
const WORD_ANGULAR_DAMPING = 0.965;
const WORD_SETTLE_TORQUE = 620;
const WORD_EDGE_GAP = 14;
const WORD_DRAG_ANGULAR_SPRING = 12;
const WORD_DRAG_ANGULAR_DAMPING = 0.93;
const WORD_DRAG_VELOCITY_TILT = 0.022;
const WORD_DRAG_ACCELERATION_TILT = 0.0005;
const WORD_DRAG_CENTER_SWAY = 5.5;
const WORD_DRAG_EDGE_SWAY = 3.2;
const WORD_MAX_THROW_SPIN = 820;
const ROPE_MIN_LENGTH = 70;
const ROPE_MAX_LENGTH = 210;
const ROPE_REEL_SPEED = 1050;
const ROPE_PULL_IMPULSE = 420;
const ROPE_CONSTRAINT_DAMPING = 0.9;
const ROPE_RETURN_SPRING = 165;
const ROPE_RETURN_DAMPING = 12;
const ROPE_RETURN_MAX_ACCELERATION = 36000;
const ROPE_RETURN_DEAD_ZONE = 1.5;
const ROPE_ANGULAR_DAMPING = 0.992;
const ROPE_TORQUE_SCALE = 0.34;
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

const getRotatedExtents = (body) => {
  const radians = body.angle * DEG_TO_RAD;
  const cosine = Math.abs(Math.cos(radians));
  const sine = Math.abs(Math.sin(radians));

  return {
    x: body.halfWidth * cosine + body.halfHeight * sine,
    y: body.halfWidth * sine + body.halfHeight * cosine,
  };
};

const normalizeWordAngle = (angle) => {
  const normalized = ((angle + 180) % 360 + 360) % 360 - 180;
  return normalized === -180 ? 180 : normalized;
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const shortestAngleDelta = (target, current) =>
  normalizeWordAngle(target - current);

const getRotatedPoint = (x, y, angle) => {
  const radians = angle * DEG_TO_RAD;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);

  return {
    x: x * cosine - y * sine,
    y: x * sine + y * cosine,
  };
};

const applyWordTransform = (node, body) => {
  node.style.transform = `translate3d(${body.x}px, ${body.y}px, 0) translate(-50%, -50%) rotate(${body.angle}deg)`;
};

export default function ProjectIntroGateway({ active, entryMode = "initial", onOpen }) {
  const rootRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const topDashRef = useRef(null);
  const bottomDashRef = useRef(null);
  const firstGroupRef = useRef(null);
  const wordInputRef = useRef(null);
  const exitingRef = useRef(false);
  const clickSuppressUntilRef = useRef(0);
  const wordIdRef = useRef(0);
  const wordBodiesRef = useRef(new Map());
  const wordNodesRef = useRef(new Map());
  const ropeLineNodesRef = useRef(new Map());
  const [dragging, setDragging] = useState(false);
  const [interactionMode, setInteractionMode] = useState("mouse");
  const [toolsOpen, setToolsOpen] = useState(false);
  const [ropeSelection, setRopeSelection] = useState(null);
  const [ropedWordIds, setRopedWordIds] = useState([]);
  const [gravityWords, setGravityWords] = useState([]);
  const [wordPrompt, setWordPrompt] = useState(null);
  const [draftWord, setDraftWord] = useState("");

  useEffect(() => {
    if (!active || !wordPrompt) {
      return undefined;
    }

    const focusFrame = window.requestAnimationFrame(() => {
      wordInputRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(focusFrame);
  }, [active, wordPrompt]);

  useEffect(() => {
    if (!active || gravityWords.length === 0) {
      return undefined;
    }

    const reducedMotion = prefersReducedMotion();
    let animationFrame = null;
    let previousTime = performance.now();

    const animateWords = (time) => {
      const root = rootRef.current;

      if (!root) {
        animationFrame = window.requestAnimationFrame(animateWords);
        return;
      }

      const delta = Math.min((time - previousTime) / 1000, 0.033);
      previousTime = time;
      const width = root.clientWidth;
      const height = root.clientHeight;

      gravityWords.forEach((word) => {
        const body = wordBodiesRef.current.get(word.id);
        const node = wordNodesRef.current.get(word.id);

        if (!body || !node) {
          return;
        }

        if (!body.halfWidth || !body.halfHeight) {
          body.halfWidth = node.offsetWidth / 2;
          body.halfHeight = node.offsetHeight / 2;
        }

        if (!body.dragging) {
          if (reducedMotion) {
            body.angle = 0;
            const extents = getRotatedExtents(body);
            body.y = height - WORD_EDGE_GAP - extents.y;
            body.vx = 0;
            body.vy = 0;
            body.angularVelocity = 0;
          } else {
            body.vy += WORD_GRAVITY * delta;
            body.x += body.vx * delta;
            body.y += body.vy * delta;
            body.angle = normalizeWordAngle(
              body.angle + body.angularVelocity * delta
            );

            if (body.rope) {
              // Newly created ropes reel themselves in until they reach a
              // compact target length. This makes the word visibly get pulled
              // toward the clicked anchor instead of leaving a long, slack
              // line across the whole intro screen.
              if (body.rope.length > body.rope.targetLength) {
                body.rope.length = Math.max(
                  body.rope.targetLength,
                  body.rope.length - ROPE_REEL_SPEED * delta
                );
              }

              const rotatedAttachment = getRotatedPoint(
                body.rope.localX,
                body.rope.localY,
                body.angle
              );
              const attachmentX = body.x + rotatedAttachment.x;
              const attachmentY = body.y + rotatedAttachment.y;
              const ropeDx = attachmentX - body.rope.anchorX;
              const ropeDy = attachmentY - body.rope.anchorY;
              const ropeDistance = Math.max(
                Math.hypot(ropeDx, ropeDy),
                0.001
              );

              // The rope behaves like an under-damped elastic constraint.
              // When a user drags a hanging word away and releases it, we do
              // NOT snap the body back to the rope radius. Instead the excess
              // stretch generates spring acceleration toward the anchor. The
              // relatively light radial damping deliberately leaves a little
              // energy in the system, producing a visible bounce-back and then
              // a natural swing around the anchor.
              if (ropeDistance > body.rope.length + ROPE_RETURN_DEAD_ZONE) {
                const normalX = ropeDx / ropeDistance;
                const normalY = ropeDy / ropeDistance;
                const overshoot = ropeDistance - body.rope.length;
                const radialVelocity =
                  body.vx * normalX + body.vy * normalY;

                const springAcceleration = overshoot * ROPE_RETURN_SPRING;
                const dampingAcceleration =
                  radialVelocity * ROPE_RETURN_DAMPING;
                const returnAcceleration = clamp(
                  springAcceleration + dampingAcceleration,
                  0,
                  ROPE_RETURN_MAX_ACCELERATION
                );

                body.vx -= normalX * returnAcceleration * delta;
                body.vy -= normalY * returnAcceleration * delta;

                // Only bleed a tiny amount of outward speed when the rope is
                // extremely stretched. This is a safety valve, not a snap-back
                // correction, so the word still travels visibly through every
                // intermediate position.
                if (
                  overshoot > Math.max(body.rope.length * 1.8, 260) &&
                  radialVelocity > 0
                ) {
                  const safetyDamping =
                    radialVelocity * (1 - ROPE_CONSTRAINT_DAMPING) * 0.35;
                  body.vx -= normalX * safetyDamping;
                  body.vy -= normalY * safetyDamping;
                }
              }

              // When the rope is attached away from the center, gravity also
              // creates torque. This makes an edge-mounted word rotate and
              // settle underneath the attachment point like a real hanging
              // object.
              const ropeRadiusSquared = Math.max(
                body.rope.localX * body.rope.localX +
                  body.rope.localY * body.rope.localY,
                (body.halfWidth * body.halfWidth +
                  body.halfHeight * body.halfHeight) *
                  0.18,
                420
              );
              const pivotToCenterX = -rotatedAttachment.x;
              const angularAcceleration = clamp(
                ((pivotToCenterX * WORD_GRAVITY) / ropeRadiusSquared) *
                  RAD_TO_DEG *
                  ROPE_TORQUE_SCALE,
                -980,
                980
              );
              body.angularVelocity += angularAcceleration * delta;
              body.angularVelocity *= Math.pow(
                ROPE_ANGULAR_DAMPING,
                delta * 60
              );
            }

            const airDrag = Math.pow(0.997, delta * 60);
            body.vx *= airDrag;
            body.angularVelocity *= Math.pow(0.997, delta * 60);

            let extents = getRotatedExtents(body);
            const leftWall = WORD_EDGE_GAP + extents.x;
            const rightWall = Math.max(
              leftWall,
              width - WORD_EDGE_GAP - extents.x
            );
            const ceiling = WORD_EDGE_GAP + extents.y;
            const floor = height - WORD_EDGE_GAP;

            if (body.x < leftWall) {
              body.x = leftWall;
              body.vx = Math.abs(body.vx) * WORD_SIDE_BOUNCE;
              body.angularVelocity += Math.min(48, Math.abs(body.vx) * 0.035);
            } else if (body.x > rightWall) {
              body.x = rightWall;
              body.vx = -Math.abs(body.vx) * WORD_SIDE_BOUNCE;
              body.angularVelocity -= Math.min(48, Math.abs(body.vx) * 0.035);
            }

            if (body.y < ceiling) {
              body.y = ceiling;
              body.vy = Math.abs(body.vy) * 0.3;
            }

            extents = getRotatedExtents(body);
            const bottom = body.y + extents.y;
            const touchingFloor = bottom >= floor - 1.5;

            if (bottom > floor) {
              const impactSpeed = Math.max(body.vy, 0);
              body.y -= bottom - floor;

              if (impactSpeed > 120) {
                body.vy = -impactSpeed * WORD_BOUNCE;
                body.angularVelocity +=
                  -Math.sign(Math.sin(body.angle * 2 * DEG_TO_RAD) || body.restDirection) *
                  Math.min(54, impactSpeed * 0.025);
              } else {
                body.vy = 0;
              }
            }

            if (touchingFloor && Math.abs(body.vy) <= 70) {
              const radians = body.angle * DEG_TO_RAD;
              let settlingForce = -Math.sin(radians * 2) * WORD_SETTLE_TORQUE;

              // A word balanced almost perfectly upright is an unstable
              // equilibrium in real life. Give it a tiny deterministic nudge
              // so it tips instead of freezing half-standing.
              if (
                Math.abs(Math.cos(radians)) < 0.045 &&
                Math.abs(body.angularVelocity) < 18
              ) {
                settlingForce += body.restDirection * 190;
              }

              body.angularVelocity += settlingForce * delta;
              body.angularVelocity *= Math.pow(WORD_ANGULAR_DAMPING, delta * 60);
              body.vx *= Math.pow(WORD_FLOOR_FRICTION, delta * 60);

              // Re-seat the rotated rectangle on the floor every frame while
              // it topples. This is what makes the baseline follow the actual
              // final orientation instead of letting the word hover on its
              // unrotated height.
              extents = getRotatedExtents(body);
              body.y = floor - extents.y;

              const flatness = Math.abs(Math.sin(radians));

              if (
                flatness < 0.018 &&
                Math.abs(body.angularVelocity) < 7 &&
                Math.abs(body.vx) < 7 &&
                Math.abs(body.vy) < 7
              ) {
                body.angle = Math.round(body.angle / 180) * 180;
                body.angularVelocity = 0;
                body.vx = 0;
                body.vy = 0;
                extents = getRotatedExtents(body);
                body.y = floor - extents.y;
              }
            }
          }
        } else {
          const centerGrip = body.centerGrip ?? true;

          if (!reducedMotion) {
            // While the word is held, treat the pointer as a moving pivot.
            // Horizontal motion creates inertia: dragging right makes the
            // word lag to the left, reversing direction makes it overshoot,
            // and the reduced damping lets it swing like a small pendulum.
            const velocityTilt = clamp(
              -(body.pointerVx || 0) * WORD_DRAG_VELOCITY_TILT,
              -34,
              34
            );
            const accelerationTilt = clamp(
              -(body.pointerAx || 0) * WORD_DRAG_ACCELERATION_TILT,
              -24,
              24
            );
            const swayAmplitude = centerGrip
              ? WORD_DRAG_CENTER_SWAY
              : WORD_DRAG_EDGE_SWAY;
            const swaySpeed = centerGrip ? 0.009 : 0.0075;
            const sway =
              Math.sin(time * swaySpeed + (body.wobblePhase || 0)) * swayAmplitude;
            const targetAngle = normalizeWordAngle(
              (body.hangAngle ?? body.angle) +
                velocityTilt +
                accelerationTilt +
                sway
            );
            const angleError = shortestAngleDelta(targetAngle, body.angle);

            body.angularVelocity +=
              angleError * WORD_DRAG_ANGULAR_SPRING * delta;

            // A quick left/right reversal injects a little extra rotational
            // momentum. This is what keeps an already-vertical or upside-down
            // word visibly swaying instead of moving like a rigid sticker.
            const reversalKick = clamp(
              -(body.pointerAx || 0) * 0.0018,
              -95,
              95
            );
            body.angularVelocity += reversalKick * delta * 7;
            body.angularVelocity *= Math.pow(
              WORD_DRAG_ANGULAR_DAMPING,
              delta * 60
            );
            body.angle = normalizeWordAngle(
              body.angle + body.angularVelocity * delta
            );
          }

          const grabPoint = getRotatedPoint(
            body.grabLocalX || 0,
            body.grabLocalY || 0,
            body.angle
          );
          let nextX = (body.pointerX ?? body.x) - grabPoint.x;
          let nextY = (body.pointerY ?? body.y) - grabPoint.y;
          const extents = getRotatedExtents(body);
          const minX = WORD_EDGE_GAP + extents.x;
          const maxX = Math.max(minX, width - WORD_EDGE_GAP - extents.x);
          const minY = WORD_EDGE_GAP + extents.y;
          const maxY = Math.max(minY, height - WORD_EDGE_GAP - extents.y);

          nextX = clamp(nextX, minX, maxX);
          nextY = clamp(nextY, minY, maxY);
          body.x = nextX;
          body.y = nextY;
        }

        const ropeLine = ropeLineNodesRef.current.get(word.id);

        if (ropeLine && body.rope) {
          const attachment = getRotatedPoint(
            body.rope.localX,
            body.rope.localY,
            body.angle
          );
          ropeLine.setAttribute("x1", body.rope.anchorX);
          ropeLine.setAttribute("y1", body.rope.anchorY);
          ropeLine.setAttribute("x2", body.x + attachment.x);
          ropeLine.setAttribute("y2", body.y + attachment.y);
        }

        applyWordTransform(node, body);
      });

      animationFrame = window.requestAnimationFrame(animateWords);
    };

    animationFrame = window.requestAnimationFrame(animateWords);

    return () => {
      if (animationFrame != null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [active, gravityWords]);

  useLayoutEffect(() => {
    if (!active) {
      return undefined;
    }

    exitingRef.current = false;

    const root = rootRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const topDash = topDashRef.current;
    const bottomDash = bottomDashRef.current;
    const firstGroup = firstGroupRef.current;

    if (!root || !viewport || !track || !firstGroup) {
      return undefined;
    }

    const html = document.documentElement;
    const body = document.body;
    const smoother = ScrollSmoother?.get?.();
    const smoothWrapper = document.getElementById("smooth-wrapper");
    const previousOverflow = body.style.overflow;
    const previousHtmlOverflow = html.style.overflow;

    let pointerId = null;
    let lastPointerX = 0;
    let dragDistance = 0;
    let currentX = 0;
    let loopWidth = 0;
    let autoPaused = false;

    const normalizeX = (value) => {
      if (loopWidth <= 0) {
        return value;
      }

      let normalized = value;

      while (normalized <= -loopWidth) {
        normalized += loopWidth;
      }

      while (normalized > 0) {
        normalized -= loopWidth;
      }

      return normalized;
    };

    const applyDashOffset = () => {
      const dashOffset = -currentX;

      if (topDash) {
        gsap?.set?.(topDash, {
          backgroundPositionX: `${dashOffset}px`,
        });
      }

      if (bottomDash) {
        gsap?.set?.(bottomDash, {
          backgroundPositionX: `${dashOffset}px`,
        });
      }
    };

    const applyX = () => {
      gsap?.set?.(track, {
        x: currentX,
        force3D: true,
      });

      applyDashOffset();
    };

    const measureLoop = () => {
      const measuredWidth = firstGroup.getBoundingClientRect().width;

      if (measuredWidth <= 0) {
        return;
      }

      loopWidth = measuredWidth;
      currentX = normalizeX(currentX);
      applyX();
    };

    const lockPage = () => {
      html.classList.add("project-intro-is-active");
      body.classList.add("project-intro-is-active");
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      smoothWrapper?.setAttribute("inert", "");
      smoother?.paused?.(true);
      smoother?.scrollTo?.(0, false);
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    const unlockPage = () => {
      html.classList.remove("project-intro-is-active");
      body.classList.remove("project-intro-is-active");
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousOverflow;
      smoothWrapper?.removeAttribute("inert");
      smoother?.paused?.(false);
      smoother?.scrollTo?.(0, false);
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });

      window.requestAnimationFrame(() => {
        ScrollTrigger?.refresh?.();
        ScrollTrigger?.update?.();
      });
    };

    const exitIntro = () => {
      if (exitingRef.current) {
        return;
      }

      exitingRef.current = true;
      setWordPrompt(null);
      setDraftWord("");

      if (!gsap || prefersReducedMotion()) {
        onOpen?.();
        return;
      }

      gsap.set(root, { pointerEvents: "none" });

      gsap
        .timeline({
          defaults: { overwrite: "auto" },
          onComplete() {
            onOpen?.();
          },
        })
        .to(root, {
          yPercent: -100,
          duration: 1.08,
          ease: "power4.inOut",
        });
    };

    lockPage();

    const context = gsap?.context?.(() => {
      if (entryMode === "return") {
        gsap.set(root, {
          autoAlpha: 1,
          pointerEvents: "auto",
          yPercent: -100,
        });

        gsap.set("[data-project-intro-line]", {
          yPercent: 0,
          autoAlpha: 1,
        });

        gsap.set(viewport, {
          clipPath: "inset(0% 0% 0% 0%)",
        });

        gsap.to(root, {
          yPercent: 0,
          duration: 1.08,
          ease: "power4.inOut",
          overwrite: "auto",
        });

        return;
      }

      gsap.set(root, {
        autoAlpha: 1,
        pointerEvents: "auto",
        yPercent: 0,
      });

      gsap.set("[data-project-intro-line]", {
        yPercent: 115,
        autoAlpha: 0,
      });

      gsap.set(viewport, {
        clipPath: "inset(0% 0% 100% 0%)",
      });

      gsap
        .timeline({
          defaults: { overwrite: "auto" },
        })
        .to(
          "[data-project-intro-line]",
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.78,
            stagger: 0.08,
            ease: "power4.out",
          },
          0.08
        )
        .to(
          viewport,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.82,
            ease: "power4.inOut",
          },
          0.24
        );
    }, root);

    if (!gsap) {
      root.style.opacity = "1";
      root.style.visibility = "visible";
      root.style.transform = "translateY(0)";
    }

    measureLoop();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measureLoop)
        : null;

    resizeObserver?.observe(firstGroup);

    const ticker = (_time, deltaTime) => {
      if (
        autoPaused ||
        prefersReducedMotion() ||
        loopWidth <= 0
      ) {
        return;
      }

      currentX -= AUTO_SPEED * ((deltaTime || 16.67) / 1000);
      currentX = normalizeX(currentX);
      applyX();
    };

    gsap?.ticker?.add?.(ticker);

    const handleWheel = (event) => {
      event.preventDefault();

      if (event.deltaY > 8) {
        exitIntro();
      }
    };

    const preventTouchScroll = (event) => {
      event.preventDefault();
    };

    const handleKeyDown = (event) => {
      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (target.matches("input, textarea") || target.isContentEditable)
      ) {
        return;
      }

      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        exitIntro();
        return;
      }

      if (["ArrowUp", "PageUp", "Home", "End"].includes(event.key)) {
        event.preventDefault();
      }
    };

    const handlePointerDown = (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      pointerId = event.pointerId;
      lastPointerX = event.clientX;
      dragDistance = 0;
      autoPaused = true;
      setDragging(true);

      try {
        viewport.setPointerCapture?.(event.pointerId);
      } catch {
        // Pointer capture is optional.
      }

    };

    const handlePointerMove = (event) => {
      if (event.pointerId !== pointerId || pointerId === null) {
        return;
      }

      const delta = event.clientX - lastPointerX;
      lastPointerX = event.clientX;
      dragDistance += Math.abs(delta);

      currentX += delta;
      currentX = normalizeX(currentX);
      applyX();
    };

    const finishDrag = (event) => {
      if (
        pointerId === null ||
        (event?.pointerId != null && event.pointerId !== pointerId)
      ) {
        return;
      }

      try {
        viewport.releasePointerCapture?.(pointerId);
      } catch {
        // Safe to ignore.
      }

      if (dragDistance > 7) {
        clickSuppressUntilRef.current = performance.now() + 260;
      }

      pointerId = null;
      setDragging(false);

      window.setTimeout(() => {
        autoPaused = false;
      }, 160);
    };

    viewport.addEventListener("pointerdown", handlePointerDown);
    viewport.addEventListener("pointermove", handlePointerMove);
    viewport.addEventListener("pointerup", finishDrag);
    viewport.addEventListener("pointercancel", finishDrag);
    viewport.addEventListener("lostpointercapture", finishDrag);
    window.addEventListener("resize", measureLoop);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchmove", preventTouchScroll, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      viewport.removeEventListener("pointerdown", handlePointerDown);
      viewport.removeEventListener("pointermove", handlePointerMove);
      viewport.removeEventListener("pointerup", finishDrag);
      viewport.removeEventListener("pointercancel", finishDrag);
      viewport.removeEventListener("lostpointercapture", finishDrag);
      window.removeEventListener("resize", measureLoop);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", preventTouchScroll);
      window.removeEventListener("keydown", handleKeyDown);
      resizeObserver?.disconnect?.();
      gsap?.ticker?.remove?.(ticker);
      context?.revert?.();
      unlockPage();
    };
  }, [active, entryMode, onOpen]);

  const handleIntroClick = (event) => {
    if (
      !active ||
      exitingRef.current ||
      performance.now() < clickSuppressUntilRef.current
    ) {
      return;
    }

    if (
      event.target instanceof Element &&
      event.target.closest(
        ".project-intro-tools, .project-intro-gravity-word, .project-intro-word-entry"
      )
    ) {
      return;
    }

    const root = rootRef.current;

    if (!root) {
      return;
    }

    const rect = root.getBoundingClientRect();
    const rawX = clamp(event.clientX - rect.left, WORD_EDGE_GAP, rect.width - WORD_EDGE_GAP);
    const rawY = clamp(event.clientY - rect.top, WORD_EDGE_GAP, rect.height - WORD_EDGE_GAP);

    if (interactionMode === "rope") {
      if (!ropeSelection) {
        return;
      }

      const body = wordBodiesRef.current.get(ropeSelection.wordId);

      if (!body) {
        setRopeSelection(null);
        return;
      }

      const attachment = getRotatedPoint(
        ropeSelection.localX,
        ropeSelection.localY,
        body.angle
      );
      const attachmentX = body.x + attachment.x;
      const attachmentY = body.y + attachment.y;
      const initialRopeLength = Math.max(
        ROPE_MIN_LENGTH,
        Math.hypot(attachmentX - rawX, attachmentY - rawY)
      );
      const targetRopeLength = clamp(
        initialRopeLength * 0.32,
        ROPE_MIN_LENGTH,
        ROPE_MAX_LENGTH
      );
      const pullDx = rawX - attachmentX;
      const pullDy = rawY - attachmentY;
      const pullDistance = Math.max(Math.hypot(pullDx, pullDy), 0.001);

      body.rope = {
        anchorX: rawX,
        anchorY: rawY,
        localX: ropeSelection.localX,
        localY: ropeSelection.localY,
        length: initialRopeLength,
        targetLength: targetRopeLength,
      };
      body.dragging = false;
      body.pointerId = null;

      // Give the body an immediate tug toward the anchor. The rope then reels
      // in over the next few frames, so the word is physically drawn toward
      // the clicked point and starts hanging/swinging on a short line.
      body.vx = body.vx * 0.2 + (pullDx / pullDistance) * ROPE_PULL_IMPULSE;
      body.vy = body.vy * 0.2 + (pullDy / pullDistance) * ROPE_PULL_IMPULSE;

      setRopedWordIds((current) =>
        current.includes(ropeSelection.wordId)
          ? [...current]
          : [...current, ropeSelection.wordId]
      );
      setRopeSelection(null);
      return;
    }

    const horizontalPadding = Math.min(200, rect.width * 0.48);
    const verticalPadding = 44;
    const x = Math.min(
      Math.max(rawX, horizontalPadding),
      Math.max(horizontalPadding, rect.width - horizontalPadding)
    );
    const y = Math.min(
      Math.max(rawY, verticalPadding),
      Math.max(verticalPadding, rect.height - verticalPadding)
    );

    setDraftWord("");
    setWordPrompt({ x, y });
  };

  const selectInteractionMode = (mode) => {
    setInteractionMode(mode);
    setToolsOpen(false);
    setRopeSelection(null);

    if (mode === "rope") {
      cancelWordEntry();
    }
  };

  const selectWordForRope = (event, id) => {
    const body = wordBodiesRef.current.get(id);
    const root = rootRef.current;
    const node = event.currentTarget;

    if (!body || !root) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();
    clickSuppressUntilRef.current = event.timeStamp + 220;

    if (!body.halfWidth || !body.halfHeight) {
      body.halfWidth = node.offsetWidth / 2;
      body.halfHeight = node.offsetHeight / 2;
    }

    const rootRect = root.getBoundingClientRect();
    const pointerX = event.clientX - rootRect.left;
    const pointerY = event.clientY - rootRect.top;
    const worldOffsetX = pointerX - body.x;
    const worldOffsetY = pointerY - body.y;
    const radians = body.angle * DEG_TO_RAD;
    const cosine = Math.cos(radians);
    const sine = Math.sin(radians);
    const localX = clamp(
      worldOffsetX * cosine + worldOffsetY * sine,
      -body.halfWidth,
      body.halfWidth
    );
    const localY = clamp(
      -worldOffsetX * sine + worldOffsetY * cosine,
      -body.halfHeight,
      body.halfHeight
    );

    setRopeSelection({ wordId: id, localX, localY });
  };

  const createGravityWord = () => {
    const text = draftWord.trim();

    if (!text || !wordPrompt) {
      return;
    }

    const id = `gravity-word-${Date.now()}-${wordIdRef.current}`;
    wordIdRef.current += 1;

    wordBodiesRef.current.set(id, {
      x: wordPrompt.x,
      y: wordPrompt.y,
      vx: (Math.random() - 0.5) * 72,
      vy: 0,
      angle: (Math.random() - 0.5) * 6,
      angularVelocity: (Math.random() - 0.5) * 68,
      restDirection: Math.random() < 0.5 ? -1 : 1,
      halfWidth: 0,
      halfHeight: 0,
      dragging: false,
      pointerId: null,
      dragOffsetX: 0,
      dragOffsetY: 0,
      lastPointerX: 0,
      lastPointerY: 0,
      lastPointerTime: 0,
    });

    setGravityWords((currentWords) => {
      const nextWords = [...currentWords, { id, text }];

      if (nextWords.length > MAX_GRAVITY_WORDS) {
        const [removedWord] = nextWords.splice(0, nextWords.length - MAX_GRAVITY_WORDS);

        if (removedWord) {
          wordBodiesRef.current.delete(removedWord.id);
          wordNodesRef.current.delete(removedWord.id);
        }
      }

      return nextWords;
    });

    setDraftWord("");
    setWordPrompt(null);
  };

  const handleWordInputKeyDown = (event) => {
    event.stopPropagation();

    if (event.key === "Enter") {
      event.preventDefault();
      createGravityWord();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      cancelWordEntry();
    }
  };

  const cancelWordEntry = () => {
    setDraftWord("");
    setWordPrompt(null);
  };

  const handleGravityWordPointerDown = (event, id) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    if (interactionMode === "rope") {
      selectWordForRope(event, id);
      return;
    }

    const body = wordBodiesRef.current.get(id);

    if (!body) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();
    clickSuppressUntilRef.current = event.timeStamp + 260;

    const node = event.currentTarget;
    const root = rootRef.current;

    if (!root) {
      return;
    }

    if (!body.halfWidth || !body.halfHeight) {
      body.halfWidth = node.offsetWidth / 2;
      body.halfHeight = node.offsetHeight / 2;
    }

    const rootRect = root.getBoundingClientRect();
    const pointerX = event.clientX - rootRect.left;
    const pointerY = event.clientY - rootRect.top;
    const worldOffsetX = pointerX - body.x;
    const worldOffsetY = pointerY - body.y;
    const radians = body.angle * DEG_TO_RAD;
    const cosine = Math.cos(radians);
    const sine = Math.sin(radians);
    const localX = clamp(
      worldOffsetX * cosine + worldOffsetY * sine,
      -body.halfWidth,
      body.halfWidth
    );
    const localY = clamp(
      -worldOffsetX * sine + worldOffsetY * cosine,
      -body.halfHeight,
      body.halfHeight
    );
    const grabSide = body.halfWidth > 0 ? localX / body.halfWidth : 0;
    const centerGrip = Math.abs(grabSide) < 0.28;
    const gripVectorAngle = Math.atan2(localY, localX) * RAD_TO_DEG;
    const naturalHangAngle = normalizeWordAngle(-90 - gripVectorAngle);
    const alternateHangAngle = normalizeWordAngle(naturalHangAngle + 180);
    const closestHangAngle =
      Math.abs(shortestAngleDelta(naturalHangAngle, body.angle)) <=
      Math.abs(shortestAngleDelta(alternateHangAngle, body.angle))
        ? naturalHangAngle
        : alternateHangAngle;

    body.dragging = true;
    if (body.rope) {
      body.rope.wasDragged = true;
    }
    body.pointerId = event.pointerId;
    body.grabLocalX = localX;
    body.grabLocalY = localY;
    body.grabSide = grabSide;
    body.centerGrip = centerGrip;
    // If grabbed near the middle, preserve the word's current orientation
    // and let inertia make it wobble around that pose. For an edge grip, use
    // the physically closest hanging orientation instead of forcing the word
    // upright, so a word that is already vertical/upside-down keeps behaving
    // naturally while being dragged.
    body.hangAngle = centerGrip ? body.angle : closestHangAngle;
    body.wobblePhase =
      ((pointerX * 0.17 + pointerY * 0.13 + event.timeStamp * 0.01) % 1) *
      Math.PI * 2;
    body.pointerX = pointerX;
    body.pointerY = pointerY;
    body.pointerVx = 0;
    body.pointerVy = 0;
    body.pointerAx = 0;
    body.pointerAy = 0;
    body.lastPointerX = pointerX;
    body.lastPointerY = pointerY;
    body.lastPointerTime = event.timeStamp;
    body.vx = 0;
    body.vy = 0;
    body.angularVelocity *= 0.35;

    try {
      node.setPointerCapture?.(event.pointerId);
    } catch {
      // Pointer capture is optional.
    }
  };

  const handleGravityWordPointerMove = (event, id) => {
    const body = wordBodiesRef.current.get(id);

    if (!body || !body.dragging || body.pointerId !== event.pointerId) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    const root = rootRef.current;

    if (!root) {
      return;
    }

    const rootRect = root.getBoundingClientRect();
    const pointerX = event.clientX - rootRect.left;
    const pointerY = event.clientY - rootRect.top;
    const now = event.timeStamp;
    const elapsed = Math.max(now - body.lastPointerTime, 8) / 1000;
    const pointerVx = (pointerX - body.lastPointerX) / elapsed;
    const pointerVy = (pointerY - body.lastPointerY) / elapsed;
    const previousVx = body.pointerVx || 0;
    const previousVy = body.pointerVy || 0;

    // Keep smoothed velocity and acceleration. Velocity makes the body lag
    // behind the hand; acceleration/reversals make it swing past center.
    body.pointerVx = previousVx * 0.35 + pointerVx * 0.65;
    body.pointerVy = previousVy * 0.35 + pointerVy * 0.65;
    const rawAx = (body.pointerVx - previousVx) / elapsed;
    const rawAy = (body.pointerVy - previousVy) / elapsed;
    body.pointerAx = (body.pointerAx || 0) * 0.42 + rawAx * 0.58;
    body.pointerAy = (body.pointerAy || 0) * 0.42 + rawAy * 0.58;
    body.vx = body.pointerVx;
    body.vy = body.pointerVy;
    body.pointerX = pointerX;
    body.pointerY = pointerY;
    body.lastPointerX = pointerX;
    body.lastPointerY = pointerY;
    body.lastPointerTime = now;
  };

  const finishGravityWordDrag = (event, id) => {
    const body = wordBodiesRef.current.get(id);

    if (!body || !body.dragging || body.pointerId !== event.pointerId) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();
    clickSuppressUntilRef.current = event.timeStamp + 300;

    try {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
    } catch {
      // Safe to ignore.
    }

    const grabPoint = getRotatedPoint(
      body.grabLocalX || 0,
      body.grabLocalY || 0,
      body.angle
    );
    const radiusSquared = Math.max(
      grabPoint.x * grabPoint.x + grabPoint.y * grabPoint.y,
      700
    );
    const crossVelocity =
      grabPoint.x * (body.vy || 0) - grabPoint.y * (body.vx || 0);
    const leverSpin = (crossVelocity / radiusSquared) * RAD_TO_DEG;
    const centerSpin = body.centerGrip
      ? clamp(-(body.vx || 0) * 0.13, -280, 280)
      : 0;
    const reversalSpin = clamp(
      -(body.pointerAx || 0) * 0.004,
      -240,
      240
    );

    // A throw from an edge naturally creates more torque than a throw from
    // the middle. Fast gestures can therefore rotate past 180 degrees and
    // genuinely land upside-down before gravity settles the word again.
    body.angularVelocity = clamp(
      body.angularVelocity + leverSpin * 0.92 + centerSpin + reversalSpin,
      -WORD_MAX_THROW_SPIN,
      WORD_MAX_THROW_SPIN
    );
    // Preserve most of the release momentum for roped words so the spring
    // can visibly pull them back and overshoot. Unroped words keep the same
    // slightly softer throw behavior as before.
    const releaseRetention = body.rope ? 0.985 : 0.96;
    body.vx *= releaseRetention;
    body.vy *= releaseRetention;
    if (body.rope) {
      body.rope.wasDragged = false;
    }
    body.dragging = false;
    body.pointerId = null;
    body.pointerX = null;
    body.pointerY = null;
  };

  if (!active) {
    return null;
  }

  return (
    <section
      ref={rootRef}
      className={`project-intro-gateway is-${interactionMode}-mode`}
      aria-label="Portfolio introduction"
      onClick={handleIntroClick}
    >
      <div
        className={`project-intro-tools${toolsOpen ? " is-open" : ""}`}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="project-intro-tools__trigger"
          aria-label="Open intro tools"
          aria-expanded={toolsOpen}
          onClick={() => setToolsOpen((current) => !current)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h10M18 7h2M4 17h2M10 17h10M4 12h4M12 12h8" />
            <circle cx="16" cy="7" r="2" />
            <circle cx="8" cy="17" r="2" />
            <circle cx="10" cy="12" r="2" />
          </svg>
          <span>TOOLS</span>
        </button>

        {toolsOpen ? (
          <div className="project-intro-tools__menu" role="menu">
            <span className="project-intro-tools__label">MODE</span>
            <button
              type="button"
              className={interactionMode === "mouse" ? "is-active" : ""}
              onClick={() => selectInteractionMode("mouse")}
              role="menuitem"
            >
              <span>MOUSE</span>
              <small>TYPE + MOVE</small>
            </button>
            <button
              type="button"
              className={interactionMode === "rope" ? "is-active" : ""}
              onClick={() => selectInteractionMode("rope")}
              role="menuitem"
            >
              <span>ROPE</span>
              <small>HANG WORD</small>
            </button>
          </div>
        ) : null}

        {interactionMode === "rope" ? (
          <div className="project-intro-tools__status" aria-live="polite">
            {ropeSelection ? "CLICK AN ANCHOR POINT" : "SELECT A WORD"}
          </div>
        ) : null}
      </div>

      <div
        className="project-intro-copy"

        aria-label="Building, learning, and growing through practical projects"
      >
        <div className="project-intro-copy__mask">
          <span data-project-intro-line>BUILDING, LEARNING, AND</span>
        </div>
        <div className="project-intro-copy__mask">
          <span data-project-intro-line>GROWING THROUGH</span>
        </div>
        <div className="project-intro-copy__mask">
          <span data-project-intro-line>PRACTICAL PROJECTS</span>
        </div>
      </div>

      <div
        ref={viewportRef}
        className={`project-intro-slider${dragging ? " is-dragging" : ""}`}
        aria-label="Project preview slider. Drag horizontally to explore."
      >
        <span
          ref={topDashRef}
          className="project-intro-slider__dash-line project-intro-slider__dash-line--top"
          aria-hidden="true"
        />
        <span
          ref={bottomDashRef}
          className="project-intro-slider__dash-line project-intro-slider__dash-line--bottom"
          aria-hidden="true"
        />
        <div ref={trackRef} className="project-intro-slider__track">
          {[0, 1].map((groupIndex) => (
            <div
              ref={groupIndex === 0 ? firstGroupRef : undefined}
              key={groupIndex}
              className="project-intro-slider__group"
              aria-hidden={groupIndex === 1 ? "true" : undefined}
            >
              {projects.map((project) => (
                <figure
                  key={`${groupIndex}-${project.name}`}
                  className="project-intro-card"
                >
                  <div className="project-intro-card__media">
                    <img
                      src={project.image}
                      alt={
                        groupIndex === 0
                          ? `${project.name} project preview`
                          : ""
                      }
                      draggable="false"
                      decoding="async"
                    />
                  </div>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>

      <svg
        className="project-intro-rope-layer"
        width="100%"
        height="100%"
        aria-hidden="true"
        focusable="false"
      >
        {gravityWords
          .filter((word) => ropedWordIds.includes(word.id))
          .map((word) => (
            <line
              key={`rope-${word.id}`}
              ref={(node) => {
                if (node) {
                  ropeLineNodesRef.current.set(word.id, node);
                } else {
                  ropeLineNodesRef.current.delete(word.id);
                }
              }}
              className="project-intro-rope"
              x1="0"
              y1="0"
              x2="0"
              y2="0"
            />
          ))}
      </svg>

      <div className="project-intro-gravity-layer" aria-live="polite">
        {gravityWords.map((word) => (
          <span
            key={word.id}
            ref={(node) => {
              if (node) {
                wordNodesRef.current.set(word.id, node);
              } else {
                wordNodesRef.current.delete(word.id);
              }
            }}
            className={`project-intro-gravity-word${
              ropeSelection?.wordId === word.id ? " is-rope-selected" : ""
            }`}
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => handleGravityWordPointerDown(event, word.id)}
            onPointerMove={(event) => handleGravityWordPointerMove(event, word.id)}
            onPointerUp={(event) => finishGravityWordDrag(event, word.id)}
            onPointerCancel={(event) => finishGravityWordDrag(event, word.id)}
          >
            {word.text}
          </span>
        ))}
      </div>

      {wordPrompt ? (
        <div
          className="project-intro-word-entry"
          style={{ left: wordPrompt.x, top: wordPrompt.y }}
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <input
            ref={wordInputRef}
            type="text"
            value={draftWord}
            maxLength={20}
            placeholder="TYPE A WORD"
            aria-label="Type a word and press Enter"
            autoComplete="off"
            spellCheck="false"
            onChange={(event) => setDraftWord(event.target.value)}
            onKeyDown={handleWordInputKeyDown}
          />
          <div className="project-intro-word-entry__actions">
            <button
              type="button"
              onClick={cancelWordEntry}
              aria-label="Cancel typing word"
            >
              CANCEL
            </button>
            <span aria-hidden="true">ENTER ↵</span>
          </div>
        </div>
      ) : null}
    </section>
  );
}
