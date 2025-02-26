import { animate, useMotionValue, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  suffix?: string;
}

const AnimatedCounter : React.FC<AnimatedCounterProps> = ({ target, duration = 2, suffix = "" }) => {
  // Create a ref to attach to the element you want to observe.
  const ref = useRef(null);
  // Check if the element is in view. 'once: true' ensures the animation only runs once.
  const isInView = useInView(ref, { once: true });
  // Create a motion value that starts at 0.
  const motionValue = useMotionValue(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      // Animate the motion value from 0 to target over the specified duration.
      const controls = animate(motionValue, target, {
        duration: duration,
        onUpdate: (latest) => {
          setCount(Math.round(latest));
        },
      });
      // Clean up the animation on component unmount.
      return () => controls.stop();
    }
  }, [isInView, target, duration, motionValue]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export default AnimatedCounter;
