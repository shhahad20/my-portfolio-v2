import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import "../styles/componentsCards.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import {  useEffect, useState } from "react";
import { fetchComponents } from "../redux/slices/itemsSlice";
import LoadingSpinner from "./LoadingSpinner";
import SearchSortFilter from "./SearchSortFilter";

const ComponentsCards = () => {
  // const [search, setSearch] = useState('');
  // const [sortField, setSortField] = useState('created_at');
  // const [sortOrder, setSortOrder] = useState('desc');
  // const [limit, setLimit] = useState(9);

  const dispatch = useDispatch<AppDispatch>();
  const { components, loading, error } = useSelector(
    (state: RootState) => state.items
  );
  const [loadedVideos, setLoadedVideos] = useState<{ [key: string]: boolean }>(
    {}
  );
  const handleVideoLoaded = (id: string) => {
    setLoadedVideos((prev) => ({ ...prev, [id]: true }));
  };
  // State for controlled parameters
  const [searchParams, setSearchParams] = useState({
    sortField: 'created_at',
    sortOrder: 'desc',
    limit: 9
  });

  useEffect(() => {
    dispatch(fetchComponents(searchParams));
  }, [dispatch, searchParams]);

  const handleSearchSubmit = (searchTerm: string) => {
    setSearchParams(prev => ({ ...prev, search: searchTerm }));
  };

  const handleSortChange = (sortField: string, sortOrder: string) => {
    setSearchParams(prev => ({ ...prev, sortField, sortOrder }));
  };

  const handleLimitChange = (limit: number) => {
    setSearchParams(prev => ({ ...prev, limit }));
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
        {/* {loading && <p>Loading components...</p>} */}
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
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                {item.preview_url && (
                  <div
                    className="component-card__preview"
                    // style={{ position: "relative" }}
                  >
                    {/* Show spinner overlay until video is loaded */}
                    {!loadedVideos[item.id] && (
                      <div
                        className="loading-overlay"
                        // style={{
                        //   position: "absolute",
                        //   top: 0,
                        //   left: 0,
                        //   right: 0,
                        //   bottom: 0,
                        //   display: "flex",
                        //   alignItems: "center",
                        //   justifyContent: "center",
                        //   zIndex: 2,
                        // }}
                      >
                        <LoadingSpinner size={40} color="#202020" />
                      </div>
                    )}
                    <video
                      className="component-card__preview-media"
                      src={item.preview_url}
                      muted
                      loop
                      preload="metadata"
                      onLoadedData={() => handleVideoLoaded(item.id)}
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => e.currentTarget.pause()}
                    />
                  </div>
                )}
                {/* <div className="component-card__grid"></div> */}
                <div className="component-card__content">
                  {/* <div className="component-card__header">
                    <div className="component-card__category">
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
                  </div>
                  </div> */}
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
