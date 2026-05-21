import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  animateOn?: "scroll" | "load" | "hover";
  triggerOnce?: boolean;
  shouldAnimate?: boolean;
}

const CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/abcdefghijklmnopqrstuvwxyz0123456789";

const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 0.05,
  animateOn = "load",
  triggerOnce = true,
  shouldAnimate,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(
    animateOn === "load" || shouldAnimate === true
  );

  // Generate random character from charset
  const getRandomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

  // Handle animation trigger on hover
  const handleMouseEnter = () => {
    if (animateOn === "hover") {
      setIsAnimating(true);
    }
  };

  useEffect(() => {
    if (shouldAnimate !== undefined) {
      setIsAnimating(shouldAnimate);
    }
  }, [shouldAnimate]);

  useEffect(() => {
    if (!isAnimating) return;

    let animationFrameId: NodeJS.Timeout;
    let currentIndex = 0;

    const animate = () => {
      if (currentIndex <= text.length) {
        const decrypted = text.slice(0, currentIndex);
        const encrypted = text
          .slice(currentIndex)
          .split("")
          .map(() => getRandomChar())
          .join("");

        setDisplayText(decrypted + encrypted);
        currentIndex += 1;

        animationFrameId = setTimeout(
          () => animate(),
          speed * 1000
        );
      } else {
        setDisplayText(text);
        if (triggerOnce) {
          setIsAnimating(false);
        }
      }
    };

    animate();

    return () => clearTimeout(animationFrameId);
  }, [isAnimating, text, speed, triggerOnce]);

  return (
    <motion.span
      onMouseEnter={handleMouseEnter}
      style={{
        fontVariantNumeric: "tabular-nums",
        fontFamily: "monospace",
        display: "inline-block",
      }}
    >
      {displayText}
    </motion.span>
  );
};

export default DecryptedText;
