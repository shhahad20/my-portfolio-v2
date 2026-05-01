import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "../styles/cards.scss";
// import FlipLink from "./AnimatedHeader ";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CardItem {
  num: string;
  title: string;
  desc: string;
  link: string;
  icon: React.ReactNode;
}

// ─── Icon: Code Lab ───────────────────────────────────────────────────────────
const CodeLabIcon = () => (
  <svg
    viewBox="0 0 52 52"
    width="52"
    height="52"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="4"
      y="10"
      width="44"
      height="32"
      rx="3"
      fill="none"
      stroke="#EFEEEC"
      strokeWidth="1.5"
      opacity="0.15"
    />
    <line
      x1="4"
      y1="18"
      x2="48"
      y2="18"
      stroke="#EFEEEC"
      strokeWidth="1"
      opacity="0.15"
    />
    <circle cx="11" cy="14" r="1.5" fill="#EFEEEC" opacity="0.3" />
    <circle cx="17" cy="14" r="1.5" fill="#EFEEEC" opacity="0.3" />
    <circle cx="23" cy="14" r="1.5" fill="#EFEEEC" opacity="0.3" />
    {/* < brackets */}
    <polyline
      points="16,28 12,32 16,36"
      fill="none"
      stroke="#EFEEEC"
      strokeWidth="1.5"
      strokeLinejoin="round"
      opacity="0.9"
    />
    {/* > brackets */}
    <polyline
      points="22,28 26,32 22,36"
      fill="none"
      stroke="#EFEEEC"
      strokeWidth="1.5"
      strokeLinejoin="round"
      opacity="0.9"
    />
    {/* blinking cursor */}
    <rect
      x="30"
      y="28"
      width="6"
      height="8"
      fill="#EFEEEC"
      className="cursor-blink"
    />
  </svg>
);

// ─── Icon: Branding (palette + brush) ────────────────────────────────────────
const BrandingIcon = () => (
  <svg
    viewBox="0 0 52 52"
    width="52"
    height="52"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g className="palette-group">
      {/* palette body */}
      <ellipse
        cx="27"
        cy="27"
        rx="16"
        ry="13"
        fill="none"
        stroke="#EFEEEC"
        strokeWidth="1.5"
        opacity="0.25"
      />
      {/* thumb hole */}
      <ellipse
        cx="33"
        cy="36"
        rx="4"
        ry="3"
        fill="none"
        stroke="#EFEEEC"
        strokeWidth="1.5"
        opacity="0.25"
      />
      {/* color dots */}
      <circle cx="18" cy="24" r="2.2" fill="#EFEEEC" opacity="0.7" />
      <circle cx="24" cy="19" r="2.2" fill="#EFEEEC" opacity="0.45" />
      <circle cx="31" cy="19" r="2.2" fill="#EFEEEC" opacity="0.25" />
      <circle cx="36" cy="24" r="2.2" fill="#EFEEEC" opacity="0.55" />
    </g>
    {/* paintbrush */}
    <line
      x1="10"
      y1="10"
      x2="22"
      y2="22"
      stroke="#EFEEEC"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.8"
    />
    <ellipse
      cx="23.5"
      cy="23.5"
      rx="2.5"
      ry="1.5"
      transform="rotate(-45 23.5 23.5)"
      fill="#EFEEEC"
      opacity="0.9"
    />
    <circle cx="9.5" cy="9.5" r="1.5" fill="#EFEEEC" opacity="0.4" />
    {/* animated brush stroke */}
    <path
      d="M 14 42 Q 26 38 36 43"
      fill="none"
      stroke="#EFEEEC"
      strokeWidth="2"
      strokeLinecap="round"
      className="brush-stroke"
      opacity="0.6"
    />
  </svg>
);

// ─── Icon: UI System ──────────────────────────────────────────────────────────
const UISystemIcon = () => (
  <svg
    viewBox="0 0 52 52"
    width="52"
    height="52"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* connector lines */}
    <line
      x1="26"
      y1="14"
      x2="26"
      y2="38"
      stroke="#EFEEEC"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.12"
    />
    <line
      x1="14"
      y1="26"
      x2="38"
      y2="26"
      stroke="#EFEEEC"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.12"
    />
    {/* 4 cells */}
    <rect
      x="8"
      y="8"
      width="16"
      height="16"
      rx="2"
      fill="none"
      stroke="#EFEEEC"
      strokeWidth="1.5"
      className="cell-1"
    />
    <rect
      x="28"
      y="8"
      width="16"
      height="16"
      rx="2"
      fill="none"
      stroke="#EFEEEC"
      strokeWidth="1.5"
      className="cell-2"
    />
    <rect
      x="8"
      y="28"
      width="16"
      height="16"
      rx="2"
      fill="none"
      stroke="#EFEEEC"
      strokeWidth="1.5"
      className="cell-3"
    />
    <rect
      x="28"
      y="28"
      width="16"
      height="16"
      rx="2"
      fill="none"
      stroke="#EFEEEC"
      strokeWidth="1.5"
      className="cell-4"
    />
    {/* inner mini rects */}
    <rect
      x="11"
      y="11"
      width="10"
      height="3"
      rx="1"
      fill="#EFEEEC"
      opacity="0.15"
    />
    <rect
      x="31"
      y="11"
      width="10"
      height="3"
      rx="1"
      fill="#EFEEEC"
      opacity="0.15"
    />
    <rect
      x="11"
      y="31"
      width="10"
      height="3"
      rx="1"
      fill="#EFEEEC"
      opacity="0.15"
    />
    <rect
      x="31"
      y="31"
      width="10"
      height="3"
      rx="1"
      fill="#EFEEEC"
      opacity="0.15"
    />
  </svg>
);

