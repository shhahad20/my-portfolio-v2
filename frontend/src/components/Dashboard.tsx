import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import "../styles/dashboard.scss";
import { AppDispatch, RootState } from "../redux/store";
import {
  fetchComponents,
  fetchRecent,
  fetchRepos,
  fetchSocialMedia,
} from "../redux/slices/itemsSlice";
import { Link } from "react-router-dom";

const transitionSettings = { duration: 0.5, ease: "easeOut" };

const Dashboard = () => {
  const { components, repositories, social_media, recent } = useSelector(
    (state: RootState) => state.items
  );
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("recent");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log(`Fetching data for: ${selectedCategory}`);
    if (selectedCategory == "recent") {
      dispatch(fetchRecent());
    } else if (selectedCategory == "components") {
      dispatch(fetchComponents());
    } else if (selectedCategory == "repositories") {
      dispatch(fetchRepos());
    } else if (selectedCategory == "social_media") {
      dispatch(fetchSocialMedia());
    }
  }, [dispatch, selectedCategory]);

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
  console.log("Components:", components);
  console.log("Repositories:", repositories);
  console.log("Social Media:", social_media);
  console.log("Recent:", recent);

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
          {selectedCategory === "recent" && (
            <>
              {[
                ...recent.repositories,
                ...recent.components,
                ...recent.social_media,
              ].map((item, index) => {
                const previewUrl = item.preview_url || ""; // Ensure preview_url exists
                const isVideo = previewUrl.endsWith(".mp4");
                return (
                  <Link to={item.url} target="_blank">
                  <motion.div
                    key={`item-${index}`}
                    className="dashboard__card"
                    initial={{ opacity: 0.5, y: 20, scale: cardInitialScale }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{
                      ...transitionSettings,
                      delay: 0.05 + index * 0.05,
                    }}
                  >
                    <div className="image-container">
                      {isVideo ? (
                        <video
                          src={previewUrl}
                          className="live-preview"
                          muted
                          loop
                          preload="none"
                          onMouseEnter={(e) => e.currentTarget.play()}
                          onMouseLeave={(e) => e.currentTarget.pause()}
                        />
                      ) : previewUrl.includes("embed") ? (
                        <iframe
                          src={previewUrl}
                          className="live-preview"
                          frameBorder="0"
                          allowFullScreen
                          scrolling="no"
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            overflow: "hidden",
                          }}
                        />
                      ) : /\.(jpg|jpeg|png|gif|webp)$/.test(previewUrl) ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="live-preview"
                        />
                      ) : (
                        <iframe
                          src={previewUrl}
                          className="live-preview"
                          frameBorder="0"
                          allowFullScreen
                          scrolling="no"
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            overflow: "hidden",
                          }}
                        />
                      )}
                    </div>
                    <div className="dashboard__card-content">
                      <p>
                        {"name" in item
                          ? item.name // If it's a repository
                          : "title" in item
                          ? item.title // If it's a component
                          : item.content}{" "}
                        {/* If it's social media */}
                      </p>
                    </div>
                  </motion.div></Link>
                );
              })}
            </>
          )}

          {selectedCategory === "repositories" &&
            repositories?.map((repo, index) => (
              <Link to={repo.url} target="_blank">
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
                <div className="image-container">
                  <video
                    src={repo.preview_url}
                    className="live-preview"
                    muted
                    loop
                    preload="none"
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  />
                </div>
                <div className="dashboard__card-content">
                  <p>{repo.name}</p>
                  {/* <a href={component.url} target="_blank">
                    View Component
                  </a> */}
                </div>
              </motion.div> </Link>
            ))}

          {selectedCategory === "components" &&
            components?.map((component, index) => {
              const previewUrl = component.preview_url || ""; // Ensure preview_url exists
              const isVideo = previewUrl.endsWith(".mp4");
              const isEmbed =
                /(youtube\.com\/embed|vimeo\.com\/embed|dailymotion\.com\/embed|linkedin\.com\/embed|codepen\.io\/embed)/.test(
                  previewUrl
                );
              const isImage = /\.(jpg|jpeg|png|gif|webp)$/.test(previewUrl);

              return (
                <Link to={component.url} target="_blank">
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
                  <div className="image-container">
                    {isVideo ? (
                      <video
                        src={previewUrl}
                        className="live-preview"
                        muted
                        loop
                        preload="none"
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => e.currentTarget.pause()}
                      />
                    ) : isEmbed ? (
                      <iframe
                        src={previewUrl}
                        className="live-preview"
                        frameBorder="0"
                        allowFullScreen
                        scrolling="no"
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "none",
                          overflow: "hidden",
                        }}
                      />
                    ) : isImage ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="live-preview"
                      />
                    ) : (
                      <iframe
                        src={previewUrl}
                        className="live-preview"
                        frameBorder="0"
                        allowFullScreen
                        scrolling="no"
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "none",
                          overflow: "hidden",
                        }}
                      />
                    )}
                  </div>
                  <div className="dashboard__card-content">
                    <p>{component.title}</p>
                  </div>
                </motion.div></Link>
              );
            })}

          {selectedCategory === "social_media" &&
            social_media.map((social, index) => {
              const previewUrl = social.preview_url || "";
              const isVideo = previewUrl.endsWith(".mp4");
              const isEmbed =
                /(youtube\.com\/embed|vimeo\.com\/embed|dailymotion\.com\/embed|linkedin\.com\/embed|codepen\.io\/embed)/.test(
                  previewUrl
                );
              const isImage = /\.(jpg|jpeg|png|gif|webp)$/.test(previewUrl);

              return (
                <Link to={social.url} target="_blank">
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
                  <div className="image-container">
                    {isVideo ? (
                      <video
                        src={previewUrl}
                        className="live-preview"
                        muted
                        loop
                        preload="none"
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => e.currentTarget.pause()}
                      />
                    ) : isEmbed ? (
                      <iframe
                        src={previewUrl}
                        className="live-preview"
                        frameBorder="0"
                        allowFullScreen
                        scrolling="no"
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "none",
                          overflow: "hidden",
                        }}
                      />
                    ) : isImage ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="live-preview"
                      />
                    ) : (
                      <iframe
                        src={previewUrl}
                        className="live-preview"
                        frameBorder="0"
                        allowFullScreen
                        scrolling="no"
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "none",
                          overflow: "hidden",
                        }}
                      />
                    )}
                  </div>
                  <div className="dashboard__card-content">
                    <p>{social.content}</p>
                  </div>
                </motion.div> </Link>
              );
            })}
        </motion.main>
      </div>
    </div>
  );
};
export default Dashboard;
