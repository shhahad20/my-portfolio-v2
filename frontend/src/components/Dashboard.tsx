// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useDispatch, useSelector } from "react-redux";
// import "../styles/dashboard.scss";
// import { AppDispatch, RootState } from "../redux/store";
// import {
//   fetchComponents,
//   fetchRecent,
//   fetchRepos,
//   fetchSocialMedia,
// } from "../redux/slices/itemsSlice";
// import { Link } from "react-router-dom";
// import FlipLink from "./AnimatedHeader ";

// const Dashboard = () => {
//   const { components, repositories, social_media, recent, error, loading } = useSelector(
//     (state: RootState) => state.items
//   );
//   const [isMobile, setIsMobile] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("recent");

//   // Track scroll position and direction
//   const [scrollY, setScrollY] = useState(window.scrollY);
//   const [isScrollingDown, setIsScrollingDown] = useState(true);

//   const dispatch = useDispatch<AppDispatch>();

//   useEffect(() => {
//     console.log(`Fetching data for: ${selectedCategory}`);
//     if (selectedCategory === "recent") {
//       dispatch(fetchRecent());
//     } else if (selectedCategory === "components") {
//       dispatch(fetchComponents());
//     } else if (selectedCategory === "repositories") {
//       dispatch(fetchRepos());
//     } else if (selectedCategory === "social_media") {
//       dispatch(fetchSocialMedia());
//     }
//   }, [dispatch, selectedCategory]);

//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;
//       setIsScrollingDown(currentScrollY > scrollY);
//       setScrollY(currentScrollY);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [scrollY]);

//   // Check for mobile view on mount and resize
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };

//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   // Sidebar visibility: if on mobile, hide sidebar by default; on desktop, always show it.
//   const [isSidebarVisible, setIsSidebarVisible] = useState(true);
//   useEffect(() => {
//     if (isMobile) {
//       setIsSidebarVisible(false);
//     } else {
//       setIsSidebarVisible(true);
//     }
//   }, [isMobile]);

//   if (loading) {
//     return <div className="dashboard-loading">Loading...</div>;
//   }

//   if (error) {
//     return <div className="dashboard-error">Error: {error}</div>;
//   }

//   return (
//     <div className={`dashboard ${isMobile ? "mobile" : ""}`}>
//       {/* Header with conditional class based on scroll direction */}
//       <motion.div
//         className={`header-content ${isScrollingDown ? "scrolling-down" : ""}`}
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         viewport={{ once: true, amount: 0.2 }}
//       >
//         {isMobile && (
//           // Hamburger button toggles sidebar visibility on mobile
//           <button
//             className="sidebar-toggle"
//             onClick={() => setIsSidebarVisible(!isSidebarVisible)}
//           >
//             {isSidebarVisible ? "Hide Menu" : "Show Menu"}
//           </button>
//         )}
//         <div className="flip">
//           <div className="flip-1">
//             <FlipLink href="#">Code</FlipLink>
//             <FlipLink href="#">with</FlipLink>
//           </div>
//           <FlipLink href="#">Passion</FlipLink>
//         </div>
//       </motion.div>

//       <motion.div
//         className="dashboard__container"
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         viewport={{ once: true, amount: 0.2 }}
//       >
//         {(!isMobile || isSidebarVisible) && (
//           <aside className="dashboard__sidebar">
//             <div>
//               <ul>
//                 <li onClick={() => setSelectedCategory("recent")}>
//                   <img src="/recently.svg" alt="Recently icon" /> Recently
//                 </li>
//                 <li onClick={() => setSelectedCategory("repositories")}>
//                   <img src="/repo.svg" alt="Repository icon" /> Repositories
//                 </li>
//                 <li onClick={() => setSelectedCategory("components")}>
//                   <img src="/component.svg" alt="Components icon" /> Components
//                 </li>
//                 <li onClick={() => setSelectedCategory("social_media")}>
//                   <img src="/social-media.svg" alt="Social Media icon" /> Social Media News
//                 </li>
//               </ul>
//             </div>
//             <div className="dashboard__user">Shahad Athawa</div>
//           </aside>
//         )}

//         <main className="dashboard__content">
//           {selectedCategory === "recent" && (
//             <>
//               {[...recent.repositories, ...recent.components, ...recent.social_media].map((item, index) => {
//                 const previewUrl = item.preview_url || "";
//                 const isVideo = previewUrl.endsWith(".mp4");
//                 return (
//                   <Link key={`item-${index}`} to={item.url} target="_blank">
//                     <div className="dashboard__card">
//                       <div className="image-container">
//                         {isVideo ? (
//                           <video
//                             src={previewUrl}
//                             className="live-preview"
//                             muted
//                             loop
//                             preload="none"
//                             onMouseEnter={(e) => e.currentTarget.play()}
//                             onMouseLeave={(e) => e.currentTarget.pause()}
//                           />
//                         ) : previewUrl.includes("embed") ? (
//                           <iframe
//                             src={previewUrl}
//                             className="live-preview"
//                             frameBorder="0"
//                             allowFullScreen
//                             scrolling="no"
//                             style={{ width: "100%", height: "100%", border: "none", overflow: "hidden" }}
//                           />
//                         ) : /\.(jpg|jpeg|png|gif|webp)$/.test(previewUrl) ? (
//                           <img src={previewUrl} alt="Preview" className="live-preview" />
//                         ) : (
//                           <iframe
//                             src={previewUrl}
//                             className="live-preview"
//                             frameBorder="0"
//                             allowFullScreen
//                             scrolling="no"
//                             style={{ width: "100%", height: "100%", border: "none", overflow: "hidden" }}
//                           />
//                         )}
//                       </div>
//                       <div className="dashboard__card-content">
//                         <p>
//                           {"name" in item ? item.name : "title" in item ? item.title : item.content}
//                         </p>
//                       </div>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </>
//           )}

