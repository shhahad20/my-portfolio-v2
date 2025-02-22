import { motion } from 'framer-motion';
import '../styles/animatedLink.scss';

const AnimatedLink = ({ linkText, hoverText, href, ...props  }) => {
  const defaultTextVariants = {
    initial: { y: 0 },
    hover: { y: "-100%", transition: { duration: 0.3 } }
  };

  const hoverTextVariants = {
    initial: { y: "100%" },
    hover: { y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.a
      href={href}
      className="animated-link"
      whileHover="hover"
      initial="initial"
      {...props}
    >
      <div className="text-wrapper">
        <motion.span className="default-text" variants={defaultTextVariants}>
          {linkText}
        </motion.span>
        <motion.span className="hover-text" variants={hoverTextVariants}>
          {hoverText}
        </motion.span>
      </div>
    </motion.a>
  );
};

export default AnimatedLink;
