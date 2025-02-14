import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import "../styles/experience.scss";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Link } from "react-router-dom";
import FlipLink from "./AnimatedHeader ";
import { motion } from "framer-motion";

const Experience = () => {
  const codeSnippet = `
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.shahad.com/data");
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };`;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Reset button text after 1.5s
  };

  return (
    <div id="experience">
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
        <div className="flip">
          <FlipLink href="#">Career</FlipLink>
          <FlipLink href="#">Highlights</FlipLink>
        </div>
        <p className="third-p">
          "Success is the sum of small efforts, repeated day in and day out." –
          Robert Collier
        </p>
      </motion.div>
      <motion.div
        className="cards_container"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* <div className="left-column"> */}
          <div className="card card_1">
            <h1>Teaching Assistant</h1>
            <div className="blue_content">
              <p className="place">University of Hail</p>
              <p className="date">2024 - 2025</p>
            </div>
            <p className="description">
              Assisted the lead instructor in preparing course materials,
              including lecture labs, assignments, and exams. - Graded
              assignments and provided constructive feedback to students to help
              them improve their programming skills. - Mentored and guided a
              diverse group of over 180 students, both in class and during
              office hours.
            </p>
          </div>
          <div className="card card_2">
            <h1>Web Developer Freelance</h1>
            <div className="blue_content">
              <p className="place">Home sweet home</p>
              <p className="date">2025 - Present</p>
            </div>

            <p className="description">
              Worked with clients to develop websites and web applications.
            </p>
            <div className="code-container">
              <div className="code-header">
                <h3 className="code-title">Fetch API Data</h3>
                <button onClick={handleCopy} className="copy-btn">
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <SyntaxHighlighter
                language="javascript"
                style={atomDark}
                className="codeSnippet"
                customStyle={{
                  backgroundColor: "#0E0E0E",
                  borderRadius: "5px",
                  padding: "3px",
                  margin: "0",
                }}
              >
                {codeSnippet}
              </SyntaxHighlighter>
            </div>
          </div>

        {/* </div> */}
        {/* <div className="right-column"> */}
        
            <div className="card card_3">
            <Link to="https://futureskills.mcit.gov.sa/ar/ambassadors-info#:~:text=%D8%B4%D9%87%D8%AF%20%D9%85%D8%AD%D9%85%D8%AF%D8%B9%D9%84%D9%89%20%D8%AD%D9%85%D8%AF%20%D8%A7%D9%84%D8%AB%D8%B1%D9%88%D9%8A">
              <h1>Technology Ambassador</h1>
              <div className="blue_content">
                <p className="place">
                  Ministry of Communication and Information Technology MCIT
                </p>
                <p className="date">2021 - 2023</p>
              </div>

              <p className="description">
                Designed responsive, user-friendly web interfaces using HTML,
                CSS, and JavaScript, optimizing performance with lazy loading.
                Ensured accessibility with semantic HTML and industry standards.
                Explored blockchain technology beyond cryptocurrencies.
                Completed a beginner-level Python course with Jupiter Notebooks.
              </p>
              <div className="img-container">
                <img src="/MCIT_logo_light.png" alt="" />
              </div>
              </Link>
            </div>
          
          
          <div className="card card_4">
            <h1>Graphic Designer Freelance</h1>
            <div className="blue_content">
              <p className="place">Home sweet home</p>
              <p className="date">2018 - 2024</p>
            </div>

            <p className="description">
              Executed 250+ projects 95+ clients, including logos, magazines,
              brochures, and social media designs, using Photoshop and
              Illustrator.
            </p>
          </div>
        {/* </div> */}
      </motion.div>
    </div>
  );
};

export default Experience;
