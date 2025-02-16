import FlipLink from "./AnimatedHeader ";
import { motion } from "framer-motion";
import "../styles/contact.scss";
import { useState } from "react";

const Contact = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("shahadaltharwa@gmail.com");
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000); // Hide message after 2 seconds
  };

  return (
    <section id="contact">
      <motion.div
        className="header-content"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="between-lines">
          <div>
            <h1 className="contact-header">Contact</h1>
          </div>
        </div>
        <div className="flip">
          <FlipLink href="#">Let's</FlipLink>
          <FlipLink href="#">Connect</FlipLink>
        </div>
      </motion.div>

      <motion.div
        className="conatct-container"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="email-container">
          <div className="email" onClick={handleCopy}>
            <h3>My Email Address</h3>
            {copied && <span className="copied-message">Copied!</span>}
          </div>
        </div>
        <div className="soical-media">
          <ul>
            <li>
              <a
                href="https://www.linkedin.com/in/shahadaltharwa/"
                aria-label="linkedin"
              >
                <img src="/linkedin.svg" alt="linkedin" />
              </a>
            </li>
            <li>
              <a href="https://www.behance.net/shhahad20" aria-label="Behance">
                <img src="/behance.svg" alt="Behance" />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/dev.shahad/"
                aria-label="instagram"
              >
                <img src="/instagram.svg" alt="instagram" />
              </a>
            </li>
            <li>
              <a href="https://github.com/shhahad20" aria-label="GitHub">
                <img src="/github-icon.svg" alt="GitHub" />
              </a>
            </li>
          </ul>
        </div>
      </motion.div>
    </section>
  );
};
export default Contact;
