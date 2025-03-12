import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { useEffect, useState } from "react";
import { fetchComponents } from "../redux/slices/itemsSlice";
import SearchSortFilter from "./SearchSortFilter";
import "../styles/componentsCards.scss";

const ComponentsCards = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { components, loading, error } = useSelector(
    (state: RootState) => state.items
  );
  
  // State for controlled parameters
  const [searchParams, setSearchParams] = useState({
    sortField: "created_at",
    sortOrder: "desc",
    limit: 9,
  });
  
  // State to determine if the device is hover-capable (desktop) or not (touch)
  const [isHoverable, setIsHoverable] = useState(true);

  useEffect(() => {
    dispatch(fetchComponents(searchParams));
  }, [dispatch, searchParams]);

  useEffect(() => {
    // Check if the device supports hover and a fine pointer
    if (window.matchMedia) {
      const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
      setIsHoverable(mq.matches);
    }
  }, []);

  // For mobile/tablet devices: use Intersection Observer to play/pause video based on viewport visibility
  useEffect(() => {
    if (!isHoverable) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Assert that the target is an HTMLVideoElement
            const video = entry.target as HTMLVideoElement;
            if (entry.isIntersecting) {
              video.play();
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.5 } // play if at least 50% visible
      );
  
      // Specify the generic type here
      const videos = document.querySelectorAll<HTMLVideoElement>(".component-card__preview-media");
      videos.forEach((video) => observer.observe(video));
  
      return () => {
        observer.disconnect();
      };
    }
  }, [isHoverable, components]);
  

  const handleSearchSubmit = (searchTerm: string) => {
    setSearchParams((prev) => ({ ...prev, search: searchTerm }));
  };

  const handleSortChange = (sortField: string, sortOrder: string) => {
    setSearchParams((prev) => ({ ...prev, sortField, sortOrder }));
  };

  const handleLimitChange = (limit: number) => {
    setSearchParams((prev) => ({ ...prev, limit }));
  };

  return (
    <section className="components-page">
      <h1 className="second-header">UI Gallery</h1>
      <SearchSortFilter
        onSearchSubmit={handleSearchSubmit}
        onSortChange={handleSortChange}
        onLimitChange={handleLimitChange}
        isLoading={loading}
      />
      {loading && <p>Loading components...</p>}
      <div className="components-cards-container">
        {error && <p className="error-msg">⚠ Error: {error}</p>}
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
              <motion.div key={item.id} className="component-preview">
                <Link
                  to={item.url}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  {item.preview_url && (
                    <div className="component-card__preview">
                      <video
                        className="component-card__preview-media"
                        src={item.preview_url}
                        muted
                        loop
                        playsInline
                        preload="auto"
                        // For desktop: play/pause on hover
                        onMouseEnter={
                          isHoverable ? (e) => e.currentTarget.play() : undefined
                        }
                        onMouseLeave={
                          isHoverable ? (e) => e.currentTarget.pause() : undefined
                        }
                        // On mobile/tablet, Intersection Observer handles play/pause
                      />
                    </div>
                  )}
                </Link>
              </motion.div>
              <div className="component-card__details">
                <h2 className="component-card__title">{item.title}</h2>
                {item.label && (
                  <div className="component-card__label">{item.label}</div>
                )}
              </div>
            </motion.div>
          ))}
      </div>
    </section>
  );
};

export default ComponentsCards;
