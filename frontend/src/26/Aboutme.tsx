import React, { useState } from "react";
import { motion } from "framer-motion";
import "./style/AboutMe.scss";
import AnimatedLink from "../components/AnimatedLink";

interface NavLink {
  id: string;
  label: string;
  href?: string;
  paragraphIndex: number;
}

const AboutMe: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const navLinks: NavLink[] = [
    { id: "engineering", label: "SOFTWARE ENGINEERING ↗", paragraphIndex: 0 },
    { id: "fullstack", label: "FULL-STACK DEV ↗", paragraphIndex: 2 },
    { id: "design", label: "GRAPHIC DESIGN ↗", paragraphIndex: 3 },
    { id: "teaching", label: "TEACHING ASSISTANT ↗", paragraphIndex: 4 },
    { id: "certifications", label: "CERTIFICATIONS ↗", paragraphIndex: 5 },
  ];

  const paragraphs = [
    "My journey in tech started with a curiosity for how things work, which led me to earn my **Bachelor's degree** in Software Engineering from the University of Hail 2018–2023. Along the way, I developed a strong foundation in problem-solving, algorithms, and building efficient, scalable systems.",

    "I began with front-end development bringing ideas to life with HTML, CSS, and JavaScript, then naturally moved into backend development with Python, working with databases and APIs.",

    "**MERN Bootcamp** at Saudi Digital Academy x Integrify (Sep–Dec 2023) helped me grow into a more confident full-stack developer and explore data-driven solutions.",

    "I spent over five years as a **freelance graphic designer**, completing 300+ projects, an experience that still shapes how I think about design and user experience today.",

    "I also worked as a **Teaching Assistant**, where I taught Java and data structures and supported students in building strong programming foundations.",

    "Today, I'm focused on growing as a full-stack developer while exploring artificial intelligence to build smarter, more impactful systems. I hold **SCRUM** and **Microsoft Azure AI Fundamentals** certifications that support this journey.",
  ];

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  };

  const navVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.4,
      },
    },
  };

  const paragraphVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const handleNavLinkClick = (linkId: string, paragraphIndex: number) => {
    setActiveId(linkId);

    // Optional: Scroll to paragraph smoothly
    const contentElement = document.querySelector(".about__content");
    if (contentElement) {
      const paragraphs = contentElement.querySelectorAll(".about__paragraph");
      if (paragraphs[paragraphIndex]) {
        paragraphs[paragraphIndex].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  return (
    <section className="about" id="about">
      <div className="about__container">
        {/* Header Section - Title + Number */}
        <motion.div
          className="about__header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
        >
          <h1 className="about__title">
            ABOUT ME <span className="about__number">01</span>
          </h1>
        </motion.div>

        {/* Navigation Links */}
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
              className={`about__nav-button ${activeId === link.id ? "about__nav-button--active" : ""}`}
              onClick={() => handleNavLinkClick(link.id, link.paragraphIndex)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ opacity: 0.7 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* <span className="about__nav-text">{link.label}</span> */}
              <AnimatedLink
                linkText={link.label}
                hoverText={link.label}
                href="#"
              />
            </motion.button>
          ))}
        </motion.nav>

        {/* Content - All Paragraphs Visible with Highlight Support */}
        <motion.div
          className="about__content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={contentVariants}
        >
          {paragraphs.map((paragraph, index) => {
            const navLink = navLinks.find(
              (link) => link.paragraphIndex === index,
            );
            const isActive = activeId === navLink?.id;

            return (
              <motion.p
                key={index}
                className={`about__paragraph ${isActive ? "about__paragraph--highlighted" : ""}`}
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

/**
 * Helper function to render paragraph text with bold formatting
 * Supports patterns like: Regular text **bold text** more text
 */
function renderParagraph(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default AboutMe;
