import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/dashboard.scss";

// Define a container variant that will stagger its children
// const containerVariants = {
//   hidden: {},
//   visible: {
//     transition: {
//       staggerChildren: 0.1, // Each child will start 0.1s after the previous one
//     },
//   },
// };

// Define a common variant for elements (sidebar, main content, and cards)
// const elementVariants = {
//   hidden: { opacity: 0.5, y: 20, scale: 4 }, // Starts off slightly larger
//   visible: {
//     opacity: 1,
//     y: 0,
//     scale: 1, // Ends at normal scale
//     transition: { duration: 0.5, ease: "easeOut" },
//   },
// };


const transitionSettings = { duration: 0.5, ease: "easeOut" };


const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(false);
  // When pulseTrigger becomes true, the parent's animate prop will change to "pulse"
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

    // Conditional scale values: use lower scaling on mobile screens
    const asideInitialScale = isMobile ? 1.1 : 1.5;
    const mainInitialScale = isMobile ? 1.1 : 1.5;
    const cardInitialScale = isMobile ? 1.1 : 1.3;

  return (
    <div className="dashboard">
      <div className="header__container">
        <h1 className="dashboard__title">
          Code with Passion Build with Precision
        </h1>
      </div>

      <div
        className="dashboard__container"
      >
        <motion.aside
          className="dashboard__sidebar"
          initial={{ opacity: 0.5, y: 20, scale: asideInitialScale }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={transitionSettings}
        >
          <div>
            <img
              className="logo-white"
              src="/logo-white.svg"
              alt="Logo in white"
            />
            <ul>
              <li>
                <img src="/recently.svg" alt="Recently icon" /> Recently
              </li>
              <li>
                <img src="/repo.svg" alt="Repository icon" /> Repositories
              </li>
              <li>
                <img src="/component.svg" alt="Components icon" /> Components
              </li>
              <li>
                <img src="/social-media.svg" alt="Social Media icon" /> Social
                Media News
              </li>
            </ul>
          </div>

          <div className="dashboard__user">Shahad Athawa</div>
        </motion.aside>
        <motion.main
          className="dashboard__content"
          initial={{ opacity: 0.5, y: 20, scale: mainInitialScale  }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={transitionSettings}
        >
          {[...Array(isMobile ? 3 : 9)].map((_, index) => (
            <motion.div
              key={index}
              className="dashboard__card"
              
              initial={{ opacity: 0.5, y: 20, scale: cardInitialScale  }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{
                ...transitionSettings,
                delay: 0.05 + index * 0.05, // Creates a staggered effect
              }}
              
            >
              <div className="image-container"></div>
              <div className="dashboard__card-content">
                <p>Card Title Here</p>
              </div>
            </motion.div>
          ))}
        </motion.main>
      </div>
    </div>
  );
};
export default Dashboard;
