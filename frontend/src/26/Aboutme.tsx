import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import "./style/Aboutme.scss";
import AnimatedLink from "../components/AnimatedLink";

// ─── Adjust this to match your navbar's actual height ───────────────────────
const HEADER_OFFSET = 80; // px

interface NavLink {
  id: string;
  label: string;
  href?: string;
  paragraphIndex: number;
}

const AboutMe: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Stable ref array — one slot per paragraph, populated during render
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const navLinks: NavLink[] = [
    { id: "engineering",    label: "SOFTWARE ENGINEERING ↗", paragraphIndex: 0 },
    { id: "fullstack",      label: "FULL-STACK DEV ↗",       paragraphIndex: 2 },
    { id: "design",         label: "GRAPHIC DESIGN ↗",       paragraphIndex: 3 },
    { id: "teaching",       label: "TEACHING ASSISTANT ↗",   paragraphIndex: 4 },
    { id: "certifications", label: "CERTIFICATIONS ↗",       paragraphIndex: 5 },
  ];

  const paragraphs = [
    "My journey in tech started with a curiosity for how things work, which led me to earn my **Bachelor's degree** in Software Engineering from the University of Hail 2018–2023. Along the way, I developed a strong foundation in problem-solving, algorithms, and building efficient, scalable systems.",
    "I began with front-end development bringing ideas to life with HTML, CSS, and JavaScript, then naturally moved into backend development with Python, working with databases and APIs.",
    "**MERN Bootcamp** at Saudi Digital Academy x Integrify (Sep–Dec 2023) helped me grow into a more confident full-stack developer and explore data-driven solutions.",
    "I spent over five years as a **freelance graphic designer**, completing 300+ projects, an experience that still shapes how I think about design and user experience today.",
    "I also worked as a **Teaching Assistant**, where I taught Java and data structures and supported students in building strong programming foundations.",
    "Today, I'm focused on growing as a full-stack developer while exploring artificial intelligence to build smarter, more impactful systems. I hold **SCRUM** and **Microsoft Azure AI Fundamentals** certifications that support this journey.",
  ];

  // ─── Animation variants (unchanged) ────────────────────────────────────────
  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] },
    },
  };

  const navVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.6, delay: 0.2, ease: "easeOut" },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.4 },
    },
  };

  const paragraphVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // ─── Fixed scroll handler ───────────────────────────────────────────────────
  const handleNavLinkClick = useCallback(
    (linkId: string, paragraphIndex: number) => {
      setActiveId(linkId);

      const target = paragraphRefs.current[paragraphIndex];
      if (!target) return;

      // getBoundingClientRect gives the position relative to the current
      // viewport; adding scrollY converts it to an absolute page position.
      // Subtracting HEADER_OFFSET prevents the target from being hidden
      // underneath a fixed/sticky navbar.
      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        HEADER_OFFSET;

      window.scrollTo({ top, behavior: "smooth" });
    },
    [],
  );

  return (
    <section className="about" id="about">
      <div className="about__container">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div
          className="about__header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
        >
          <h1 className="about__title">ABOUT ME</h1>
          <span className="about__number" aria-hidden="true">01</span>
        </motion.div>

        {/* ── Navigation ─────────────────────────────────────────────────── */}
        <motion.nav
          className="about__nav"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={navVariants}
        >
          {navLinks.map((link) => (
            <motion.button
              key={link.id}
              className={`about__nav-button ${
                activeId === link.id ? "about__nav-button--active" : ""
              }`}
              onClick={() => handleNavLinkClick(link.id, link.paragraphIndex)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ opacity: 0.7 }}
              whileTap={{ scale: 0.98 }}
            >
              {/*
               * FIX 1 – pointer-events: none on the wrapper
               *
               * AnimatedLink renders an <a href="#"> internally.
               * Without this wrapper, a click reaches the <a> first,
               * triggering the browser's default "scroll to #" behaviour
               * before React's onClick can fire.
               *
               * Setting pointer-events: none makes the <a> invisible to
               * the pointer — all clicks fall straight through to the
               * parent <button>, which owns the scroll logic.
               */}
              <span style={{ pointerEvents: "none" }}>
                <AnimatedLink
                  linkText={link.label}
                  hoverText={link.label}
                  href="#"
                />
              </span>
            </motion.button>
          ))}
        </motion.nav>

        {/* ── Paragraphs ─────────────────────────────────────────────────── */}
        <motion.div
          className="about__content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={contentVariants}
        >
          {paragraphs.map((paragraph, index) => {
            const navLink = navLinks.find((l) => l.paragraphIndex === index);
            const isActive = activeId === navLink?.id;

            return (
              <motion.p
                key={index}
                /*
                 * FIX 2 – ref array
                 *
                 * Each paragraph stores its DOM node in paragraphRefs at
                 * render time. The scroll handler reads from this array,
                 * which is always up-to-date regardless of layout changes.
                 */
                ref={(el) => {
                  paragraphRefs.current[index] = el;
                }}
                className={`about__paragraph ${
                  isActive ? "about__paragraph--highlighted" : ""
                }`}
                variants={paragraphVariants}
              >
                {renderParagraph(paragraph)}
              </motion.p>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

/** Renders **bold** markdown markers as <strong> elements. */
function renderParagraph(text: string): React.ReactNode {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index}>{part.slice(2, -2)}</strong>
    ) : (
      part
    ),
  );
}

export default AboutMe;