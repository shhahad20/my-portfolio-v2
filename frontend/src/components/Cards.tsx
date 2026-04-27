// import GradientCard from "./Card";
// import { motion } from 'framer-motion';

// import "../styles/cards.scss";
// import FlipLink from "./AnimatedHeader ";
// import { useEffect, useState } from "react";

// const greenishTheme = {
//   backgroundColor: "rgb(211, 211, 84)", // Original dark background
//   borderColor: "1px solid #D3D354",
//   starColor: "rgba(211, 211, 84, 0.7)",
//   headerColor: "#D3D354",
// };

// const pinkishTheme = {
//   backgroundColor: "#D96570", // Light pink background
//   textBackground: "rgba(217, 101, 113, 0.4)",
//   borderColor: "1px solid #D96570",
//   starColor: "rgba(255, 154, 205, 0.56)",
//   headerColor: "#D96570",
//   lightColorHeader: "#F9BDC3",
// };
// const bluishTheme = {
//   backgroundColor: "#5489D6", // Light pink background
//   textBackground: "rgba(84, 137, 214, 0.4)",
//   borderColor: "1px solid #369EFF",
//   starColor: "rgba(84, 137, 214, 0.56)",
//   headerColor: "#369EFF",
//   lightColorHeader: "#D8ECF8",
// };

// const metalTheme = {
//   backgroundColor: "#EFEEEC",
//   textBackground: "rgba(192,192,192, 0.4)",
//   borderColor: "1px solid #a9a9a9",
//   starColor: "rgba(255, 255, 255, 0.8)",
//   headerColor: "#d3d3d3",
//   lightColorHeader: "#f5f5f5",
// };
// const Cards = () => {
//     const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
//     useEffect(() => {
//       const handleResize = () => {
//         setIsMobile(window.innerWidth <= 768);
//       };
  
//       window.addEventListener("resize", handleResize);
//       return () => window.removeEventListener("resize", handleResize);
//     }, []);

//   return (
//     <div className="cards-container">
//       <motion.div
//         className="header-content"
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         viewport={{ once: true, amount: 0.2 }}
//       >
//         <div className="between-lines">
//           <div>
//             <h1 className="section-header">Discover. Innovate. Inspire.</h1>
//           </div>
//         </div>
//         {isMobile ? (
//           <h2 className="mobile-header">The Dashboard</h2>
//         ) : (
//           <div className="flip">
//           <FlipLink href="#">The</FlipLink>
//           <FlipLink href="#">Dashboard</FlipLink>
//           </div>
//         )}
//       </motion.div>

//       <div className="top-cards">
//         <GradientCard
//           title="Components"
//           label="Explore our UI components library"
//           onClick={() => console.log("Components card clicked")}
//           theme={bluishTheme}
//           image="/compIcon.svg"
//           link="/components"
//         />
//         <GradientCard
//           title="Repositories"
//           label="Discover our code repositories"
//           onClick={() => console.log("Repositories card clicked")}
//           theme={pinkishTheme}
//           // image=""
//           link="https://github.com/shhahad20?tab=repositories"
//         />
//       </div>
//       <div className="bottom-cards">
//         <GradientCard
//           title="Social Media News"
//           label="Catch the Latest News"
//           onClick={() => console.log("Social Media News card clicked")}
//           theme={greenishTheme}
//           // image=""
//           link="https://www.linkedin.com/in/shahadaltharwa/"
//         />
//         <GradientCard
//           title="Projects"
//           label="Boldest Projects and Future Ventures"
//           onClick={() => console.log("Projects card clicked")}
//           theme={metalTheme}
//           image="/projectImage.svg"
//           link="/projects"
//         />
//       </div>

//     </div>
//   );
// };

// export default Cards;

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import FlipLink from "./AnimatedHeader ";
import "../styles/cards.scss";

interface FolderItem {
  title: string;
  label: string;
  link: string;
  color: string;
  files: string[];
  x: number;      // % from left
  y: number;      // % from top
  w: number;      // px width
  rotate: number; // static tilt in deg — no animation
}

