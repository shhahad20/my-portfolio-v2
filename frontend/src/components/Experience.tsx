import { useEffect, useRef, useState } from "react";
import FlipLink from "./AnimatedHeader ";
import { motion } from "framer-motion";
import "../styles/experience.scss";
const CARDS = [
  {
    id: 0,
    tag: "2025 – Present",
    category: "Development",
    title: "Web Developer",
    place: "Freelance · Remote",
    desc: "Building full-stack web applications and client-facing products using React, Supabase, and modern JS ecosystems.",
    accent: "#F17625",
    bg: "#0b0b0b",
  },
  {
    id: 1,
    tag: "2024 – 2025",
    category: "Education",
    title: "Teaching Assistant",
    place: "University of Hail",
    desc: "Mentored 180+ students, prepared course materials, and provided constructive feedback on programming assignments.",
    accent: "#98c0ef",
    bg: "#0b0b0b",
  },
  {
    id: 2,
    tag: "2018 – 2024",
    category: "Design",
    title: "Graphic Designer",
    place: "Freelance · Remote",
    desc: "Delivered 250+ projects across 95+ clients — logos, brand identities, magazines, and social media.",
    accent: "#F17625",
    bg: "#0b0b0b",
  },
  {
    id: 3,
    tag: "2021 – 2023",
    category: "Government",
    title: "Technology Ambassador",
    place: "MCIT · Saudi Arabia",
    desc: "Designed responsive interfaces, explored blockchain technology, and completed Python & data science certifications.",
    accent: "#98c0ef",
    bg: "#0b0b0b",
  },
];

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

