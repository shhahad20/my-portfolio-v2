// import { useEffect, useState } from "react";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// // import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
// import "../styles/experience.scss";
// import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// import { Link } from "react-router-dom";
// import FlipLink from "./AnimatedHeader ";
// import { motion } from "framer-motion";

// const Experience = () => {
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const codeSnippet = `
//     const fetchData = async () => {
//       try {
//         const response = await fetch("https://api.shahad.com/data");
//         const data = await response.json();
//         console.log(data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };`;
//     const codeSnippetTwo = `
//     import { createClient } from '@supabase/supabase-js';

//     const supabaseUrl = 'https://your-project.supabase.co';
//     const supabaseKey = 'public-anon-key';
//     const supabase = createClient(supabaseUrl, supabaseKey);

//     async function getUsers() {
//       const { data, error } = await supabase
//         .from('users')
//         .select('*');

//       if (error) {
//         console.error('Error fetching users:', error);
//       } else {
//         console.log('User data:', data);
//       }
//     }

//     getUsers();
//   `;
//   const [copied, setCopied] = useState(false);

//   const handleCopy = () => {
//     navigator.clipboard.writeText(codeSnippet);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 1500); // Reset button text after 1.5s
//   };

//   return (
//     <div id="experience">
//       <motion.div
//         className="header-content"
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         viewport={{ once: true, amount: 0.2 }}
//       >
//         <div className="between-lines">
//           <div>
//             <h1 className="experience-header">Work Experience</h1>
//           </div>
//         </div>
//         {/* <h1 className="second-header">Career Highlights</h1> */}
//         {isMobile ? (
//           <h2 className="mobile-header">Career Highlights</h2>
//         ) : (
//           <div className="flip">
//             <FlipLink href="#">Career</FlipLink>
//             <FlipLink href="#">Highlights</FlipLink>
//           </div>
//         )}
//         <p className="third-p">
//           "Success is the sum of small efforts, repeated day in and day out." –
//           Robert Collier
//         </p>
//       </motion.div>
//       <motion.div
//         className="cards_container"
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         viewport={{ once: true, amount: 0.2 }}
//       >
//         {/* <div className="left-column"> */}
//           <div className="card card_1">
//             <h1>Teaching Assistant</h1>
//             <div className="blue_content">
//               <p className="place">University of Hail</p>
//               <p className="date">2024 - 2025</p>
//             </div>
//             <p className="description">
//               Assisted the lead instructor in preparing course materials,
//               including lecture labs, assignments, and exams. - Graded
//               assignments and provided constructive feedback to students to help
//               them improve their programming skills. - Mentored and guided a
//               diverse group of over 180 students, both in class and during
//               office hours.
//             </p>
//           </div>
//           <div className="card card_2">
//             <h1>Web Developer Freelance</h1>
//             <div className="blue_content">
//               <p className="place">Home sweet home</p>
//               <p className="date">2025 - Present</p>
//             </div>

//             <p className="description">
//               Worked with clients to develop websites and web applications.
//             </p>
//             <div className="code-container">
//               <div className="code-header">
//                 <h3 className="code-title">Fetch API Data</h3>
//                 <button onClick={handleCopy} className="copy-btn">
//                   {copied ? "Copied!" : "Copy"}
//                 </button>
//               </div>

//               <SyntaxHighlighter
//                 language="javascript"
//                 style={atomDark}
//                 className="codeSnippet"
//                 customStyle={{
//                   backgroundColor: "#0E0E0E",
//                   padding: "3px",
//                   margin: "0",
//                 }}
//               >
//                 {codeSnippet}
//               </SyntaxHighlighter>
//               <SyntaxHighlighter
//                 language="javascript"
//                 style={atomDark}
//                 className="codeSnippet"
//                 customStyle={{
//                   backgroundColor: "#0E0E0E",
//                   padding: "3px",
//                   margin: "0",
//                   marginTop: "1rem",
//                 }}
//               >
//                 {codeSnippetTwo}
//               </SyntaxHighlighter>
//             </div>
//           </div>

