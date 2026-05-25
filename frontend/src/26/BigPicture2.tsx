import { useRef, useEffect } from "react";
import "./style/BigPicture2.scss";
import Supabase from "../assets/supabase.png";
import Py from "../assets/pylogo.png";
import GitLogo from "../assets/gitlogo.png";
import NotionLogo from "../assets/notionlogo.png";
import VercelLogo from "../assets/vercellogo.svg";
import RecatLogo from "../assets/reactlogo.png";
import TSLogo from "../assets/tslogo.png";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  wrap,
} from "framer-motion";

export interface VelocityTextItem {
  text?: string;
  accent?: boolean;
  sep?: boolean;
  logo?: string;
  logoAlt?: string;
}

export interface VelocityTextProps {
  items: VelocityTextItem[];
  baseVelocity?: number;
  className?: string;
}

export function VelocityText({
  items,
  baseVelocity = -5,
  className = "",
}: VelocityTextProps) {
  const baseX = useMotionValue(0);

  // Ref to the first (canonical) strip — used to measure its actual rendered width
  const stripRef = useRef<HTMLSpanElement>(null);

  // Store the wrap percentage derived from real layout measurements.
  // Initialised to -25 as a safe fallback before the DOM is ready.
  const wrapPercent = useRef<number>(-25);

  // Measure once on mount and re-measure on every resize so clamp()
  // values in the SCSS are always reflected accurately.
  useEffect(() => {
    const measure = () => {
      const strip = stripRef.current;
      if (!strip) return;

      const stripWidth = strip.offsetWidth;
      const trackWidth = strip.parentElement?.offsetWidth;

      if (!trackWidth || trackWidth === 0) return;

      // Negative because the track scrolls in the negative-x direction.
      wrapPercent.current = -(stripWidth / trackWidth) * 100;
    };

    measure();

    const ro = new ResizeObserver(measure);
    if (stripRef.current) ro.observe(stripRef.current);

    return () => ro.disconnect();
  }, []);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  // Use the measured wrap width instead of a hardcoded -25
  const x = useTransform(baseX, (v) => {
    const wp = wrapPercent.current;
    return `${wrap(wp, 0, v)}%`;
  });

  const directionFactor = useRef<number>(1);

  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  const Strip = () => (
    <>
      {items.map((item, i) => {
        if (item.sep) {
          return (
            <span key={i} className="vt-sep" aria-hidden="true">
              {item.text}
            </span>
          );
        }

        if (item.logo) {
          return (
            <span key={i} className="vt-logo-wrap">
              <img
                src={item.logo}
                alt={item.logoAlt || "brand logo"}
                className="vt-logo"
                draggable={false}
              />
            </span>
          );
        }

        return (
          <span
            key={i}
            className={`vt-word${item.accent ? " vt-word--accent" : ""}`}
          >
            {item.text}
          </span>
        );
      })}
    </>
  );

  return (
    <div className={`vt-row ${className}`}>
      <motion.div
        className="vt-track"
        style={{ x }}
        aria-label={items.map((i) => i.text).join(" ")}
      >
        {/* Canonical strip — measured by stripRef */}
        <span className="vt-strip" ref={stripRef}>
          <Strip />
        </span>

        {/* Three duplicate strips to fill the overflow */}
        {[1, 2, 3].map((n) => (
          <span key={n} className="vt-strip" aria-hidden="true">
            <Strip />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

interface RowDef {
  items: VelocityTextItem[];
  baseVelocity: number;
  sizeClass: string;
}

const ROWS: RowDef[] = [
  {
    items: [
      { text: "Software Engineer", accent: true },
      { text: " . " },
      { text: "Developer" },
      { text: " . " },
      { text: "Designer", accent: true },
      { text: " . " },
      { text: "Teacher" },
      { text: " . " },
      { text: "Learner", accent: true },
      { text: " . " },
    ],
    baseVelocity: -2.8,
    sizeClass: "vt-row--sm",
  },

  {
    items: [
      { text: "Web Development" },
      { text: " . " },
      { text: "Graphic Design", accent: true },
      { text: " . " },
      { text: "UI / UX" },
      { text: " . " },
      { text: "Creative Design" },
      { text: " . " },
      { text: "Open Source", accent: true },
      { text: " . " },
    ],
    baseVelocity: 2.2,
    sizeClass: "vt-row--sm",
  },

  {
    items: [
      { logo: RecatLogo, logoAlt: "React" },
      { logo: TSLogo, logoAlt: "TypeScript" },
      { logo: VercelLogo, logoAlt: "Vercel" },
      { logo: NotionLogo, logoAlt: "Notion" },
      { logo: GitLogo, logoAlt: "Git" },
      { logo: Py, logoAlt: "Python" },
      { logo: Supabase, logoAlt: "Supabase" },
    ],
    baseVelocity: -1.8,
    sizeClass: "vt-row--logos",
  },
];

export default function BigPicture2() {
  return (
    <section className="big-picture-section" aria-label="The Big Picture">
      <div className="bp-rows-wrap">
        {ROWS.map((row, i) => (
          <VelocityText
            key={i}
            items={row.items}
            baseVelocity={row.baseVelocity}
            className={row.sizeClass}
          />
        ))}
      </div>
    </section>
  );
}