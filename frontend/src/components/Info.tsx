import FlipLink from "./AnimatedHeader ";
import { motion } from "framer-motion";
import "../styles/info.scss";
import AnimatedCounter from "./AnimationCounter";

const Info = () => {
  return (
    <section id="quick-grasp">
      <motion.div
        className="header-content"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="between-lines">
          <div>
            <h1 className="info-header">A Quick Grasp of Key Information</h1>
          </div>
        </div>
        <div className="flip">
          <div className="flip-top">
            <FlipLink href="#">The</FlipLink>
            <FlipLink href="#">Big</FlipLink>
          </div>
          <FlipLink href="#">Picture</FlipLink>
        </div>
      </motion.div>

      <motion.div
        className="info-card-container"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="top">
          {" "}
          <div className="info-card">
            <img src="/Users.svg" alt="users" />
            <h3>
              {" "}
              <span>
                <AnimatedCounter target={95} duration={2} suffix="+ Clients" />
              </span>
              <span>
                <AnimatedCounter target={140} duration={2} suffix="+ Students" />
              </span>
            </h3>
          </div>
          <div className="info-card">
            <img src="/Folder.svg" alt="Folder" />
            <h3><AnimatedCounter target={150} duration={2} suffix="+ Project & Designs" /></h3>
          </div>
        </div>

        <div className="bottom">
          <div className="info-card">
            <img src="/git.svg" alt="Git" />
            <h3><AnimatedCounter target={45} duration={2} suffix="+ GitHub Repositories" /></h3>
          </div>
          <div className="info-card">
            <img src="/code.svg" alt="Code" />
            <h3>3 Programming Languages</h3>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
export default Info;
