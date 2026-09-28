import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router";

import { galleryFilterOptions, galleryPhotos } from "../data/gallery";
import { usePageMetadata } from "../hooks/usePageMetadata";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import "../styles/gallery-page.css";

const AUTO_CHANGE_DELAY = 5200;
const SWIPE_THRESHOLD = 64;
const FILTER_STORAGE_KEY = "rizki-portfolio-gallery-filters-v1";

const readSavedFilters = () => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const value = window.localStorage.getItem(FILTER_STORAGE_KEY);
    return value ? JSON.parse(value) : {};
  } catch {
    return {};
  }
};

const getFilterValue = (filterId) =>
  galleryFilterOptions.find((option) => option.id === filterId)?.filter ??
  "none";

export default function GalleryPage() {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const revealRef = useRef(null);
  const chromeRef = useRef(null);
  const imageRefs = useRef([]);
  const previousIndexRef = useRef(null);
  const directionRef = useRef(1);
  const dragRef = useRef({ pointerId: null, startX: 0, deltaX: 0 });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [editorOpen, setEditorOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [filtersByPhoto, setFiltersByPhoto] = useState(readSavedFilters);

  usePageMetadata({
    title: "Gallery | Rizki Ramadhan",
    description: "A personal visual gallery by Rizki Ramadhan.",
    path: "/gallery",
    language: "en",
  });

  const currentPhoto = galleryPhotos[currentIndex];
  const currentFilterId = filtersByPhoto[currentPhoto.id] ?? "none";

  const changePhoto = useCallback(
    (direction) => {
      if (galleryPhotos.length < 2) {
        return;
      }

      previousIndexRef.current = currentIndex;
      directionRef.current = direction;

      setCurrentIndex((index) => {
        const total = galleryPhotos.length;
        return (index + direction + total) % total;
      });
    },
    [currentIndex]
  );

  useLayoutEffect(() => {
    const root = rootRef.current;
    const reveal = revealRef.current;
    const chrome = chromeRef.current;

    if (!root || !reveal) {
      return undefined;
    }

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    html.classList.add("gallery-is-active");
    body.classList.add("gallery-is-active");
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    if (!gsap || prefersReducedMotion()) {
      reveal.style.height = "100%";
      if (chrome) {
        chrome.style.opacity = "1";
      }

      imageRefs.current.forEach((image, index) => {
        if (!image) {
          return;
        }

        image.style.opacity = index === 0 ? "1" : "0";
        image.style.visibility = index === 0 ? "visible" : "hidden";
        image.style.transform = "none";
      });

      const revealFrame = window.requestAnimationFrame(() => {
        setIntroComplete(true);
      });

      return () => {
        window.cancelAnimationFrame(revealFrame);
        html.classList.remove("gallery-is-active");
        body.classList.remove("gallery-is-active");
        html.style.overflow = previousHtmlOverflow;
        body.style.overflow = previousBodyOverflow;
      };
    }

    const firstImage = imageRefs.current[0];
    const context = gsap.context(() => {
      gsap.set(reveal, {
        height: 0,
      });

      gsap.set(chrome, {
        autoAlpha: 0,
        y: 18,
      });

      imageRefs.current.forEach((image, index) => {
        if (!image) {
          return;
        }

        gsap.set(image, {
          autoAlpha: index === 0 ? 1 : 0,
          scale: index === 0 ? 1.07 : 1.03,
          xPercent: 0,
          x: 0,
        });
      });

      gsap
        .timeline({
          defaults: { overwrite: "auto" },
          onComplete() {
            setIntroComplete(true);
          },
        })
        .to(
          reveal,
          {
            height: "100%",
            duration: 1.34,
            ease: "power4.inOut",
          },
          0.12
        )
        .to(
          firstImage,
          {
            scale: 1,
            duration: 1.45,
            ease: "power3.out",
          },
          0.12
        )
        .to(
          chrome,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.66,
            ease: "power3.out",
          },
          0.82
        );
    }, root);

    return () => {
      context?.revert?.();
      html.classList.remove("gallery-is-active");
      body.classList.remove("gallery-is-active");
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, []);

  useLayoutEffect(() => {
    if (!introComplete) {
      return undefined;
    }

    const activeImage = imageRefs.current[currentIndex];
    const previousIndex = previousIndexRef.current;
    const previousImage =
      previousIndex == null ? null : imageRefs.current[previousIndex];
    const direction = directionRef.current;

    if (!activeImage) {
      return undefined;
    }

    if (!gsap || prefersReducedMotion()) {
      imageRefs.current.forEach((image, index) => {
        if (!image) {
          return;
        }

        image.style.opacity = index === currentIndex ? "1" : "0";
        image.style.visibility = index === currentIndex ? "visible" : "hidden";
      });
      return undefined;
    }

    const context = gsap.context(() => {
      const revealOrigin = direction > 0 ? "100% 50%" : "0% 50%";
      const startOffset = direction > 0 ? 28 : -28;
      const outgoingOffset = direction > 0 ? -11 : 11;

      imageRefs.current.forEach((image, index) => {
        if (!image || index === currentIndex || index === previousIndex) {
          return;
        }

        gsap.set(image, {
          autoAlpha: 0,
          zIndex: 1,
          xPercent: 0,
          x: 0,
          scale: 1,
          clipPath: "ellipse(160% 120% at 50% 50%)",
        });
      });

      gsap.killTweensOf([activeImage, previousImage].filter(Boolean));

      /*
       * Photo changes use a horizontal curved wipe instead of a cross-fade.
       * The incoming photo starts slightly outside the requested direction,
       * while an ellipse grows from that edge. This makes the transition seam
       * feel like a moving circular/curved surface rather than a flat fade.
       */
      gsap.set(activeImage, {
        autoAlpha: 1,
        zIndex: 3,
        xPercent: startOffset,
        x: 0,
        scale: 1.035,
        clipPath: `ellipse(0% 92% at ${revealOrigin})`,
      });

      if (previousImage && previousImage !== activeImage) {
        gsap.set(previousImage, {
          autoAlpha: 1,
          zIndex: 2,
          clipPath: "ellipse(160% 120% at 50% 50%)",
        });
      }

      const transition = gsap.timeline({
        defaults: { overwrite: "auto" },
        onComplete() {
          if (previousImage && previousImage !== activeImage) {
            gsap.set(previousImage, {
              autoAlpha: 0,
              zIndex: 1,
              xPercent: 0,
              x: 0,
              scale: 1,
              clipPath: "ellipse(160% 120% at 50% 50%)",
            });
          }

          gsap.set(activeImage, {
            zIndex: 2,
            xPercent: 0,
            x: 0,
            scale: 1,
            clipPath: "ellipse(160% 120% at 50% 50%)",
          });
        },
      });

      if (previousImage && previousImage !== activeImage) {
        transition.to(
          previousImage,
          {
            xPercent: outgoingOffset,
            x: 0,
            scale: 1.025,
            duration: 0.96,
            ease: "power3.inOut",
          },
          0
        );
      }

      transition.to(
        activeImage,
        {
          xPercent: 0,
          x: 0,
          scale: 1,
          clipPath: `ellipse(165% 118% at ${revealOrigin})`,
          duration: 0.96,
          ease: "power4.inOut",
        },
        0
      );
    }, rootRef.current);

    return () => context?.revert?.();
  }, [currentIndex, introComplete]);

  useEffect(() => {
    if (!introComplete || editorOpen || dragging || galleryPhotos.length < 2) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      changePhoto(1);
    }, AUTO_CHANGE_DELAY);

    return () => window.clearInterval(timer);
  }, [changePhoto, dragging, editorOpen, introComplete]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        FILTER_STORAGE_KEY,
        JSON.stringify(filtersByPhoto)
      );
    } catch {
      // Local persistence is optional. The gallery still works without it.
    }
  }, [filtersByPhoto]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        changePhoto(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        changePhoto(1);
      } else if (event.key === "Escape") {
        event.preventDefault();

        if (editorOpen) {
          setEditorOpen(false);
        } else {
          navigate("/");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changePhoto, editorOpen, navigate]);

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      deltaX: 0,
    };
    setDragging(true);

    try {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } catch {
      // Pointer capture is optional.
    }
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;

    if (drag.pointerId !== event.pointerId) {
      return;
    }

    drag.deltaX = event.clientX - drag.startX;
    const activeImage = imageRefs.current[currentIndex];

    if (activeImage && gsap && !prefersReducedMotion()) {
      gsap.set(activeImage, {
        x: drag.deltaX * 0.2,
      });
    }
  };

  const finishPointer = (event) => {
    const drag = dragRef.current;

    if (
      drag.pointerId == null ||
      (event?.pointerId != null && event.pointerId !== drag.pointerId)
    ) {
      return;
    }

    try {
      event.currentTarget.releasePointerCapture?.(drag.pointerId);
    } catch {
      // Safe to ignore if capture was already released.
    }

    const deltaX = drag.deltaX;
    dragRef.current = { pointerId: null, startX: 0, deltaX: 0 };
    setDragging(false);

    const activeImage = imageRefs.current[currentIndex];

    if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
      changePhoto(deltaX < 0 ? 1 : -1);
      return;
    }

    if (activeImage && gsap && !prefersReducedMotion()) {
      gsap.to(activeImage, {
        x: 0,
        duration: 0.36,
        ease: "power3.out",
        overwrite: true,
      });
    }
  };

  const applyFilter = (filterId) => {
    setFiltersByPhoto((current) => ({
      ...current,
      [currentPhoto.id]: filterId,
    }));
  };

  return (
    <main ref={rootRef} className="gallery-page" aria-label="My gallery">
      <section
        className={`gallery-stage${dragging ? " is-dragging" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
      >
        <div ref={revealRef} className="gallery-reveal">
          <div className="gallery-media" aria-live="polite">
            {galleryPhotos.map((photo, index) => {
              const filterId = filtersByPhoto[photo.id] ?? "none";

              return (
                <img
                  key={photo.id}
                  ref={(node) => {
                    imageRefs.current[index] = node;
                  }}
                  className="gallery-media__image"
                  src={photo.src}
                  alt={index === currentIndex ? photo.alt : ""}
                  aria-hidden={index !== currentIndex}
                  draggable="false"
                  decoding="async"
                  style={{
                    objectPosition: photo.position,
                    filter: getFilterValue(filterId),
                  }}
                />
              );
            })}
          </div>

          <svg
            className="gallery-curve-mask"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0 0H100V12C80 28 20 28 0 12Z" />
            <path d="M0 84C20 68 80 68 100 84V100H0Z" />
          </svg>
        </div>

        <div ref={chromeRef} className="gallery-chrome">
          <div
            className={`gallery-editor${editorOpen ? " is-open" : ""}`}
            onPointerDown={(event) => event.stopPropagation()}
            onPointerMove={(event) => event.stopPropagation()}
            onPointerUp={(event) => event.stopPropagation()}
          >
            <div className="gallery-editor__panel" aria-hidden={!editorOpen}>
              <div className="gallery-editor__heading">
                <span>FILTER</span>
                <span>
                  {String(currentIndex + 1).padStart(2, "0")} / {String(galleryPhotos.length).padStart(2, "0")}
                </span>
              </div>

              <div className="gallery-editor__options" role="group" aria-label="Photo filter">
                {galleryFilterOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`gallery-filter-option${currentFilterId === option.id ? " is-active" : ""}`}
                    onClick={() => applyFilter(option.id)}
                    aria-pressed={currentFilterId === option.id}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="gallery-editor__trigger"
              onClick={() => setEditorOpen((open) => !open)}
              aria-expanded={editorOpen}
              aria-label={editorOpen ? "Close photo filter editor" : "Edit photo filter"}
            >
              <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M19.5 6.5l6 6" />
                <path d="M7.2 24.8l3.2-8.4L21.9 4.9a2.4 2.4 0 013.4 0l1.8 1.8a2.4 2.4 0 010 3.4L15.6 21.6l-8.4 3.2z" />
                <path d="M17.8 7.1l7.1 7.1" />
                <path d="M24.5 19.5v5.2a3 3 0 01-3 3H7.3a3 3 0 01-3-3V10.5a3 3 0 013-3h5.2" />
              </svg>
            </button>
          </div>

          <div className="gallery-title-wrap" aria-label="Gallery status">
            <span className="gallery-title-wrap__counter">
              {String(currentIndex + 1).padStart(2, "0")} / {String(galleryPhotos.length).padStart(2, "0")}
            </span>
            <h1 className="gallery-title">MY GALLERY</h1>
          </div>
        </div>
      </section>
    </main>
  );
}
