import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "../styles/dashboard.scss";

const transitionSettings = { duration: 0.5, ease: "easeOut" };

const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [data, setData] = useState({ repositories: [], components: [], social_media: [] });
  const [recentData, setRecentData] = useState({
    repositories: [],
    components: [],
    social_media: [],
  });
  const [selectedCategory, setSelectedCategory] = useState("recent");
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

  // Fetch data when category changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `http://localhost:3001/api/${selectedCategory}`;
        const response = await axios.get(url);
        console.log("Fetched Data:", response.data);
  
        // Ensure correct data assignment
        if (selectedCategory === "recent") {
          setRecentData({
            repositories: response.data.repositories || [],
            components: response.data.components || [],
            social_media: response.data.social_media || [],
          });
        } else {
          setData({
            repositories: response.data.repositories || [],
            components: response.data.components || [],
            social_media: response.data.social_media || [],
          });
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [selectedCategory]);

  return (
    <div className="dashboard">
      <div className="header__container">
        <h1 className="dashboard__title">
          Code with Passion Build with Precision
        </h1>
      </div>

      <div className="dashboard__container">
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
              <li onClick={() => setSelectedCategory("recent")}>
                <img src="/recently.svg" alt="Recently icon" /> Recently
              </li>
              <li onClick={() => setSelectedCategory("repositories")}>
                <img src="/repo.svg" alt="Repository icon" /> Repositories
              </li>
              <li onClick={() => setSelectedCategory("components")}>
                <img src="/component.svg" alt="Components icon" /> Components
              </li>
              <li onClick={() => setSelectedCategory("social_media")}>
                <img src="/social-media.svg" alt="Social Media icon" /> Social
                Media News
              </li>
            </ul>
          </div>

          <div className="dashboard__user">Shahad Athawa</div>
        </motion.aside>
        <motion.main
          className="dashboard__content"
          initial={{ opacity: 0.5, y: 20, scale: mainInitialScale }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={transitionSettings}
        >
          {selectedCategory === "recent" &&
            data.repositories?.map((repo, index) => (
              <motion.div
                key={index}
                className="dashboard__card"
                initial={{ opacity: 0.5, y: 20, scale: cardInitialScale }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{
                  ...transitionSettings,
                  delay: 0.05 + index * 0.05,
                }}
              >
                <div className="image-container"></div>
                <div className="dashboard__card-content">
                  <p>{repo.name}</p>
                  {/* <a href={repo.url} target="_blank">
                    View Repo
                  </a> */}
                </div>
              </motion.div>
            ))}

          {selectedCategory === "components" &&
            data.components?.map((component, index) => (
              <motion.div
                key={index}
                className="dashboard__card"
                initial={{ opacity: 0.5, y: 20, scale: cardInitialScale }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{
                  ...transitionSettings,
                  delay: 0.05 + index * 0.05,
                }}
              >
                <div className="image-container"></div>
                <div className="dashboard__card-content">
                  <p>{component.name}</p>
                  {/* <a href={component.url} target="_blank">
                    View Component
                  </a> */}
                </div>
              </motion.div>
            ))}

          {selectedCategory === "social-media" &&
            data.social_media?.map((social, index) => (
              <motion.div
                key={index}
                className="dashboard__card"
                initial={{ opacity: 0.5, y: 20, scale: cardInitialScale }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{
                  ...transitionSettings,
                  delay: 0.05 + index * 0.05,
                }}
              >
                <div className="image-container"></div>
                <div className="dashboard__card-content">
                  <p>{social.title}</p>
                  {/* <a href={social.url} target="_blank">
                    Read More
                  </a> */}
                </div>
              </motion.div>
            ))}
        </motion.main>
      </div>
    </div>
  );
};
export default Dashboard;
