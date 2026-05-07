import React from "react";
import { motion } from "framer-motion";
import "./style/LandingPage.scss";
import AnimatedLink from "../components/AnimatedLink";

interface Props {
  imageSrc?: string;
}

const SHAHAD = "SHAHAD".split("");
const ALTHARWA = "ALTHARWA".split("");

const letterVariants = (i: number, lineOffset = 0) => ({
  gooHover: {
    y: [0, -14, 0],
    transition: {
      delay: (i + lineOffset) * 0.045,
      duration: 0.5,
      ease: "easeInOut",
    },
  },
});

const LandingPage: React.FC<Props> = ({ imageSrc }) => {
  return (
    <div className="landing">
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

      {/* MAIN */}
      <div className="landing__content">
        {/* LEFT */}
        <div className="landing__left">
          <motion.div
            className="linkedin"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AnimatedLink
              linkText="LINKEDIN ↗"
              hoverText="LINKEDIN ↗"
              href="/"
            />
          </motion.div>

          <motion.h1
            className="title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="title-line">
              {SHAHAD.map((char, i) => (
                <motion.span
                  key={i}
                  className="letter"
                  whileHover={{
                    y: -10,
                    transition: { type: "spring", stiffness: 300, damping: 12 },
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
            <br />
            <span className="title-line">
              {ALTHARWA.map((char, i) => (
                <motion.span
                  key={i}
                  className="letter"
                  variants={letterVariants(i, SHAHAD.length)}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </motion.h1>

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

          {/* AI INPUT */}
          <motion.div
            className="ai-input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover="hover"
          >
            <motion.div
              className="ai-icon"
              transition={{ type: "spring", stiffness: 250 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 15.94 16.51"
                width="20"
                height="20"
              >
                <motion.path
                  fill="#ff005a"
                  d="M1.13,1.71C2.29.59,4.96.44,6.5.57c1.73.15,3.41.63,4.84,1.61.14.09.56.47.66.46.1,0,.89-.61.91-.69.07-.22-.16-.31-.27-.47-.25-.35-.22-.77.2-.96C13.08.4,15.1-.01,15.35,0c.32.02.54.24.59.55-.22.7-.38,1.53-.66,2.21-.1.25-.19.49-.5.54-.51.07-.7-.44-.88-.41-1.36,1.13-2.88,2-4.64,2.37-2.1.45-6.61.41-8.23-1.21-.73-.73-.63-1.64.09-2.34ZM10.61,3.26s-.41-.26-.48-.3c-1.87-1.1-5.66-1.57-7.63-.6-.84.42-.75.74.03,1.13,1.86.93,6,.95,7.87.04.11-.06.3-.11.2-.27Z"
                  variants={{ hover: { scale: [1, 1.2, 1] } }}
                />
                <motion.path
                  fill="#ff005a"
                  d="M12.77,5.05c1.1-.2.96,1.64.79,2.29-1.06,4.12-8.94,4.56-12.12,3.27-1.68-.68-2-2.31-.39-3.3,2.3-1.43,7.49-.97,10.06-.34.2.05.9.32,1.03.27.19-.06.23-.78.22-.96-.01-.24-.12-.48-.07-.73.04-.22.26-.46.48-.5ZM4.35,7.73c-.72.05-2.23.32-2.77.81s.11.76.58.93c1.67.59,4.72.53,6.45.16.91-.2,1.89-.55,2.58-1.19.02-.08-.06-.1-.11-.12-.24-.11-.74-.2-1.01-.26-1.73-.35-3.94-.46-5.71-.34Z"
                  variants={{ hover: { scale: [1, 1.2, 1] } }}
                />
                <motion.path
                  fill="#ff005a"
                  d="M4.49,12.15c2.97-.29,3.24,4.12.41,4.36s-3.22-4.09-.41-4.36Z"
                  variants={{ hover: { scale: [1, 1.2, 1] } }}
                />
                <motion.path
                  fill="#ff005a"
                  d="M14.09,12.63c-1.1,1.21-3.15,2.05-4.73,2.35-.53.1-1.45.32-1.46-.52-.01-.74.87-.67,1.37-.8,1.41-.34,4.34-1.38,4.47-3.11.04-.57-.57-1.12-.07-1.57.58-.52,1.07.09,1.25.63.38,1.13-.06,2.18-.82,3.02Z"
                  variants={{ hover: { scale: [1, 1.2, 1] } }}
                />
              </svg>
            </motion.div>

            <input type="text" placeholder="Ask AI for info.." />

            <motion.span
              className="arrow"
              variants={{ hover: { x: 5 } }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              →
            </motion.span>
          </motion.div>
        </div>

        {/* RIGHT */}
        <div className="landing__right">
          {imageSrc && (
            <motion.img
              src={imageSrc}
              alt="illustration"
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
          </motion.div>
        </div>
      </div>

      <div className="scroll">scroll for more</div>
    </div>
  );
};

export default LandingPage;