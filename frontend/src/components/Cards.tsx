// import {
//   motion,
//   useScroll,
//   useTransform,
//   useSpring,
//   type MotionValue,
// } from "framer-motion";
// import { useRef } from "react";
// import "../styles/cards.scss";
// import FlipLink from "./AnimatedHeader ";
// import { useBreakpoint } from "./Experience";

// interface CardItem {
//   num: string;
//   title: string;
//   desc: string;
//   link: string;
//   category: string;
//   accent: string;
//   icon: React.ReactNode;
// }

// const CodeLabIcon = () => (
//   <svg viewBox="0 0 52 52" width="52" height="52" xmlns="http://www.w3.org/2000/svg">
//     <rect x="4" y="10" width="44" height="32" rx="3" fill="none" stroke="#EFEEEC" strokeWidth="1.5" opacity="0.15" />
//     <line x1="4" y1="18" x2="48" y2="18" stroke="#EFEEEC" strokeWidth="1" opacity="0.15" />
//     <circle cx="11" cy="14" r="1.5" fill="#EFEEEC" opacity="0.3" />
//     <circle cx="17" cy="14" r="1.5" fill="#EFEEEC" opacity="0.3" />
//     <circle cx="23" cy="14" r="1.5" fill="#EFEEEC" opacity="0.3" />
//     <polyline points="16,28 12,32 16,36" fill="none" stroke="#EFEEEC" strokeWidth="1.5" strokeLinejoin="round" opacity="0.9" />
//     <polyline points="22,28 26,32 22,36" fill="none" stroke="#EFEEEC" strokeWidth="1.5" strokeLinejoin="round" opacity="0.9" />
//     <rect x="30" y="28" width="6" height="8" fill="#EFEEEC" opacity="0.85" />
//   </svg>
// );

// const BrandingIcon = () => (
//   <svg viewBox="0 0 52 52" width="52" height="52" xmlns="http://www.w3.org/2000/svg">
//     <ellipse cx="27" cy="27" rx="16" ry="13" fill="none" stroke="#EFEEEC" strokeWidth="1.5" opacity="0.25" />
//     <ellipse cx="33" cy="36" rx="4" ry="3" fill="none" stroke="#EFEEEC" strokeWidth="1.5" opacity="0.25" />
//     <circle cx="18" cy="24" r="2.2" fill="#EFEEEC" opacity="0.7" />
//     <circle cx="24" cy="19" r="2.2" fill="#EFEEEC" opacity="0.45" />
//     <circle cx="31" cy="19" r="2.2" fill="#EFEEEC" opacity="0.25" />
//     <circle cx="36" cy="24" r="2.2" fill="#EFEEEC" opacity="0.55" />
//     <line x1="10" y1="10" x2="22" y2="22" stroke="#EFEEEC" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
//     <ellipse cx="23.5" cy="23.5" rx="2.5" ry="1.5" transform="rotate(-45 23.5 23.5)" fill="#EFEEEC" opacity="0.9" />
//     <circle cx="9.5" cy="9.5" r="1.5" fill="#EFEEEC" opacity="0.4" />
//     <path d="M 14 42 Q 26 38 36 43" fill="none" stroke="#EFEEEC" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
//   </svg>
// );

// const UISystemIcon = () => (
//   <svg viewBox="0 0 52 52" width="52" height="52" xmlns="http://www.w3.org/2000/svg">
//     <line x1="26" y1="14" x2="26" y2="38" stroke="#EFEEEC" strokeWidth="1" strokeLinecap="round" opacity="0.12" />
//     <line x1="14" y1="26" x2="38" y2="26" stroke="#EFEEEC" strokeWidth="1" strokeLinecap="round" opacity="0.12" />
//     <rect x="8" y="8" width="16" height="16" rx="2" fill="none" stroke="#EFEEEC" strokeWidth="1.5" opacity="0.9" />
//     <rect x="28" y="8" width="16" height="16" rx="2" fill="none" stroke="#EFEEEC" strokeWidth="1.5" opacity="0.5" />
//     <rect x="8" y="28" width="16" height="16" rx="2" fill="none" stroke="#EFEEEC" strokeWidth="1.5" opacity="0.5" />
//     <rect x="28" y="28" width="16" height="16" rx="2" fill="none" stroke="#EFEEEC" strokeWidth="1.5" opacity="0.3" />
//     <rect x="11" y="11" width="10" height="3" rx="1" fill="#EFEEEC" opacity="0.15" />
//     <rect x="31" y="11" width="10" height="3" rx="1" fill="#EFEEEC" opacity="0.15" />
//     <rect x="11" y="31" width="10" height="3" rx="1" fill="#EFEEEC" opacity="0.15" />
//     <rect x="31" y="31" width="10" height="3" rx="1" fill="#EFEEEC" opacity="0.15" />
//   </svg>
// );

