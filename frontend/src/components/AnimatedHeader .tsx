import "../styles/animatedHeader.scss";

import { motion } from "framer-motion";

export const RevealLinks = () => {
  return (
    <section className="reveal-links">
      {/* <FlipLink href="#">Twitter</FlipLink>
      <FlipLink href="#">Linkedin</FlipLink>
      <FlipLink href="#">Facebook</FlipLink>
      <FlipLink href="#">Instagram</FlipLink> */}
    </section>
  );
};

const DURATION = 0.25;
const STAGGER = 0.025;

const FlipLink = ({ children, href }: { children: string; href: string}) => {
  return (
    <section className="reveal-links">
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      className="flip-link"
      style={{ lineHeight: 0.75 }}
    >
      <div>
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: { y: 0 },
              hovered: { y: "-100%" },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
      <div className="absolute-layer">
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: { y: "100%" },
              hovered: { y: 0 },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * i,
            }}
            key={i}
          >
            {l}
          </motion.span>
        ))}
      </div>
    </motion.a>
    </section>
  );
};
export default FlipLink;