import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import "../styles/componentsCards.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { useEffect } from "react";
import { fetchComponents } from "../redux/slices/itemsSlice";

// interface ComponentItem {
//   id: number;
//   title: string;
//   label: string;
//   details: string;
//   preview: string;
//   link: string;
//   // Add additional properties as needed
// }

const ComponentsCards = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { components, loading, error } = useSelector(
    (state: RootState) => state.items
  );

  useEffect(() => {
    dispatch(fetchComponents());
  }, [dispatch]);

  const renderPreview = (previewUrl: string, title: string) => {
    const lowerUrl = previewUrl.toLowerCase();
    // Adjust conditions if needed (e.g., include other video extensions)
    const isVideo =
      lowerUrl.endsWith(".mp4") ||
      lowerUrl.endsWith(".webm") ||
      lowerUrl.endsWith(".ogg");

    if (isVideo) {
      return (
        <video
          className="component-card__preview-media"
          src={previewUrl}
          muted
          loop
          preload="none"
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => e.currentTarget.pause()}
        />
      );
    } else {
      return (
        <img
          className="component-card__preview-media"
          src={previewUrl}
          alt={title}
        />
      );
    }
  };

  return (
    <section className="components-page">
      <h1 className="second-header">UI Gallery</h1>
      <div className="components-cards-container">
      {loading && <p>Loading components...</p>}
      {error && <p>Error: {error}</p>}
      {components.length > 0 &&
        components.map((item) => (
          <motion.div
            key={item.id}
            className="component-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <Link
              to={item.url} // Use the URL from fetched data
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
            >
               {item.preview_url && (
                <div className="component-card__preview">
                  {renderPreview(item.preview_url, item.title)}
                </div>
              )}
              <div className="component-card__grid"></div>
              <div className="component-card__content">
                <div className="component-card__header">
                  {/* <div className="component-card__category">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 17L17 7M17 7H7M17 7V17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Recently
                  </div> */}
                </div>
                <div className="component-card__bottom">
                  <h2 className="component-card__title">{item.title}</h2>
                  {item.label && (
                    <div className="component-card__label">{item.label}</div>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
        </div>
    </section>
  );
};

export default ComponentsCards;