// const CARDS: CardItem[] = [
//   {
//     num: "01",
//     category: "Development",
//     title: "Code Lab",
//     desc: "Experiments, repositories, and open-source work. Where ideas get compiled and shipped.",
//     link: "https://github.com/shhahad20?tab=repositories",
//     accent: "#F17625",
//     icon: <CodeLabIcon />,
//   },
//   {
//     num: "02",
//     category: "Design",
//     title: "Branding",
//     desc: "Graphic design, visual identity, and brand systems. Translating ideas into visual language.",
//     link: "https://www.behance.net/shhahad20",
//     accent: "#98c0ef",
//     icon: <BrandingIcon />,
//   },
//   {
//     num: "03",
//     category: "Engineering",
//     title: "UI System",
//     desc: "Reusable components, design tokens, and scalable interfaces built for consistency.",
//     link: "/components",
//     accent: "#F17625",
//     icon: <UISystemIcon />,
//   },
// ];

// type Direction = "left" | "right";

// const CardFace = ({ card }: { card: CardItem }) => (
//   <>
//     <span className="busy-card__category">{card.category}</span>
//     <div className="busy-card__icon">{card.icon}</div>
//     <p className="busy-card__num">{card.num}</p>
//     <h3 className="busy-card__title">{card.title}</h3>
//     <div className="busy-card__divider" style={{ background: card.accent }} />
//     <p className="busy-card__desc">{card.desc}</p>
//     <div className="busy-card__footer">
//       <span className="busy-card__cta">
//         View work <span className="busy-card__arrow">→</span>
//       </span>
//     </div>
//   </>
// );

// function useSpringValue(value: MotionValue<number>) {
//   return useSpring(value, { stiffness: 120, damping: 22, mass: 0.8 });
// }

// function SideCard({
//   card,
//   progress,
//   direction,
// }: {
//   card: CardItem;
//   progress: MotionValue<number>;
//   direction: Direction;
// }) {
//   const sign = direction === "left" ? -1 : 1;
//   const isExternal = card.link.startsWith("http");

// const x = useSpringValue(
//   useTransform(progress, [0, 1], [0, sign * 340]) // ← increase spacing
// );
//   const z = useSpringValue(useTransform(progress, [0, 1], [-220, 0]));
//   const scale = useSpringValue(useTransform(progress, [0, 1], [0.86, 1]));
//   const opacity = useSpringValue(useTransform(progress, [0, 0.2, 1], [0.35, 0.7, 1]));
//   const rotateY = useSpringValue(useTransform(progress, [0, 1], [sign * -18, 0]));
//   const y = useSpringValue(useTransform(progress, [0, 1], [14, 0]));

//   return (
//     <motion.a
//       href={card.link}
//       target={isExternal ? "_blank" : "_self"}
//       rel={isExternal ? "noreferrer" : undefined}
//       className="busy-card busy-card--side"
//       style={{
//         x,
//         y,
//         z,
//         scale,
//         opacity,
//         rotateY,
//         position: "absolute",
//         transformOrigin: direction === "left" ? "right center" : "left center",
//         zIndex: 1,
//       }}
//       whileHover={{ y: -4 }}
//     >
//       <CardFace card={card} />
//     </motion.a>
//   );
// }

// function CenterCard({
//   card,
//   progress,
// }: {
//   card: CardItem;
//   progress: MotionValue<number>;
// }) {
//   const isExternal = card.link.startsWith("http");

//   const z = useSpringValue(useTransform(progress, [0, 1], [140, 0]));
//   const scale = useSpringValue(useTransform(progress, [0, 1], [1.05, 1]));
//   const y = useSpringValue(useTransform(progress, [0, 1], [0, -8]));
//   const shadowOpacity = useTransform(progress, [0, 0.6], [0.22, 0]);

//   return (
//     <motion.a
//       href={card.link}
//       target={isExternal ? "_blank" : "_self"}
//       rel={isExternal ? "noreferrer" : undefined}
//       className="busy-card busy-card--center"
//       style={{
//         z,
//         scale,
//         y,
//         position: "absolute",
//         zIndex: 3,
//         boxShadow: useTransform(
//           shadowOpacity,
//           (v) => `0 ${v * 38}px ${v * 64}px rgba(0,0,0,${v})`
//         ),
//       }}
//       whileHover={{ y: -4 }}
//     >
//       <CardFace card={card} />
//     </motion.a>
//   );
// }

// const Cards = () => {
//   const sectionRef = useRef<HTMLDivElement>(null);

