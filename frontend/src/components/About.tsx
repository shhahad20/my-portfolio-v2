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
          My journey in tech started with a curiosity for how things work, which
          led me to earn my
          <span className="span-color">
            {" "}
            Bachelor’s degree in Software Engineering from the University of
            Hail (2018–2023)
          </span>
          . Along the way, I developed a strong foundation in problem-solving,
          algorithms, and building efficient, scalable systems.
        </p>

        <p
          ref={paragraphs["Full-Stack"]}
          className={highlighted === "Full-Stack" ? "highlighted" : ""}
        >
          I began with front-end development—bringing ideas to life with HTML,
          CSS, and JavaScript—then naturally moved into backend development with
          Python, working with databases and APIs.
          <br />
          <span className="span-color">
            MERN Bootcamp at Saudi Digital Academy x Integrify (Sep–Dec 2023)
          </span>
          <br />
          helped me grow into a more confident full-stack developer and explore
          data-driven solutions.
        </p>

        <p
          ref={paragraphs["Graphic Design"]}
          className={highlighted === "Graphic Design" ? "highlighted" : ""}
        >
          Before all that, I spent over five years as a freelance graphic
          designer, completing 200+ projects—an experience that still shapes how
          I think about design and user experience today.
        </p>

        <p
          ref={paragraphs["Teaching Assistant"]}
          className={highlighted === "Teaching Assistant" ? "highlighted" : ""}
        >
          I also worked as a Teaching Assistant, where I taught Java and data
          structures and supported students in building strong programming
          foundations.
        </p>

        <p>
          Today, I’m focused on growing as a full-stack developer while
          exploring artificial intelligence to build smarter, more impactful
          systems.{" "}
          <span className="span-color">
            I hold SCRUM and Microsoft Azure AI Fundamentals certifications
          </span>{" "}
          that support this journey.
        </p>
      </div>
    </motion.div>
  );
};

export default About;
