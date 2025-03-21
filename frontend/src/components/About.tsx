import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/about.scss";

interface Paragraphs {
  [key: string]: React.RefObject<HTMLDivElement | null>;
}
const About = () => {
  const paragraphs: Paragraphs = {
    "Software Engineering": useRef<HTMLDivElement | null>(null),
    "Full-Stack": useRef<HTMLDivElement | null>(null),
    "Graphic Design": useRef<HTMLDivElement | null>(null),
    "Teaching Assistant": useRef<HTMLDivElement | null>(null),
  };

  const [highlighted, setHighlighted] = useState<string | number>("");
  useEffect(() => {
    if (highlighted) {
      const timer = setTimeout(() => {
        setHighlighted("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [highlighted]);

  const scrollToParagraph = (keyword: keyof typeof paragraphs) => {
    if (paragraphs[keyword]?.current) {
      paragraphs[keyword].current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
      setHighlighted(keyword);
    }
  };

  return (
    <motion.div
      id="about-section"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      
      <div id="about-paragraph">
        <div className="between-lines">
          <div>
            <h1 className="about-me-header">About Me</h1>
          </div>
        </div>
        <h1 className="second-header">
          Shahad Altharwa <br /> Behind the Code
        </h1>
        <div id="keywords-container">
          {Object.keys(paragraphs).map((keyword) => (
            <a
              key={keyword}
              onClick={() =>
                scrollToParagraph(keyword as keyof typeof paragraphs)
              }
              className={highlighted === keyword ? "active" : ""}
            >
              {keyword}
            </a>
          ))}
        </div>
        <p
          ref={paragraphs["Software Engineering"]}
          className={
            highlighted === "Software Engineering" ? "highlighted" : ""
          }
        >
          As a Software Engineer, I excel in software architecture, algorithm
          design, and problem-solving across multiple languages and frameworks.
          I'm dedicated to staying current with tech trends and optimizing code
          for performance. I earned my
          <span className="span-color">
            {" "}
            Bachelor of Software Engineering from the University of Hail (2018 -
            2023), majoring in Software Engineering.
          </span>
        </p>
        <p
          ref={paragraphs["Full-Stack"]}
          className={highlighted === "Full-Stack" ? "highlighted" : ""}
        >
          Over the years, I've built diverse software development
          skills—starting in front-end design with HTML, CSS, and JavaScript,
          then moving into robust backend development with Python. I've mastered
          database management, API integration, and debugging. A year ago, I
          completed a <br />
          <span className="span-color">
            MERN Software Development Bootcamp at Saudi Digital Academy x
            Integrify (Sep 2023 - Dec 2023)
          </span>{" "}
          <br />, which further ignited my passion for full-stack development
          and data science.
        </p>

        <p
          ref={paragraphs["Graphic Design"]}
          className={highlighted === "Graphic Design" ? "highlighted" : ""}
        >
          I also spent over five years as a freelance Graphic Designer,
          completing 200+ projects that honed my visual design and user
          experience skills.
        </p>
        <p
          ref={paragraphs["Teaching Assistant"]}
          className={highlighted === "Teaching Assistant" ? "highlighted" : ""}
        >
          Currently, I serve as a Teaching Assistant at the University of Hail,
          where I teach Java and data structures.
        </p>
        <p>
          Looking ahead, I aspire to become a full-stack developer and explore
          data science to build intelligent, scalable software that makes a real
          impact.
        </p>
      </div>
    </motion.div>
  );
};

export default About;