// ─── Single Card ─────────────────────────────────────────────────────────────
interface GlassCardProps {
  card: (typeof CARDS)[0];
  scrollP: number;
  enterP: number;
  index: number;
  total: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function GlassCard({
  card,
  scrollP,
  enterP,
  index,
  total,
  isHovered,
  onHover,
  onLeave,
}: GlassCardProps) {
  const ep = easeInOutCubic(Math.max(0, Math.min(1, scrollP)));

  // Each card has a staggered entrance window
  // Card 0 enters first (enterP 0→0.55), card 3 enters last (enterP 0.45→1)
  const windowStart = index * 0.15;
  const windowEnd = windowStart + 0.65;
  const rawEnter = Math.max(
    0,
    Math.min(1, (enterP - windowStart) / (windowEnd - windowStart)),
  );
  const eEnter = easeOutExpo(rawEnter);

  // ── Entrance: from very deep Z, slightly above center, tiny scale
  const entranceZ = -1800 * (1 - eEnter);

  const entranceY = -40 * (1 - eEnter);
  const entranceScale = 0.3 + eEnter * 0.75;
  const entranceOp = Math.min(1, rawEnter * 1.8);

  const entranceX = 80 * (1 - eEnter); // slide from side

  const depthOffset = index * 60; // tighter stacking
  const perspectiveShift = index * 60; // horizontal skew

  const stackX = perspectiveShift;
  const stackZ = -depthOffset;

  // ── Stack state
  const stackY = index * 7;
  const stackSc = 1 - index * 0.036;
  const baseRY = -18; // main viewing angle

  // const spreadRY = -8; // slightly flatter when spread
  const spreadRY = 0; // perfectly front-facing at full spread

  const ry = baseRY + (spreadRY - baseRY) * ep;
  // ── Spread state
  // const spreadSpacing = 360;
  const cardWidth = 280;
  const gap = 80; // visible gap between cards
  const spreadSpacing = cardWidth + gap;

  const centerOffset = ((total - 1) / 2) * spreadSpacing;
  const targetX = index * spreadSpacing - centerOffset;

  // Interpolate stack → spread
  const x = stackX + (targetX - stackX) * ep;
  const z = stackZ + (0 - stackZ) * ep;
  const y = stackY + (0 - stackY) * ep;
  // const ry = stackRY + (0 - stackRY) * ep;
  const sc = stackSc + (1 - stackSc) * ep;

  // ── Compose final transform
  // Before entry: deep Z. After entry: normal stack/spread position.

  const finalX = x + entranceX;
  const finalY = y + entranceY + (isHovered ? -14 : 0);
  const finalZ = entranceZ + z;

  // const depthScale = 1 - index * 0.05;
  // const finalSc = entranceScale * sc * depthScale * (isHovered ? 1.04 : 1);
  const depthScale = 1 - index * 0.05 * (1 - ep);
  const finalSc = entranceScale * sc * depthScale * (isHovered ? 1.04 : 1);

  const finalOp =
    entranceOp *
    (index === 0 ? 1 : Math.max(entranceOp, Math.min(1, ep * 2.2)));

return (
  <div
    className="card"
    onMouseEnter={onHover}
    onMouseLeave={onLeave}
    style={{
      transform: `
        translateX(${finalX}px)
        translateY(${finalY}px)
        translateZ(${finalZ}px)
        rotateY(${ry}deg)
        scale(${finalSc})
      `,
      opacity: finalOp,
      zIndex: isHovered ? 100 : total - index,
    }}
  >
    <div className="card__content">
      
      <div className="card__header">
        <span className="card__category">
          {card.category}
        </span>
      </div>

      <h2 className="card__title">
        {card.title}
      </h2>

      <p className="card__place">
        {card.place}
      </p>

      <div
        className="card__divider"
        style={{ background: card.accent }}
      />

      <p className="card__description">
        {card.desc}
      </p>
    </div>

    <div className="card__footer">
      <span className="card__tag">
        {card.tag}
      </span>
    </div>
  </div>
);
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ExperienceCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollP, setScrollP] = useState(0);
  const [enterP, setEnterP] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const smoothScroll = useRef(0);
  const smoothEnter = useRef(0);
  const targetScroll = useRef(0);
  const targetEnter = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── IntersectionObserver: triggers entrance when section enters viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasEntered) {
          setHasEntered(true);
          // Drive targetEnter from 0→1 over ~1100ms
          const start = performance.now();
          const duration = 1100;
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            targetEnter.current = t;
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasEntered]);

  // ── Scroll listener
  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      targetScroll.current = Math.max(0, Math.min(1, -rect.top / total));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Unified spring RAF
  useEffect(() => {
    const loop = () => {
      smoothScroll.current +=
        (targetScroll.current - smoothScroll.current) * 0.082;
      smoothEnter.current +=
        (targetEnter.current - smoothEnter.current) * 0.072;
      setScrollP(smoothScroll.current);
      setEnterP(smoothEnter.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const ep = easeInOutCubic(Math.max(0, Math.min(1, scrollP)));
  const spreadLabelOpacity = Math.max(0, ep * 2.2 - 0.7);
  const scrollHintOpacity = Math.max(0, 1 - ep * 6) * Math.min(1, enterP * 2.5);

  return (
    <>
      <div className="progress-bar" style={{ width: `${scrollP * 100}%` }} />

      {/* ── Scroll container ── */}
      <div
      className="experience-section"
        ref={containerRef}
      >
        <div
        className="experience-sticky"
        >
          {/* Ambient blobs */}
          <div
          className="experience-bg"
          >
            {[
              // { w: 480, h: 480, top: "8%",  left: "18%", c: "rgba(152, 192, 239, 0.12)" },
              {
                w: 380,
                h: 380,
                top: "52%",
                left: "58%",
                c: "rgba(241, 119, 37, 0.03)",
              },
              {
                w: 320,
                h: 320,
                top: "28%",
                left: "68%",
                c: "rgba(152, 192, 239, 0.1)",
              },
              // {
              //   w: 280,
              //   h: 280,
              //   top: "68%",
              //   left: "8%",
              //   c: "rgba(241, 118, 37, 0.09)",
              // },
            ].map((b, i) => (
              <div
              className="experience-blob"
                key={i}
                style={{
                  position: "absolute",
                  width: b.w,
                  height: b.h,
                  borderRadius: "50%",
                  background: b.c,
                  top: b.top,
                  left: b.left,
                  filter: "blur(65px)",
                  transform: `translate(-50%,-50%) translateX(${ep * (i % 2 === 0 ? 28 : -28)}px)`,
                }}
              />
            ))}
          </div>

          <div className="experience-hero">
            <motion.div
              className="experience-header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="experience-header__top">
                <div>
                  <h1 className="experience-header__title">Work Experience</h1>
                </div>
              </div>
              {isMobile ? (
                <h2 className="experience-header__subtitle">Career Highlights</h2>
              ) : (
                <div className="experience-header__flip">
                  <FlipLink href="#">Career</FlipLink>
                  <FlipLink href="#">Highlights</FlipLink>
                </div>
              )}
              <p className="experience-header__quote">
                "Success is the sum of small efforts, repeated day in and day
                out." – Robert Collier
              </p>
            </motion.div>
          </div>

          {/* 3D stage */}
          <div
          className="experience-stage"
            style={{
              perspective: `${isMobile ? 800 : 1100 - ep * 350}px`,
              perspectiveOrigin: `50% ${55 - ep * 15}%`,
            }}
          >
            <div
            className="experience-cards"
            >
              {CARDS.map((card, i) => (
                <GlassCard
                  key={card.id}
                  card={card}
                  scrollP={scrollP}
                  enterP={enterP}
                  index={i}
                  total={CARDS.length}
                  isHovered={hoveredCard === i}
                  onHover={() => setHoveredCard(i)}
                  onLeave={() => setHoveredCard(null)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
