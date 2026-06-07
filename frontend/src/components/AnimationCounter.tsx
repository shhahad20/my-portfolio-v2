import { animate, useMotionValue, useInView } from "framer-motion";
import { useEffect, useState, useRef, useMemo } from "react";

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  suffix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  target,
  duration = 2.5,
  suffix = "",
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const [count, setCount] = useState(0);

  // Reserve space equal to the widest possible value (the target + suffix)
  // so the counter never shifts surrounding elements as it counts up.
  const minWidth = useMemo(() => {
    const maxStr = `${target}${suffix}`;
    return `${maxStr.length}ch`;
  }, [target, suffix]);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(motionValue, target, {
      duration,
      // Smooth deceleration: fast start, gentle ease into the final value.
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setCount(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, target, duration, motionValue]);

  return (
    <span
    className="animated-counter"
      ref={ref}
      style={{
        display: "inline-block",
        fontFamily: "monospace",
        fontWeight: "bold",
        minWidth,
        // Tabular nums keeps each digit the same width so the text
        // doesn't wobble horizontally as digits change.
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {count}{suffix}
    </span>
  );
};

export default AnimatedCounter;