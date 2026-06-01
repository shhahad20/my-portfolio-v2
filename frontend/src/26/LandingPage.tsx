// import React, { useCallback } from "react";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./style/LandingPage.scss";
import AnimatedLink from "../components/AnimatedLink";
import Shuffle from "../components/Shuffle";
import DecryptedText from "../components/DecryptedText";
import AIChatWidget from "./AiChatWidget";
// import AuroraBackground from "./Aurorabackground";
// import AIInput from "./Aiinput";

// ─── Timing constants (ms) — adjust to match your preloader duration ────────
/**
 * How long to wait for a "preloaderDone" custom event before falling back.
 * Set this to match (or slightly exceed) your preloader's total duration.
 */
const PRELOADER_FALLBACK_MS = 1400;

/**
 * Pause after the landing first appears before the intro wave fires.
 * A short cinematic beat — lets the user settle before the animation plays.
 */
const INTRO_WAVE_DELAY_MS = 350;

/**
 * How long the automatic intro wave plays before fading out.
 * Covers ~3 full wave cycles (0.6s duration + 0.5s repeatDelay × 3 ≈ 3.3s).
 */
const INTRO_WAVE_DURATION_MS = 2400;

interface Props {
  imageSrc?: string;
}

const LandingPage: React.FC<Props> = () => {
  // ── UI state ─────────────────────────────────────────────────────────────
  const [isButtonHovered, setIsButtonHovered] = React.useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = React.useState(false);

  /**
   * isIntroWave: true only during the one-shot automatic intro wave.
   * Driven entirely by timers; has no relation to hover state.
   */
  const [isIntroWave, setIsIntroWave] = React.useState(false);

  /**
   * shuffleReady: gates the Shuffle text animation.
   * Flips to true after the preloader finishes so the Shuffle component
   * mounts (or remounts via key) exactly when the landing becomes visible.
   */
  const [shuffleReady, setShuffleReady] = React.useState(false);

  // Guard: ensures the intro sequence runs at most once even if the effect
  // somehow fires twice (StrictMode double-invoke in development).
  const hasRunRef = useRef(false);

  // ── Preloader sync ────────────────────────────────────────────────────────
  useEffect(() => {
    // Refs for cleanup
    const timers: ReturnType<typeof setTimeout>[] = [];

    /**
     * runIntroSequence()
     * ──────────────────
     * 1. Immediately unblocks the Shuffle text animation.
     * 2. After a short cinematic delay, raises the wave emoji.
     * 3. After INTRO_WAVE_DURATION_MS, lowers the wave — hover takes over.
     *
     * Dispatching the "preloaderDone" event from your preloader component:
     *
     *   window.dispatchEvent(new CustomEvent("preloaderDone"));
     *
     * If no event arrives within PRELOADER_FALLBACK_MS the sequence fires
     * automatically, so the page always works even without a preloader.
     */
    const runIntroSequence = () => {
      if (hasRunRef.current) return;
      hasRunRef.current = true;

      // Kick the Shuffle remount immediately — it will animate as soon as
      // the IntersectionObserver fires (the element is already in-viewport
      // by this point since the preloader has cleared).
      setShuffleReady(true);

      // Short beat → wave rises
      const waveOnTimer = setTimeout(() => {
        setIsIntroWave(true);

        // Wave plays for INTRO_WAVE_DURATION_MS → then hands off to hover
        const waveOffTimer = setTimeout(() => {
          setIsIntroWave(false);
        }, INTRO_WAVE_DURATION_MS);

        timers.push(waveOffTimer);
      }, INTRO_WAVE_DELAY_MS);

      timers.push(waveOnTimer);
    };

    // Primary path: preloader dispatches window event when complete
    window.addEventListener("preloaderDone", runIntroSequence, { once: true });

    // Fallback: fire regardless if event never arrives
    const fallbackTimer = setTimeout(runIntroSequence, PRELOADER_FALLBACK_MS);
    timers.push(fallbackTimer);

    return () => {
      window.removeEventListener("preloaderDone", runIntroSequence);
      timers.forEach(clearTimeout);
    };
  }, []);

  // ── Derived state ─────────────────────────────────────────────────────────
  /**
   * showWave: true when EITHER the user is hovering OR the intro wave is live.
   * This single boolean drives both the emoji visibility and the waving
   * animation, keeping hover and intro behaviour perfectly in sync.
   */
  const showWave = isButtonHovered || isIntroWave;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="landing">
      {/* ── Aurora canvas background ────────────────────────────────────── */}
      {/* <AuroraBackground theme="light" /> */}
        {/* <div className="spotlight">
          <div></div>
          <div></div>
          <div></div>
        </div> */}
      {/* Hidden SVG — defines the goo filter for HTML elements */}
      <svg
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden",
        }}
      >
        <defs>
          <filter id="goo-title">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* MAIN CONTENT */}
      <div className="landing__content">
        {/* LEFT COLUMN — Primary content */}
        <div className="landing__left">
          {/* LinkedIn / Resume links */}
          <motion.div
            className="linkedin"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <AnimatedLink
              linkText="LINKEDIN ↗"
              hoverText="LINKEDIN ↗"
              href="https://www.linkedin.com/in/shahadaltharwa/"
            />
            <AnimatedLink
              linkText="RESUME ↗"
              hoverText="RESUME ↗"
              href="/CV_ Shahad_Altharwa_Software_Engineer2025v2.pdf"
            />
          </motion.div>

          {/*
            ── Shuffle title ────────────────────────────────────────────────
            key="idle"  → mounted during preloader (hidden beneath it);
                          deliberately kept dormant so no animation plays
                          while the page is obscured.
            key="ready" → remounts the moment shuffleReady flips true
                          (i.e. right as the preloader lifts).  The fresh
                          mount means IntersectionObserver fires immediately
                          since the element is already in-viewport, giving a
                          perfectly-timed text reveal in sync with the wave.
          */}
          <Shuffle
            key={shuffleReady ? "ready" : "idle"}
            className="title"
            text="Shahad altharwa"
            shuffleDirection="right"
            duration={0.35}
            textAlign="left"
            animationMode="evenodd"
            shuffleTimes={1}
            ease="power3.out"
            stagger={0.03}
            threshold={0.1}
            triggerOnce={true}
            triggerOnHover
            respectReducedMotion={true}
            loop={false}
            loopDelay={0}
          />

          {/* Subtitle & Meta info */}
          <div className="small-content">
            <motion.p
              className="subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Software Engineer & Designer <br />
              Based in Saudi Arabia
            </motion.p>

            <motion.div
              className="meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              PORTFOLIO 26/27
            </motion.div>
          </div>
        </div>

        {/* RIGHT COLUMN — reserved for future image content */}
        {/* <div className="landing__right"> … </div> */}
      </div>

      {/* ── Wave emoji + CTA button ────────────────────────────────────────── */}
      <div style={{ position: "relative", display: "inline-block" }}>
        {/*
          Wave emoji.
          Driven by `showWave` so it responds identically to both
          the automatic intro sequence and the hover interaction.
        */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.5 }}
          animate={
            showWave
              ? { opacity: 1, y: -40, scale: 1 }
              : { opacity: 0, y: 20, scale: 0.5 }
          }
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 0.4,
          }}
          style={{
            position: "absolute",
            top: -40,
            left: "40%",
            transform: "translateX(-50%)",
            fontSize: "32px",
            pointerEvents: "none",
            transformOrigin: "center",
          }}
        >
          <motion.span
            animate={showWave ? { rotate: [0, 20, -20, 20, 0] } : {}}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
            style={{ display: "inline-block", transformOrigin: "70% 70%" }}
          >
            👋🏼
          </motion.span>
        </motion.div>

        {/* CTA button */}
        <button
          className={`button${isIntroWave ? " button--intro" : ""}`}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          onClick={() => setIsWidgetOpen(true)}
          aria-expanded={isWidgetOpen}
          aria-controls="ai-widget-dialog"
        >
          <DecryptedText
            text="ASK ME ANYTHING"
            speed={0.04}
            animateOn="hover"
            triggerOnce={false}
            shouldAnimate={isButtonHovered}
          />
          <span className="button-span"> ─ Ai assistant</span>
        </button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="scroll"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        scroll for more
      </motion.div>

      {/* AI chat widget */}
      <AIChatWidget
        isOpen={isWidgetOpen}
        onClose={() => setIsWidgetOpen(false)}
        assistantName="AI Assistant"
        assistantTagline="Ask me about Shahad's work"
        quickPrompts={[
          "What's your tech stack?",
          "Tell me about your projects",
          "What are your skills?",
          "Let's collaborate",
        ]}
      />
    </div>
  );
};

export default LandingPage;