import GradientCard from "./Card";
import { motion } from 'framer-motion';

import "../styles/cards.scss";
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
  return (
    <div className="cards-container">
      <motion.div
        className="header-content"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="between-lines">
          <div>
            <h1 className="section-header">Discover. Innovate. Inspire.</h1>
          </div>
        </div>
        <div className="flip">
          <FlipLink href="#">The</FlipLink>
          <FlipLink href="#">Dashboard</FlipLink>

        </div>
      </motion.div>

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
          // image=""
          link="https://github.com/shhahad20?tab=repositories"
        />
      </div>
      <div className="bottom-cards">
        <GradientCard
          title="Social Media News"
          label="Catch the Latest News"
          onClick={() => console.log("Social Media News card clicked")}
          theme={greenishTheme}
          // image=""
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