//           {selectedCategory === "repositories" &&
//             repositories?.map((repo, index) => (
//               <Link key={index} to={repo.url} target="_blank">
//                 <div className="dashboard__card">
//                   <div className="image-container">
//                     <video
//                       src={repo.preview_url}
//                       className="live-preview"
//                       muted
//                       loop
//                       preload="none"
//                       onMouseEnter={(e) => e.currentTarget.play()}
//                       onMouseLeave={(e) => e.currentTarget.pause()}
//                     />
//                   </div>
//                   <div className="dashboard__card-content">
//                     <p>{repo.name}</p>
//                   </div>
//                 </div>
//               </Link>
//             ))}

//           {selectedCategory === "components" &&
//             components?.map((component, index) => {
//               const previewUrl = component.preview_url || "";
//               const isVideo = previewUrl.endsWith(".mp4");
//               const isEmbed = /(youtube\.com\/embed|vimeo\.com\/embed|dailymotion\.com\/embed|linkedin\.com\/embed|codepen\.io\/embed)/.test(previewUrl);
//               const isImage = /\.(jpg|jpeg|png|gif|webp)$/.test(previewUrl);

//               return (
//                 <Link key={index} to={component.url} target="_blank">
//                   <div className="dashboard__card">
//                     <div className="image-container">
//                       {isVideo ? (
//                         <video
//                           src={previewUrl}
//                           className="live-preview"
//                           muted
//                           loop
//                           preload="none"
//                           onMouseEnter={(e) => e.currentTarget.play()}
//                           onMouseLeave={(e) => e.currentTarget.pause()}
//                         />
//                       ) : isEmbed ? (
//                         <iframe
//                           src={previewUrl}
//                           className="live-preview"
//                           frameBorder="0"
//                           allowFullScreen
//                           scrolling="no"
//                           style={{ width: "100%", height: "100%", border: "none", overflow: "hidden" }}
//                         />
//                       ) : isImage ? (
//                         <img src={previewUrl} alt="Preview" className="live-preview" />
//                       ) : (
//                         <iframe
//                           src={previewUrl}
//                           className="live-preview"
//                           frameBorder="0"
//                           allowFullScreen
//                           scrolling="no"
//                           style={{ width: "100%", height: "100%", border: "none", overflow: "hidden" }}
//                         />
//                       )}
//                     </div>
//                     <div className="dashboard__card-content">
//                       <p>{component.title}</p>
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })}

//           {selectedCategory === "social_media" &&
//             social_media.map((social, index) => {
//               const previewUrl = social.preview_url || "";
//               const isVideo = previewUrl.endsWith(".mp4");
//               const isEmbed = /(youtube\.com\/embed|vimeo\.com\/embed|dailymotion\.com\/embed|linkedin\.com\/embed|codepen\.io\/embed)/.test(previewUrl);
//               const isImage = /\.(jpg|jpeg|png|gif|webp)$/.test(previewUrl);

//               return (
//                 <Link key={index} to={social.url} target="_blank">
//                   <div className="dashboard__card">
//                     <div className="image-container">
//                       {isVideo ? (
//                         <video
//                           src={previewUrl}
//                           className="live-preview"
//                           muted
//                           loop
//                           preload="none"
//                           onMouseEnter={(e) => e.currentTarget.play()}
//                           onMouseLeave={(e) => e.currentTarget.pause()}
//                         />
//                       ) : isEmbed ? (
//                         <iframe
//                           src={previewUrl}
//                           className="live-preview"
//                           frameBorder="0"
//                           allowFullScreen
//                           scrolling="no"
//                           style={{ width: "100%", height: "100%", border: "none", overflow: "hidden" }}
//                         />
//                       ) : isImage ? (
//                         <img src={previewUrl} alt="Preview" className="live-preview" />
//                       ) : (
//                         <iframe
//                           src={previewUrl}
//                           className="live-preview"
//                           frameBorder="0"
//                           allowFullScreen
//                           scrolling="no"
//                           style={{ width: "100%", height: "100%", border: "none", overflow: "hidden" }}
//                         />
//                       )}
//                     </div>
//                     <div className="dashboard__card-content">
//                       <p>{social.content}</p>
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })}
//         </main>
//       </motion.div>
//     </div>
//   );
// };

// export default Dashboard;