const FOLDERS: FolderItem[] = [
  // {
  //   title: "Components",
  //   label: "Explore our UI components library",
  //   link: "/components",
  //   color: "#EFEEEC",
  //   files: ["Button.tsx", "Modal.tsx", "Card.tsx", "Input.tsx"],
  //   x: 20, y: 40, w: 120, rotate: -15,
  // },
  {
    title: "Repositories",
    label: "Discover our code repositories",
    link: "https://github.com/shhahad20?tab=repositories",
    color: "#EFEEEC",
    files: ["cloud-app", "design-sys", "api-server", "cli-tool"],
    x: 34, y: 20, w: 165, rotate: 7,
  },
  {
    title: "Projects",
    label: "Boldest Projects and Future Ventures",
    link: "/projects",
    color: "#EFEEEC",
    files: ["Portfolio v3", "SaaS MVP", "Open Source", "Experiments"],
    x: 65, y: 25, w: 98, rotate: 11,
  },
  {
    title: "Social Media",
    label: "Catch the Latest News",
    link: "https://www.linkedin.com/in/shahadaltharwa/",
    color: "#EFEEEC",
    files: ["LinkedIn", "Articles", "Updates", "Mentions"],
    x: 30, y: 54, w: 112, rotate: 9,
  },
  {
    title: "Components",
    label: "Explore our UI components library",
    link: "/components",
    color: "#EFEEEC",
    files: ["Button.tsx", "Modal.tsx", "Card.tsx", "Input.tsx"],
    x: 50, y: 76, w: 140, rotate: -7,
  },
  {
    title: "Repositories",
    label: "Discover our code repositories",
    link: "https://github.com/shhahad20?tab=repositories",
    color: "#EFEEEC",
    files: ["cloud-app", "design-sys", "api-server", "cli-tool"],
    x: 67, y: 56, w: 135, rotate: 5,
  },
  {
    title: "Projects",
    label: "Boldest Projects and Future Ventures",
    link: "/projects",
    color: "#EFEEEC",
    files: ["Portfolio v3", "SaaS MVP", "Open Source", "Experiments"],
    x: 26, y: 72, w: 115, rotate: -11,
  },
];

