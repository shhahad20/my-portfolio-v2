import { HTMLMotionProps, motion } from "framer-motion";
import "../styles/animatedLink.scss";

interface AnimatedLinkProps extends HTMLMotionProps<"a"> {
  linkText: string;
  hoverText: string;
  href: string;
  linkColor?: string;
  hoverLinkColor?: string;
}

const AnimatedLink: React.FC<AnimatedLinkProps> = ({
  linkText,
  hoverText,
  href,
  linkColor = "#000000",
  hoverLinkColor = "#6b7280",
  style,
  ...props
}) => {
  const defaultTextVariants = {
    initial: { y: 0 },
    hover: {
      y: "-100%",
      transition: { duration: 0.3 },
    },
  };

  const hoverTextVariants = {
    initial: { y: "100%" },
    hover: {
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.a
      href={href}
      className="animated-link"
      whileHover="hover"
      initial="initial"
      style={
        {
          "--link-color": linkColor,
          "--hover-link-color": hoverLinkColor,
          ...style,
        } as React.CSSProperties
      }
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