//         {/* </div> */}
//         {/* <div className="right-column"> */}
        
//             <div className="card card_3">
//             <Link to="https://futureskills.mcit.gov.sa/ar/ambassadors-info#:~:text=%D8%B4%D9%87%D8%AF%20%D9%85%D8%AD%D9%85%D8%AF%D8%B9%D9%84%D9%89%20%D8%AD%D9%85%D8%AF%20%D8%A7%D9%84%D8%AB%D8%B1%D9%88%D9%8A">
//               <h1>Technology Ambassador</h1>
//               <div className="blue_content">
//                 <p className="place">
//                   Ministry of Communication and Information Technology
//                 </p>
//                 <p className="date">2021 - 2023</p>
//               </div>

//               <p className="description">
//                 Designed responsive, user-friendly web interfaces using HTML,
//                 CSS, and JavaScript, optimizing performance with lazy loading.
//                 Ensured accessibility with semantic HTML and industry standards.
//                 Explored blockchain technology beyond cryptocurrencies.
//                 Completed a beginner-level Python course with Jupiter Notebooks.
//               </p>
//               <div className="img-container">
//                 <img src="/MCIT_logo_light.png" alt="" />
//               </div>
//               </Link>
//             </div>
          
          
//           <div className="card card_4">
//             <h1>Graphic Designer Freelance</h1>
//             <div className="blue_content">
//               <p className="place">Home sweet home</p>
//               <p className="date">2018 - 2024</p>
//             </div>

//             <p className="description">
//               Executed 250+ projects 95+ clients, including logos, magazines,
//               brochures, and social media designs, using Photoshop and
//               Illustrator.
//             </p>
//           </div>
//         {/* </div> */}
//       </motion.div>
//     </div>
//   );
// };