// ─── Folder SVG: exact shape from the reference image ───────────────────────
// Small tab sits flush at top-left of a plain rectangle. Pure outline, no fill.
const FolderSVG = ({ color, w }: { color: string; w: number }) => {
  const bodyH = w * 0.74;
  const tabW  = w * 0.30;
  const tabH  = w * 0.09;
  const r     = w * 0.06;   // corner radius

  return (
    <svg
      viewBox={`0 0 ${w} ${bodyH + tabH}`}
      width={w}
      height={bodyH + tabH}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", overflow: "visible" }}
    >
      {/* Tab — small rounded-top rectangle, top-left */}
      <path
        d={`
          M ${r} 0
          L ${tabW - r} 0
          Q ${tabW} 0 ${tabW} ${r}
          L ${tabW} ${tabH}
          L 0 ${tabH}
          L 0 ${r}
          Q 0 0 ${r} 0 Z
        `}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Body — full width, merges with tab on top-left */}
      <path
        d={`
          M 0 ${tabH}
          L ${w - r} ${tabH}
          Q ${w} ${tabH} ${w} ${tabH + r}
          L ${w} ${bodyH + tabH - r}
          Q ${w} ${bodyH + tabH} ${w - r} ${bodyH + tabH}
          L ${r} ${bodyH + tabH}
          Q 0 ${bodyH + tabH} 0 ${bodyH + tabH - r}
          L 0 ${tabH} Z
        `}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ─── Individual folder — static tilt, hover zooms toward viewer ──────────────
const Folder = ({
  folder,
  index,
  onExpand,
}: {
  folder: FolderItem;
  index: number;
  onExpand: (i: number) => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const totalH = folder.w * 0.74 + folder.w * 0.09;

  return (
    <motion.div
      style={{
        position: "absolute",
        left: `${folder.x}%`,
        top: `${folder.y}%`,
        width: folder.w,
        height: totalH,
        cursor: "pointer",
        transformStyle: "preserve-3d",
        rotate: folder.rotate, // static tilt, not animated
      }}
      whileHover={{
        scale: 1.25,
        z: 130,
        rotate: 0,
        transition: { duration: 0.38, ease: [0.23, 1, 0.32, 1] },
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onExpand(index)}
    >
      {/* Glow behind folder on hover */}
      <motion.div
        style={{
          position: "absolute",
          inset: -18,
          borderRadius: 10,
          background: `radial-gradient(ellipse at center, ${folder.color}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      />

      <FolderSVG color={folder.color} w={folder.w} />

      {/* Name label — fades in on hover */}
      <motion.div
        style={{
          position: "absolute",
          bottom: -28,
          left: "50%",
          translateX: "-50%",
          fontSize: 10,
          fontFamily: "'Syne', sans-serif",
          fontWeight: 600,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          color: folder.color,
          pointerEvents: "none",
        }}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 5 }}
        transition={{ duration: 0.2 }}
      >
        {folder.title}
      </motion.div>
    </motion.div>
  );
};

// ─── Full-page expanded view ─────────────────────────────────────────────────
const ExpandedFolder = ({
  folder,
  onClose,
}: {
  folder: FolderItem;
  onClose: () => void;
}) => {
  const isExternal = folder.link.startsWith("http");

  return (
    <motion.div
      key="expanded"
      initial={{ opacity: 0, scale: 0.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.05 }}
      transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "#080808",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Syne', sans-serif",
      }}
      onClick={onClose}
    >
      {/* Ghost folder watermark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.045 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{ position: "absolute", pointerEvents: "none" }}
      >
        <FolderSVG color={folder.color} w={480} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.46 }}
        style={{ textAlign: "center", position: "relative" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.26em",
            color: folder.color,
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          {folder.label}
        </div>

        <h2
          style={{
            fontSize: "clamp(28px, 5.5vw, 76px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#fff",
            lineHeight: 1,
            marginBottom: 36,
          }}
        >
          {folder.title}
        </h2>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 44,
          }}
        >
          {folder.files.map((f) => (
            <div
              key={f}
              style={{
                padding: "8px 18px",
                border: `1px solid ${folder.color}38`,
                borderRadius: 3,
                fontSize: 11,
                letterSpacing: "0.1em",
                color: `${folder.color}bb`,
                background: `${folder.color}0b`,
              }}
            >
              {f}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <a
            href={folder.link}
            target={isExternal ? "_blank" : "_self"}
            rel={isExternal ? "noreferrer" : undefined}
            style={{
              padding: "12px 34px",
              background: folder.color,
              color: "#080808",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: 2,
            }}
          >
            Open →
          </a>
          <button
            onClick={onClose}
            style={{
              padding: "12px 34px",
              border: "1px solid rgba(255,255,255,0.18)",
              background: "transparent",
              color: "rgba(255,255,255,0.5)",
              fontFamily: "'Syne', sans-serif",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: 2,
            }}
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main export ─────────────────────────────────────────────────────────────
const Cards = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = expandedIndex !== null ? "hidden" : "";
  }, [expandedIndex]);

  return (
    <div
      className="cards-container"
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#080808",
        perspective: "1000px",
        overflow: "hidden",
      }}
    >
      {/* ── Header (unchanged) ── */}
      <motion.div
        className="header-content"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ position: "relative", zIndex: 10 }}
      >
        <div className="between-lines">
          <div>
            <h1 className="section-header">Discover. Innovate. Inspire.</h1>
          </div>
        </div>
        {isMobile ? (
          <h2 className="mobile-header">The Dashboard</h2>
        ) : (
          <div className="flip">
            <FlipLink href="#">The</FlipLink>
            <FlipLink href="#">Dashboard</FlipLink>
          </div>
        )}
      </motion.div>

      {/* ── Scattered folders — static, no drift ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          pointerEvents: expandedIndex !== null ? "none" : "all",
        }}
      >
        {FOLDERS.map((folder, i) => (
          <Folder
            key={`${folder.title}-${i}`}
            folder={folder}
            index={i}
            onExpand={setExpandedIndex}
          />
        ))}
      </div>

      {/* ── Expanded overlay ── */}
      <AnimatePresence>
        {expandedIndex !== null && (
          <ExpandedFolder
            folder={FOLDERS[expandedIndex]}
            onClose={() => setExpandedIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cards;