import React from "react";
import { motion } from "framer-motion";
import "./style/LandingPage.scss";
import AnimatedLink from "../components/AnimatedLink";
import Shuffle from "../components/Shuffle";
import AuroraBackground from "./Aurorabackground";

interface Props {
  imageSrc?: string;
}

const LandingPage: React.FC<Props> = () => {
  // Handle AI input submission
  const handleAISubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = formData.get("ai-query") as string;
    
    if (input.trim()) {
      console.log("AI Query:", input);
      // TODO: Connect to AI service
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <div className="landing">
      {/* ── Aurora canvas background ─────────────────────────────────────── */}
      {/*
        theme="light"  → multiply composite, blue/violet/rose hues on #f8f6f2
        theme="dark"   → lighter composite, green/teal glow on deep navy
        You can still override backgroundColor and baseHue individually.
      */}
      <AuroraBackground theme="light" />

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
          {/* LinkedIn Link */}
          <motion.div
            className="linkedin"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <AnimatedLink
              linkText="LINKEDIN ↗"
              hoverText="LINKEDIN ↗"
              href="/"
            />
          </motion.div>

          {/* Animated Title */}
          <Shuffle
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

          {/* Subtitle & Meta Info */}
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

          {/* AI Input Section ────────────────────────────────────────────── */}
          <motion.form
            className="ai-input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onSubmit={handleAISubmit}
          >
            {/* Icon */}
            <div className="ai-input__icon" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 15.94 16.51"
                width="15"
                height="15"
              >
                <path
                  fill="#ff9500"
                  d="M1.13,1.71C2.29.59,4.96.44,6.5.57c1.73.15,3.41.63,4.84,1.61.14.09.56.47.66.46.1,0,.89-.61.91-.69.07-.22-.16-.31-.27-.47-.25-.35-.22-.77.2-.96C13.08.4,15.1-.01,15.35,0c.32.02.54.24.59.55-.22.7-.38,1.53-.66,2.21-.1.25-.19.49-.5.54-.51.07-.7-.44-.88-.41-1.36,1.13-2.88,2-4.64,2.37-2.1.45-6.61.41-8.23-1.21-.73-.73-.63-1.64.09-2.34ZM10.61,3.26s-.41-.26-.48-.3c-1.87-1.1-5.66-1.57-7.63-.6-.84.42-.75.74.03,1.13,1.86.93,6,.95,7.87.04.11-.06.3-.11.2-.27Z"
                />
                <path
                  fill="#ff9500"
                  d="M12.77,5.05c1.1-.2.96,1.64.79,2.29-1.06,4.12-8.94,4.56-12.12,3.27-1.68-.68-2-2.31-.39-3.3,2.3-1.43,7.49-.97,10.06-.34.2.05.9.32,1.03.27.19-.06.23-.78.22-.96-.01-.24-.12-.48-.07-.73.04-.22.26-.46.48-.5ZM4.35,7.73c-.72.05-2.23.32-2.77.81s.11.76.58.93c1.67.59,4.72.53,6.45.16.91-.2,1.89-.55,2.58-1.19.02-.08-.06-.1-.11-.12-.24-.11-.74-.2-1.01-.26-1.73-.35-3.94-.46-5.71-.34Z"
                />
                <path
                  fill="#ff9500"
                  d="M4.49,12.15c2.97-.29,3.24,4.12.41,4.36s-3.22-4.09-.41-4.36Z"
                />
                <path
                  fill="#ff9500"
                  d="M14.09,12.63c-1.1,1.21-3.15,2.05-4.73,2.35-.53.1-1.45.32-1.46-.52-.01-.74.87-.67,1.37-.8,1.41-.34,4.34-1.38,4.47-3.11.04-.57-.57-1.12-.07-1.57.58-.52,1.07.09,1.25.63.38,1.13-.06,2.18-.82,3.02Z"
                />
              </svg>
            </div>

            {/* Input Field */}
            <input
              className="ai-input__field"
              type="text"
              name="ai-query"
              placeholder="Ask AI for info.."
              autoComplete="off"
              spellCheck={false}
              aria-label="Ask AI for information"
            />

            {/* Send Button */}
            <motion.button
              className="ai-input__send"
              type="submit"
              aria-label="Send AI query"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 6H10M10 6L7 3M10 6L7 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          </motion.form>
        </div>

        {/* RIGHT COLUMN — Image (Hidden on mobile, shown on tablet+) */}
        <div className="landing__right">
          {/* Placeholder for image content */}
          {/* {imageSrc && (
            <motion.img
              src={imageSrc}
              alt="Portfolio illustration"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            />
          )}
          <motion.div
            className="vertical-text"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            This website made with Love & Coffee
          </motion.div> */}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="scroll"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        scroll for more
      </motion.div>
    </div>
  );
};

export default LandingPage;