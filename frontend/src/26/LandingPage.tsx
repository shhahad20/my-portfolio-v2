// import React, { useCallback } from "react";
import React from "react";
import { motion } from "framer-motion";
import "./style/LandingPage.scss";
import AnimatedLink from "../components/AnimatedLink";
import Shuffle from "../components/Shuffle";
import DecryptedText from "../components/DecryptedText";
import AIChatWidget from "./AiChatWidget";
// import AuroraBackground from "./Aurorabackground";
// import AIInput from "./Aiinput";

interface Props {
  imageSrc?: string;
}

const LandingPage: React.FC<Props> = () => {
  const [isButtonHovered, setIsButtonHovered] = React.useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = React.useState(false);
  // Handle AI input submission
  // const handleAISubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget);
  //   const input = formData.get("ai-query") as string;

  //   if (input.trim()) {
  //     console.log("AI Query:", input);
  //     // TODO: Connect to AI service
  //     (e.target as HTMLFormElement).reset();
  //   }
  // };

  // const handleAISubmit = useCallback((query: string) => {
  //   console.log("AI Query:", query);
  //   // TODO: Connect to AI service
  // }, []);
  return (
    <div className="landing">
      {/* ── Aurora canvas background ─────────────────────────────────────── */}
      {/*
        theme="light"  → multiply composite, blue/violet/rose hues on #f8f6f2
        theme="dark"   → lighter composite, green/teal glow on deep navy
        You can still override backgroundColor and baseHue individually.
      */}
      {/* <AuroraBackground theme="light" /> */}

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

          {/* ── Premium AI Input ─────────────────────────────────────── */}
          {/* <AIInput
            placeholder="Ask anything about me…"
            onSubmit={handleAISubmit}
            maxRows={6}
          /> */}
        </div>

        {/* RIGHT COLUMN — Image (Hidden on mobile, shown on tablet+) */}
        {/* <div className="landing__right"> */}
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
        {/* </div> */}
      </div>
      <div style={{ position: "relative", display: "inline-block" }}>
        {/* Waving Hand Emoji */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.5 }}
          animate={
            isButtonHovered
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
            animate={isButtonHovered ? { rotate: [0, 20, -20, 20, 0] } : {}}
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

        {/* Button */}
        <button
          className="button"
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          onClick={() => setIsWidgetOpen(true)} // [ADD] ← open the widget
          aria-expanded={isWidgetOpen} // [ADD] ← ARIA state
          aria-controls="ai-widget-dialog" // [ADD] ← ARIA linkage
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

      {/* Scroll Indicator */}
      <motion.div
        className="scroll"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        scroll for more
      </motion.div>

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
