import { animate, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

const AnimatedCounter = ({ target, duration = 2, suffix = "" }) => {
  // Create a motion value that starts at 0
  const motionValue = useMotionValue(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Animate the motion value from 0 to target over the specified duration
    const controls = animate(motionValue, target, {
      duration: duration,
      onUpdate: (latest) => {
        // Round the value and update local state
        setCount(Math.round(latest));
      },
    });

    // Clean up the animation when the component unmounts
    return () => controls.stop();
  }, [target, duration, motionValue]);

  return <span>{count}{suffix}</span>;
};

export default AnimatedCounter;