// ─── Card data ────────────────────────────────────────────────────────────────
const CARDS: CardItem[] = [
  {
    num: "01",
    title: "Code Lab",
    desc: "Experiments, repositories, and open-source work. Where ideas get compiled and shipped.",
    link: "https://github.com/shhahad20?tab=repositories",
    icon: <CodeLabIcon />,
  },
  {
    num: "02",
    title: "Branding",
    desc: "Graphic design, visual identity, and brand systems. Translating ideas into visual language.",
    link: "https://www.behance.net/shhahad20",
    icon: <BrandingIcon />,
  },
  {
    num: "03",
    title: "UI System",
    desc: "Reusable components, design tokens, and scalable interfaces built for consistency.",
    link: "/components",
    icon: <UISystemIcon />,
  },
];

// ─── Individual card ──────────────────────────────────────────────────────────
const BusyCard = ({ card, index }: { card: CardItem; index: number }) => {
  // const [hovered, setHovered] = useState(false);
  const isExternal = card.link.startsWith("http");

  return (
    <motion.a
      href={card.link}
      target={isExternal ? "_blank" : "_self"}
      rel={isExternal ? "noreferrer" : undefined}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      viewport={{ once: true, amount: 0.15 }}
      // onHoverStart={() => setHovered(true)}
      // onHoverEnd={() => setHovered(false)}
      className="busy-card"
    >
      {/* icon */}
      <div style={{ width: 52, height: 52, marginBottom: 32 }}>{card.icon}</div>

      {/* number */}
      <p
        style={{
          // fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          color: "#818180",
          letterSpacing: "0.2em",
          marginBottom: 12,
        }}
      >
        {card.num}
      </p>

      {/* title */}
      <h3
        style={{
          fontSize: 22,
          fontWeight: 500,
          color: "#EFEEEC",
          letterSpacing: "-0.02em",
          marginBottom: 14,
          lineHeight: 1.1,
        }}
      >
        {card.title}
      </h3>

      {/* description */}
      <p
        style={{
          fontSize: 12,
          color: "#555",
          lineHeight: 1.7,
          letterSpacing: "0.02em",
          flex: 1,
          marginBottom: 32,
          fontFamily: "'Syne', sans-serif",
        }}
      >
        {card.desc}
      </p>

      {/* CTA */}
      <div
        className="cta"
      >
        View work{" "}
        <span
          style={{
            display: "inline-block",
            // transform: hovered ? "translateX(4px)" : "translateX(0)",
            transition: "transform 0.3s ease",
          }}
        >
          →
        </span>
      </div>

      {/* bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 32,
          right: 32,
          height: 1,
          // background: hovered ? "#EFEEEC" : "transparent",
          transition: "background 0.3s",
        }}
      />
    </motion.a>
  );
};

// ─── Main export ──────────────────────────────────────────────────────────────
const Cards = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth <= 560;
  const isTablet = windowWidth <= 900;

  const gridCols = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)";
  const sectionPadding = isMobile
    ? "40px 20px 56px"
    : isTablet
      ? "48px 32px 64px"
      : "64px 48px 80px";

  return (
    <div
      style={{
        padding: sectionPadding,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1200 }}>
        {/* ── Header ── */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#555",
              marginBottom: 16,
            }}
          >
            Areas of work
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 5vw, 64px)",
              fontWeight: 800,
              color: "#EFEEEC",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              marginBottom: 56,
            }}
          >
            What keeps <span style={{ color: "#333" }}>me</span> busy
          </h2>
        </motion.div> */}

        <motion.div
          className="header-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
        <div className="between-lines">
          <div>
            <h1 className="about-me-header">Areas of work</h1>
          </div>
        </div>
        <h1 className="second-header">
          What Keeps Me Busy
        </h1>
        </motion.div>

        {/* ── Cards grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: gridCols,
            gap: 0,
            // background: "#1c1c1c",
            // border: "1px solid #1c1c1c",
          }}
        >
          {CARDS.map((card, i) => (
            <BusyCard key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cards;