//   const { scrollYProgress } = useScroll({
//     target: sectionRef,
//     offset: ["start end", "end start"],
//   });

//   const progress = useTransform(scrollYProgress, [0.1, 0.55], [0, 1], {
//     clamp: true,
//   });

//   /* ─── Blob motion ─── */
//   const blobX1 = useTransform(progress, [0, 1], [0, 40]);
//   const blobX2 = useTransform(progress, [0, 1], [0, -40]);

//   const isMobileHeader = useBreakpoint(769);

//   return (
//     <section
//       id="cards-section"
//       ref={sectionRef}
//       className="cards-section"
//     >
//       <div className="cards-sticky">
//                   <motion.div
//             className="work-header"
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, ease: "easeOut" }}
//             viewport={{ once: true, amount: 0.2 }}
//           >
//             <div className="work-header__top">
//               <div>
//                 <h1 className="work-header__title">Area of Work</h1>
//               </div>
//             </div>
//             {isMobileHeader ? (
//               <h2 className="work-header__subtitle">What I'm building</h2>
//             ) : (
//               <div className="work-header__flip">
//                 <FlipLink href="#">What</FlipLink>
//                 <FlipLink href="#">I'm</FlipLink>
//                 <FlipLink href="#">Building</FlipLink>
//               </div>
//              )}

//           </motion.div>

//           {/* ─── Background blobs ─── */}
//         <div className="cards-bg">
//           <motion.div
//             className="cards-blob"
//             style={{
//               width: 360,
//               height: 360,
//               top: "55%",
//               left: "60%",
//               background: "rgba(241, 119, 37, 0.05)",
//               x: blobX1,
//             }}
//           />
//           <motion.div
//             className="cards-blob"
//             style={{
//               width: 300,
//               height: 300,
//               top: "30%",
//               left: "35%",
//               background: "rgba(152, 192, 239, 0.08)",
//               x: blobX2,
//             }}
//           />
//         </div>

//         <div className="cards-stage">
//           <SideCard card={CARDS[0]} progress={progress} direction="left" />
//           <CenterCard card={CARDS[1]} progress={progress} />
//           <SideCard card={CARDS[2]} progress={progress} direction="right" />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Cards;

import GradientCard from "./Card";
// import { motion } from 'framer-motion';
import "../styles/cards.scss";
import { useEffect, useState } from "react";
import FlipLink from "./AnimatedHeader ";

const greenishTheme = {
  backgroundColor: "rgb(211, 211, 84)", // Original dark background
  borderColor: "1px solid #D3D354",
  starColor: "rgba(211, 211, 84, 0.7)",
  headerColor: "#D3D354",
};

const pinkishTheme = {
  backgroundColor: "#D96570", // Light pink background
  textBackground: "rgba(217, 101, 113, 0.4)",
  borderColor: "1px solid #D96570",
  starColor: "rgba(255, 154, 205, 0.56)",
  headerColor: "#D96570",
  lightColorHeader: "#F9BDC3",
};
const bluishTheme = {
  backgroundColor: "#5489D6", // Light pink background
  textBackground: "rgba(84, 137, 214, 0.4)",
  borderColor: "1px solid #369EFF",
  starColor: "rgba(84, 137, 214, 0.56)",
  headerColor: "#369EFF",
  lightColorHeader: "#D8ECF8",
};

const metalTheme = {
  backgroundColor: "#EFEEEC",
  textBackground: "rgba(192,192,192, 0.4)",
  borderColor: "1px solid #a9a9a9",
  starColor: "rgba(255, 255, 255, 0.8)",
  headerColor: "#d3d3d3",
  lightColorHeader: "#f5f5f5",
};

const Cards = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="cards-container">
      <div className="header-content">
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
      </div>
      <div className="top-cards">
        <GradientCard
          title="Components"
          label="Explore our UI components library"
          onClick={() => console.log("Components card clicked")}
          theme={bluishTheme}
          image="/compIcon.svg"
          link="/components"
        />
        <GradientCard
          title="Repositories"
          label="Discover our code repositories"
          onClick={() => console.log("Repositories card clicked")}
          theme={pinkishTheme}
          link="https://github.com/shhahad20?tab=repositories"
        />
      </div>
      <div className="bottom-cards">
        <GradientCard
          title="Social Media News"
          label="Catch the Latest News"
          onClick={() => console.log("Social Media News card clicked")}
          theme={greenishTheme}
          link="https://www.linkedin.com/in/shahadaltharwa/"
        />
        <GradientCard
          title="Projects"
          label="Boldest Projects and Future Ventures"
          onClick={() => console.log("Projects card clicked")}
          theme={metalTheme}
          image="/projectImage.svg"
          link="/projects"
        />
      </div>
    </div>
  );
};

export default Cards;
