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
    category: "Development",
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
  isMobile: boolean;
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
  isMobile,
}: GlassCardProps) {
  const ep = easeInOutCubic(Math.max(0, Math.min(1, scrollP)));

  // Staggered entrance window per card
  const windowStart = index * 0.15;
  const windowEnd = windowStart + 0.65;
  const rawEnter = Math.max(
    0,
    Math.min(1, (enterP - windowStart) / (windowEnd - windowStart)),
  );
  const eEnter = easeOutExpo(rawEnter);
  // ─── Single Card (mobile branch) ─────────────────────────────────────────────
  if (isMobile) {
  const cardHeight = 295;
  const gap = 14;

  // Nearly stacked at the start
  const stackedMargin = -(cardHeight - 24);

  // Final state should be only a real visual gap
  const spreadMargin = gap;

  const stackSc = 1 - index * 0.025;
  const sc = stackSc + (1 - stackSc) * ep;

  const marginTop =
    index === 0
      ? 0
      : stackedMargin + (spreadMargin - stackedMargin) * ep;

  const entranceY = 60 * (1 - eEnter);
  const entranceOp = Math.min(1, rawEnter * 1.8);

  const finalY = entranceY + (isHovered ? -10 : 0);
  const finalSc = sc * eEnter * (isHovered ? 1.03 : 1);
  const finalOp =
    entranceOp *
    (index === 0 ? 1 : Math.max(entranceOp, Math.min(1, ep * 2.2)));

  return (
    <div
      className="card card--vertical"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        marginTop: index === 0 ? 0 : marginTop,
        transform: `translateY(${finalY}px) scale(${finalSc})`,
        opacity: finalOp,
        zIndex: isHovered ? 100 : total - index,
      }}
    >
      <CardInner card={card} />
    </div>
  );
}

  // ── HORIZONTAL 3D layout (desktop) ─────────────────────────────────────────
  const entranceZ = -1800 * (1 - eEnter);
  const entranceY = -40 * (1 - eEnter);
  const entranceScale = 0.3 + eEnter * 0.75;
  const entranceOp = Math.min(1, rawEnter * 1.8);
  const entranceX = 80 * (1 - eEnter);

  const depthOffset = index * 60;
  const perspectiveShift = index * 60;
  const stackX = perspectiveShift;
  const stackZ = -depthOffset;
  const stackY = index * 7;
  const stackSc = 1 - index * 0.036;

  const baseRY = -18;
  const spreadRY = 0;
  const ry = baseRY + (spreadRY - baseRY) * ep;

  const cardWidth = 280;
  const gap = 80;

  const spreadSpacing = cardWidth + gap;
  const centerOffset = ((total - 1) / 2) * spreadSpacing;
  const targetX = index * spreadSpacing - centerOffset;

  const x = stackX + (targetX - stackX) * ep;
  const z = stackZ + (0 - stackZ) * ep;
  const y = stackY + (0 - stackY) * ep;
  const sc = stackSc + (1 - stackSc) * ep;

  const finalX = x + entranceX;
  const finalY = y + entranceY + (isHovered ? -14 : 0);
  const finalZ = entranceZ + z;
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
      <CardInner card={card} />
    </div>
  );
}

// ─── Shared card inner markup ─────────────────────────────────────────────────
function CardInner({ card }: { card: (typeof CARDS)[0] }) {
  return (
    <>
      <div className="card__content">
        <div className="card__header">
          <span className="card__category">{card.category}</span>
        </div>
        <h2 className="card__title">{card.title}</h2>
        <p className="card__place">{card.place}</p>
        <div className="card__divider" style={{ background: card.accent }} />
        <p className="card__description">{card.desc}</p>
      </div>
      <div className="card__footer">
        <span className="card__tag">{card.tag}</span>
      </div>
    </>
  );
}

// ─── Reusable hook ────────────────────────────────────────────────────────────
export function useBreakpoint(maxWidth: number): boolean {
  const [matches, setMatches] = useState(false); // safe SSR default

  useEffect(() => {
    const check = () => setMatches(window.innerWidth < maxWidth);
    check(); // sync on mount
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, [maxWidth]);

  return matches;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ExperienceCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollP, setScrollP] = useState(0);
  const [enterP, setEnterP] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

   // Fully independent — different breakpoints, different concerns
  const isMobile       = useBreakpoint(1490); // card layout: vertical vs 3D
  const isMobileHeader = useBreakpoint(769);  // header: subtitle vs FlipLink

  const smoothScroll = useRef(0);
  const smoothEnter = useRef(0);
  const targetScroll = useRef(0);
  const targetEnter = useRef(0);
  const rafRef = useRef<number | null>(null);

  // ── IntersectionObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasEntered) {
          setHasEntered(true);
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
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const ep = easeInOutCubic(Math.max(0, Math.min(1, scrollP)));

  // Mobile: taller section to give vertical spread enough scroll room
  const sectionHeight = isMobile ? "500vh" : "260vh";

  return (
    <>
      <div className="progress-bar" style={{ width: `${scrollP * 100}%` }} />

      <div
        className="experience-section"
        ref={containerRef}
        style={{ height: sectionHeight }}
      >
        <div className="experience-sticky">
          {/* Ambient blobs */}
          <div className="experience-bg">
            {[
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
            ].map((b, i) => (
              <div
                className="experience-blob"
                key={i}
                style={{
                  width: b.w,
                  height: b.h,
                  background: b.c,
                  top: b.top,
                  left: b.left,
                  transform: `translate(-50%,-50%) translateX(${ep * (i % 2 === 0 ? 28 : -28)}px)`,
                }}
              />
            ))}
          </div>
<div className="experience-center">
          {/* ── Header ── */}
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
            {isMobileHeader ? (
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

          {/* ── 3D / Vertical stage ── */}
          <div
            className={`experience-stage ${isMobile ? "experience-stage--vertical" : ""}`}
            style={
              !isMobile
                ? {
                    perspective: `${1100 - ep * 350}px`,
                    perspectiveOrigin: `50% ${55 - ep * 15}%`,
                  }
                : undefined
            }
          >
            
            <div
              className={`experience-cards ${isMobile ? "experience-cards--vertical" : ""}`}
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
                  isMobile={isMobile}
                />
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}
