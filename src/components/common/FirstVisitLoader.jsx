import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useLanguage } from "../../context/language-context";
import "../../styles/first-visit-loader.css";

const MINIMUM_DURATION = 3000;
const STALL_AT_NINETY_DURATION = 1800;
const EXIT_DURATION = 750;

const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

export default function FirstVisitLoader() {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) return undefined;

    let cancelled = false;
    let frame = 0;
    let exitTimer = 0;
    let removeTimer = 0;
    const started = performance.now();
    document.documentElement.classList.add("ed-loader-active");

    const updateProgress = () => {
      const elapsed = performance.now() - started;
      setProgress(Math.min(90, Math.round((elapsed / STALL_AT_NINETY_DURATION) * 90)));
      frame = window.requestAnimationFrame(updateProgress);
    };
    frame = window.requestAnimationFrame(updateProgress);

    const image = document.querySelector("main img");
    const assetsReady = Promise.allSettled([
      document.fonts?.ready,
      image?.decode?.(),
    ]);

    Promise.all([wait(MINIMUM_DURATION), Promise.race([assetsReady, wait(2300)])]).then(() => {
      if (cancelled) return;
      window.cancelAnimationFrame(frame);
      setProgress(100);
      exitTimer = window.setTimeout(() => setLeaving(true), 140);
      removeTimer = window.setTimeout(() => {
        document.documentElement.classList.remove("ed-loader-active");
        setVisible(false);
      }, 140 + EXIT_DURATION);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
      document.documentElement.classList.remove("ed-loader-active");
    };
  }, [visible]);

  if (!visible) return null;

  const copy = language === "id"
    ? { loading: "MENYIAPKAN PORTOFOLIO", ready: "SIAP DIBUKA", model: "Model logo RR tiga dimensi berputar" }
    : { loading: "PREPARING PORTFOLIO", ready: "READY TO EXPLORE", model: "Rotating three-dimensional RR logo model" };

  return createPortal(
    <div className={`ed-loader${leaving ? " is-leaving" : ""}`} role="status" aria-live="polite" aria-label={copy.loading}>
      <div className="ed-loader__top"><span>RR<span className="ed-loader__dot">.</span></span><span>PORTFOLIO / 2026</span></div>

      <div className="ed-loader__center">
        <span className="ed-loader__index">01 / THE BEGINNING</span>
        <div className="ed-loader__model" role="img" aria-label={copy.model}>
          <div className="ed-loader__orbit ed-loader__orbit--one" />
          <div className="ed-loader__orbit ed-loader__orbit--two" />
          <div className="ed-loader__cube">
            <div className="ed-loader__face ed-loader__face--front">RR<span>.</span></div>
            <div className="ed-loader__face ed-loader__face--back">RR<span>.</span></div>
            <div className="ed-loader__face ed-loader__face--right">2026</div>
            <div className="ed-loader__face ed-loader__face--left">RR<span>.</span></div>
            <div className="ed-loader__face ed-loader__face--top">✳</div>
            <div className="ed-loader__face ed-loader__face--bottom">✳</div>
          </div>
          <div className="ed-loader__shadow" />
        </div>
        <div className="ed-loader__headline">RIZKI<br /><span>RAMADHAN</span></div>
      </div>

      <div className="ed-loader__bottom">
        <span>{progress === 100 ? copy.ready : copy.loading}</span>
        <div className="ed-loader__track" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
        <strong>{String(progress).padStart(3, "0")}%</strong>
      </div>
    </div>,
    document.body
  );
}
