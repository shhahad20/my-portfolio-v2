import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import "./index.css";
import App from "./App.tsx";
import store from "./redux/store.ts";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Components from "./pages/Components.tsx";
// import Projects from "./pages/Projects.tsx";
import ProjectDetail from "./26/ProjectDetails.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/components" element={<Components />} />
          {/* <Route path="/projects" element={<Projects />} /> */}
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