// export default Experience;
import { useEffect, useRef, useState } from "react";
import FlipLink from "./AnimatedHeader ";
import { motion } from "framer-motion";
const CARDS = [
  {
    id: 0,
    tag: "2024 – 2025",
    category: "Education",
    title: "Teaching Assistant",
    place: "University of Hail",
    desc: "Mentored 180+ students, prepared course materials, and provided constructive feedback on programming assignments.",
    accent: "#98c0ef",
    bg: "rgba(32, 32, 32, 0.6)",
  },
  {
    id: 1,
    tag: "2025 – Present",
    category: "Development",
    title: "Web Developer",
    place: "Freelance · Remote",
    desc: "Building full-stack web applications and client-facing products using React, Supabase, and modern JS ecosystems.",
    accent: "#F17625",
    bg: "rgba(32, 32, 32, 0.6)",
  },
  {
    id: 2,
    tag: "2021 – 2023",
    category: "Government",
    title: "Technology Ambassador",
    place: "MCIT · Saudi Arabia",
    desc: "Designed responsive interfaces, explored blockchain technology, and completed Python & data science certifications.",
    accent: "#98c0ef",
    bg: "rgba(32, 32, 32, 0.6)",
  },
  {
    id: 3,
    tag: "2018 – 2024",
    category: "Design",
    title: "Graphic Designer",
    place: "Freelance · Remote",
    desc: "Delivered 250+ projects across 95+ clients — logos, brand identities, magazines, and social media.",
    accent: "#F17625",
    bg: "rgba(32, 32, 32, 0.6)",
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
  card: typeof CARDS[0];
  scrollP: number;
  enterP: number;
  index: number;
  total: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function GlassCard({ card, scrollP, enterP, index, total, isHovered, onHover, onLeave }: GlassCardProps) {
  const ep = easeInOutCubic(Math.max(0, Math.min(1, scrollP)));

  // Each card has a staggered entrance window
  // Card 0 enters first (enterP 0→0.55), card 3 enters last (enterP 0.45→1)
  const windowStart = index * 0.15;
  const windowEnd   = windowStart + 0.65;
  const rawEnter    = Math.max(0, Math.min(1, (enterP - windowStart) / (windowEnd - windowStart)));
  const eEnter      = easeOutExpo(rawEnter);

  // ── Entrance: from very deep Z, slightly above center, tiny scale
  const entranceZ     = -2200 * (1 - eEnter);
  const entranceY     = -40  * (1 - eEnter);
  const entranceScale = 0.30 + eEnter * 0.75; // 0.25 -> 0.30
  const entranceOp    = Math.min(1, rawEnter * 1.8);

  // ── Stack state
  const stackZ  = (total - 1 - index) * -44;
  const stackX  = index * 4;
  const stackY  = index * 7;
  const stackRY = index * -3;
  const stackSc = 1 - index * 0.036;

  // ── Spread state
  const spreadSpacing = 310;
  const centerOffset  = ((total - 1) / 2) * spreadSpacing;
  const targetX  = index * spreadSpacing - centerOffset;

  // Interpolate stack → spread
  const x  = stackX  + (targetX - stackX)  * ep;
  const z  = stackZ  + (0 - stackZ) * ep;
  const y  = stackY  + (0 - stackY) * ep;
  const ry = stackRY + (0 - stackRY) * ep;
  const sc = stackSc + (1 - stackSc) * ep;

  // ── Compose final transform
  // Before entry: deep Z. After entry: normal stack/spread position.
  const finalX  = x;
  const finalY  = y + entranceY + (isHovered ? -14 : 0);
  const finalZ  = entranceZ + z;
  const finalRY = ry;
  const finalSc = entranceScale * sc * (isHovered ? 1.04 : 1);
  const finalOp = entranceOp * (index === 0 ? 1 : Math.max(entranceOp, Math.min(1, ep * 2.2)));

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        position: "absolute",
        width: 280,
        height: 310,
        borderRadius: 20,
        background: card.bg,
        backdropFilter: "blur(32px) saturate(180%)",
        WebkitBackdropFilter: "blur(32px) saturate(180%)",
        border: "1px solid rgba(152, 192, 239, 0.2)",
        boxShadow: isHovered
          ? "0 36px 72px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(152, 192, 239, 0.2)"
          : "0 14px 44px rgba(0,0,0,0.3), 0 2px 10px rgba(0,0,0,0.2), inset 0 1px 0 rgba(152, 192, 239, 0.1)",
        transform: `translateX(${finalX}px) translateY(${finalY}px) translateZ(${finalZ}px) rotateY(${finalRY}deg) scale(${finalSc})`,
        opacity: finalOp,
        zIndex: isHovered ? 100 : total - index,
        transition: "box-shadow 0.3s ease",
        padding: "1.5rem 1.6rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        willChange: "transform, opacity",
        userSelect: "none",
        cursor: "default",
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <span style={{
            fontSize: 9,
            // fontFamily: "'Syne', sans-serif",
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(239, 238, 236, 0.45)",
          }}>{card.category}</span>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: card.accent, opacity: 0.7 }} />
        </div>

        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 19,
          fontWeight: 700,
          color: "#EFEEEC",
          lineHeight: 1.22,
          marginBottom: "0.28rem",
          letterSpacing: "-0.015em",
        }}>{card.title}</h2>

        <p style={{
          fontSize: 10.5,
          fontFamily: "'DM Sans', sans-serif",
          color: "rgba(152, 192, 239, 0.6)",
          letterSpacing: "0.04em",
          marginBottom: "0.9rem",
        }}>{card.place}</p>

        <div style={{
          width: 24, height: 1.5, borderRadius: 2,
          background: card.accent, opacity: 0.6, marginBottom: "0.9rem",
        }} />

        <p style={{
          // fontFamily: "'DM Sans', sans-serif",
          fontSize: 12.5,
          lineHeight: 1.68,
          color: "rgba(239, 238, 236, 0.7)",
        }}>{card.desc}</p>
      </div>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid rgba(152, 192, 239, 0.1)",
        paddingTop: "0.85rem",
        marginTop: "0.5rem",
      }}>
        <span style={{
          // fontFamily: "'Syne', sans-serif",
          fontSize: 9,
          fontWeight: 600,
          color: "rgba(239, 238, 236, 0.35)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}>{card.tag}</span>
        <div style={{ width: 22, height: 22, borderRadius: "50%", background: card.accent, opacity: 0.2 }} />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ExperienceCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollP, setScrollP] = useState(0);
  const [enterP,  setEnterP]  = useState(0);
  const [hasEntered, setHasEntered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const smoothScroll = useRef(0);
  const smoothEnter  = useRef(0);
  const targetScroll = useRef(0);
  const targetEnter  = useRef(0);
  const rafRef       = useRef<number | null>(null);

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
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasEntered]);

  // ── Scroll listener
  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect  = el.getBoundingClientRect();
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
      smoothScroll.current += (targetScroll.current - smoothScroll.current) * 0.082;
      smoothEnter.current  += (targetEnter.current  - smoothEnter.current)  * 0.072;
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
  const scrollHintOpacity  = Math.max(0, 1 - ep * 6) * Math.min(1, enterP * 2.5);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Syne:wght@400;600;700&display=swap');
        .exp-hero { min-height: 60vh; display: flex; align-items: center; justify-content: center; background: #070707; }
        .exp-after { min-height: 35vh; display: flex; align-items: center; justify-content: center; background: #070707; }
        .scroll-cue {
          display: flex; align-items: center; gap: 8px;
          // font-family: 'Syne', sans-serif;
           font-size: 10px;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(152, 192, 239, 0.38);
          animation: bob 2.2s ease-in-out infinite;
        }
        @keyframes bob {
          0%,100% { transform: translateY(0); opacity: 0.38; }
          50% { transform: translateY(5px); opacity: 0.6; }
        }
        .prog-line {
          position: fixed; top: 0; left: 0; height: 2px;
          background: linear-gradient(90deg, #98c0ef, #98c0ef, #F17625, #98c0ef);
          z-index: 9999; pointer-events: none;
        }
      `}</style>

      <div className="prog-line" style={{ width: `${scrollP * 100}%` }} />

      <div className="exp-hero">
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{
            // fontFamily: "'Syne', sans-serif", 
            fontSize: 10,
            letterSpacing: "0.28em", color: "rgba(152, 192, 239, 0.35)",
            textTransform: "uppercase", marginBottom: "1rem",
          }}>Shahad · Portfolio</p>
          {/* <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: isMobile ? 34 : 56,
            fontWeight: 700, color: "#EFEEEC",
            letterSpacing: "-0.03em", lineHeight: 1.08,
          }}>Work Experience</h1> */}
          <motion.div
        className="header-content"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="between-lines">
          <div>
            <h1 className="experience-header">Work Experience</h1>
          </div>
        </div>
        {/* <h1 className="second-header">Career Highlights</h1> */}
        {isMobile ? (
          <h2 className="mobile-header">Career Highlights</h2>
        ) : (
          <div className="flip">
            <FlipLink href="#">Career</FlipLink>
            <FlipLink href="#">Highlights</FlipLink>
          </div>
        )}
        <p className="third-p">
          "Success is the sum of small efforts, repeated day in and day out." –
          Robert Collier
        </p>
      </motion.div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14, color: "rgba(239, 238, 236, 0.42)", marginTop: "0.9rem",
          }}>Scroll to reveal</p>
          <div style={{ marginTop: "2.2rem", color: "rgba(152, 192, 239, 0.5)" }} className="scroll-cue">
            <span>↓</span> scroll
          </div>
        </div>
      </div>

      {/* ── Scroll container ── */}
      <div ref={containerRef} style={{ height: "420vh", position: "relative", background: "#070707" }}>
        <div style={{
          position: "sticky", top: 0, height: "100vh",
          overflow: "hidden", display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>

          {/* Ambient blobs */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
            {[
              // { w: 480, h: 480, top: "8%",  left: "18%", c: "rgba(152, 192, 239, 0.12)" },
              { w: 380, h: 380, top: "52%", left: "58%", c: "rgba(241, 118, 37, 0.08)" },
              { w: 320, h: 320, top: "28%", left: "68%", c: "rgba(152, 192, 239, 0.1)" },
              { w: 280, h: 280, top: "68%", left: "8%",  c: "rgba(241, 118, 37, 0.09)" },
            ].map((b, i) => (
              <div key={i} style={{
                position: "absolute",
                width: b.w, height: b.h, borderRadius: "50%",
                background: b.c, top: b.top, left: b.left,
                filter: "blur(65px)",
                transform: `translate(-50%,-50%) translateX(${ep * (i % 2 === 0 ? 28 : -28)}px)`,
              }} />
            ))}
          </div>

          {/* 3D stage */}
          <div style={{
            position: "relative", zIndex: 2,
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            perspective: `${isMobile ? 800 : 1100 - ep * 350}px`,
            perspectiveOrigin: `50% ${55 - ep * 15}%`,
          }}>
            <div style={{
              position: "relative",
              transformStyle: "preserve-3d",
              width: 280, height: 310,
            }}>
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

          {/* Scroll hint */}
          <div style={{
            position: "absolute", bottom: "7%", right: "5%",
            opacity: scrollHintOpacity,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            pointerEvents: "none",
          }}>
            <div style={{
              width: 1, height: 44,
              background: "linear-gradient(to bottom, transparent, rgba(152, 192, 239, 0.28))",
            }} />
            <span style={{
              fontFamily: "'Syne', sans-serif", fontSize: 8,
              letterSpacing: "0.22em", color: "rgba(152, 192, 239, 0.32)",
              textTransform: "uppercase", writingMode: "vertical-rl",
            }}>Scroll</span>
          </div>

          {/* Spread label */}
          <div style={{
            position: "absolute", bottom: "8%", left: "50%",
            transform: "translateX(-50%)",
            opacity: spreadLabelOpacity, pointerEvents: "none", textAlign: "center",
          }}>
            <p style={{
              fontFamily: "'Syne', sans-serif", fontSize: 9,
              letterSpacing: "0.22em", color: "rgba(152, 192, 239, 0.35)", textTransform: "uppercase",
            }}>Hover each card to explore</p>
          </div>

          {/* Sidebar category indicators */}
          <div style={{
            position: "absolute", left: "4%", top: "50%",
            transform: "translateY(-50%)",
            display: "flex", flexDirection: "column", gap: 12,
            opacity: Math.min(1, enterP * 1.8), pointerEvents: "none",
          }}>
            {CARDS.map((card, i) => {
              const visible = ep > i * 0.18;
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 7,
                  opacity: visible ? 1 : 0.18, transition: "opacity 0.45s ease",
                }}>
                  <div style={{
                    width: visible ? 18 : 5, height: 1.5,
                    background: card.accent, borderRadius: 2,
                    transition: "width 0.45s ease",
                  }} />
                  <span style={{
                    fontFamily: "'Syne', sans-serif", fontSize: 8,
                    letterSpacing: "0.16em", color: "rgba(239, 238, 236, 0.42)",
                    textTransform: "uppercase",
                    opacity: visible ? 1 : 0, transition: "opacity 0.45s ease",
                  }}>{card.category}</span>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      <div className="exp-after">
        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: 11,
          letterSpacing: "0.18em", color: "rgba(152, 192, 239, 0.25)", textTransform: "uppercase",
        }}>End of Experience</p>
      </div>
    </>
  );
}