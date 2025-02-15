import FlipLink from "./AnimatedHeader ";
import { motion } from "framer-motion";

import "../styles/mypartners.scss";

const MyPartners = () => {
  return (
    <section id="my-partners">
      <motion.div
        className="header-content"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="between-lines">
          <div>
            <h1 className="mypartners-header">My Essential Toolbox</h1>
          </div>
        </div>
        {/* <h1 className="second-header">Career Highlights</h1> */}
        <div className="flip">
          <FlipLink href="#">My</FlipLink>
          <FlipLink href="#">Partners</FlipLink>
        </div>
        <p className="third-p">
          AI Isn’t a Threat - It’s a Developer’s Best Friend!
        </p>
      </motion.div>

      <div className="small-cards-container">
  <div className="cards-grid">
    {/* Left-most */}
    <div className="s-card s-card-4"><img src="/codepen.svg" alt="CodePen" /></div>

    {/* Next left */}
    <div className="s-card s-card-2"><img className="bard-img" src="/Bard2.svg" alt="Bard" /></div>

    {/* Center */}
    <div className="s-card s-card-1"><img src="/openai.svg" alt="OpenAI" /></div>

    {/* Next right */}
    <div className="s-card s-card-3"><img src="/deepseek.svg" alt="DeepSeek" /></div>

    {/* Right-most */}
    <div className="s-card s-card-5"><img src="/youtube.svg" alt="YouTube" /></div>
  </div>
</div>

    </section>
  );
};

export default MyPartners;
