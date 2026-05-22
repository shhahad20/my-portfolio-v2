import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

import "./index.css";
import App from "./App.tsx";
import store from "./redux/store.ts";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Components from "./pages/Components.tsx";
// import Projects from "./pages/Projects.tsx";
import ProjectDetail from "./26/ProjectDetails.tsx";
import BlogPage from "./26/Blog.tsx";
import BlogPostPage from "./26/BlogPost.tsx";

const prefersReducedMotion =
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

const LENIS_EASING = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        {prefersReducedMotion ? (
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/components" element={<Components />} />
            {/* <Route path="/projects" element={<Projects />} /> */}
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
          </Routes>
        ) : (
          <ReactLenis
            root
            options={{
              duration: 1.2,
              easing: LENIS_EASING,
              smoothWheel: true,
              wheelMultiplier: 1.0,
              touchMultiplier: 2,
              infinite: false,
            }}
          >
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/components" element={<Components />} />
              {/* <Route path="/projects" element={<Projects />} /> */}
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
            </Routes>
          </ReactLenis>
        )}
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
