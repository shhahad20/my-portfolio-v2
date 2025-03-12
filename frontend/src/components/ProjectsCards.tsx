import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { useEffect, useState } from "react";
import { fetchRepos } from "../redux/slices/itemsSlice";
// import LoadingSpinner from "./LoadingSpinner";
import SearchSortFilter from "./SearchSortFilter";
import "../styles/componentsCards.scss";

const ProjectsCards = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { repositories, loading, error } = useSelector(
    (state: RootState) => state.items
  );
  // const [loadedVideos, setLoadedVideos] = useState<{ [key: string]: boolean }>(
  //   {}
  // );
  // const handleVideoLoaded = (id: string) => {
  //   setLoadedVideos((prev) => ({ ...prev, [id]: true }));
  // };

  // State for controlled parameters
  const [searchParams, setSearchParams] = useState({
    sortField: "created_at",
    sortOrder: "desc",
    limit: 9,
  });

  useEffect(() => {
    dispatch(fetchRepos(searchParams));
  }, [dispatch, searchParams]);

  const handleSearchSubmit = (searchTerm: string) => {
    setSearchParams((prev) => ({ ...prev, search: searchTerm }));
  };

  const handleSortChange = (sortField: string, sortOrder: string) => {
    setSearchParams((prev) => ({ ...prev, sortField, sortOrder }));
  };

  const handleLimitChange = (limit: number) => {
    setSearchParams((prev) => ({ ...prev, limit }));
  };

  // Determine if the device is hover-capable (desktop) or not (touch/mobile)
  const [isHoverable, setIsHoverable] = useState(true);
  useEffect(() => {
    if (window.matchMedia) {
      const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
      setIsHoverable(mq.matches);
    }
  }, []);

  // Use Intersection Observer for mobile/tablet: play/pause video based on viewport visibility
  useEffect(() => {
    if (!isHoverable) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Assert the target as HTMLVideoElement
            const video = entry.target as HTMLVideoElement;
            if (entry.isIntersecting) {
              video.play();
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.5 } // Adjust threshold as needed
      );

      // Select all video elements of interest
      const videos = document.querySelectorAll<HTMLVideoElement>(
        ".component-card__preview-media"
      );
      videos.forEach((video) => observer.observe(video));

      return () => {
        observer.disconnect();
      };
    }
  }, [isHoverable, repositories]);

  return (
    <section className="components-page">
      <h1 className="second-header">Projects Gallery</h1>
      <SearchSortFilter
        onSearchSubmit={handleSearchSubmit}
        onSortChange={handleSortChange}
        onLimitChange={handleLimitChange}
        isLoading={loading}
      />
      {loading && <p>Loading projects...</p>}
      <div className="components-cards-container">
        {error && <p className="error-msg">⚠ Error: {error}</p>}
        {repositories.length > 0 &&
          repositories.map((item) => (
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
                      {/* {!loadedVideos[item.id] && (
                        <div className="loading-overlay">
                          <LoadingSpinner size={40} color="#202020" />
                        </div>
                      )} */}
                      <video
                        className="component-card__preview-media"
                        src={item.preview_url}
                        muted
                        loop
                        playsInline
                        preload="auto"
                        // onLoadedData={() => handleVideoLoaded(item.id)}
                        // Desktop: play on hover, pause on mouse leave.
                        onMouseEnter={
                          isHoverable
                            ? (e) => e.currentTarget.play()
                            : undefined
                        }
                        onMouseLeave={
                          isHoverable
                            ? (e) => e.currentTarget.pause()
                            : undefined
                        }
                        // On mobile/tablet, Intersection Observer handles play/pause.
                      />
                    </div>
                  )}
                </Link>
              </motion.div>
              <div className="component-card__details">
                <h2 className="component-card__title">{item.name}</h2>
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

export default ProjectsCards;
