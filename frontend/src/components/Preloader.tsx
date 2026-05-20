import React, { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  animate,
} from "framer-motion";
import "../styles/preloader.scss";

interface PreloaderProps {
  onComplete: () => void;
}

const BRAND_LINES = [
  { text: "Exquisite,", delay: 0.2 },
  { text: " as always.", delay: 0.45 },
];

const LOAD_DURATION = 2.8; // seconds

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const progress = useMotionValue(0);
  const scaleX = useTransform(progress, [0, 100], [0, 1]);
  const [count, setCount] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useMotionValueEvent(progress, "change", (v) => setCount(Math.round(v)));

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const controls = animate(progress, 100, {
      duration: LOAD_DURATION,
      ease: [0.16, 1, 0.3, 1],
      onComplete: () => setTimeout(() => setIsExiting(true), 500),
    });

    return () => {
      controls.stop();
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = "";
        onComplete();
      }}
    >
      {!isExiting && (
        <motion.div
          className="preloader"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Brand text — each line slides up from a clipped region */}
          <div
            className="preloader__brand"
            aria-label="Exquisite, as always"
          >
            {BRAND_LINES.map(({ text, delay }) => (
              <span key={text} className="preloader__line-clip">
                <motion.span
                  className="preloader__line"
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    delay,
                    duration: 0.8,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                >
                  {text}
                </motion.span>
              </span>
            ))}
          </div>

          {/* Footer — progress bar + counter */}
          <div className="preloader__footer">
            <div className="preloader__track">
              <motion.div
                className="preloader__fill"
                style={{ scaleX, originX: 0 }}
              />
            </div>
            <motion.span
              className="preloader__count"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              {count}%
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
