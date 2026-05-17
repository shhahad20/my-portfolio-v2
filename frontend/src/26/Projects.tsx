import { useState, useRef, useEffect } from "react";
import "./style/projects.scss";
import { Project, fetchProjects } from "../redux/slices/projectsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import AnimatedLink from "../components/AnimatedLink";

/* ─── Data ──────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { id:1, label: "GITHUB ↗",    href: "https://github.com/shhahad20" },
  { id:2, label: "INSTAGRAM ↗", href: "https://www.instagram.com/shahad.th.designer/" },
  { id:3, label: "BEHANCE ↗",   href: "https://www.behance.net/shhahad20" },
];

export const FALLBACK_PROJECTS: Project[] = [
  { id: "fallback-0",  label: "Design Systems",     project_name: "Design Systems",     bg: "#c8cec5", accent: "#2d3a29", created_at: "", updated_at: "" },
  { id: "fallback-1",  label: "Motion Graphics",     project_name: "Motion Graphics",     bg: "#c5c8ce", accent: "#29303a", created_at: "", updated_at: "" },
  { id: "fallback-2",  label: "Brand Identity",      project_name: "Brand Identity",      bg: "https://puakrabhbhosdpyxfsfk.supabase.co/storage/v1/object/public/images/Hillside%2017.png", accent: "#3a2929", created_at: "", updated_at: "" },
  { id: "fallback-3",  label: "3D Visualization",    project_name: "3D Visualization",    bg: "#c5cece", accent: "#293a3a", created_at: "", updated_at: "" },
  { id: "fallback-4",  label: "Web Development",     project_name: "Web Development",     bg: "#cec8c5", accent: "#3a3029", created_at: "", updated_at: "" },
  { id: "fallback-5",  label: "Photography",         project_name: "Photography",         bg: "#c5c5ce", accent: "#29293a", created_at: "", updated_at: "" },
  { id: "fallback-6",  label: "UI/UX Research",      project_name: "UI/UX Research",      bg: "#cec5c8", accent: "#3a2930", created_at: "", updated_at: "" },
  { id: "fallback-7",  label: "Typography",          project_name: "Typography",          bg: "#c8cec5", accent: "#303a2d", created_at: "", updated_at: "" },
  { id: "fallback-8",  label: "Illustration",        project_name: "Illustration",        bg: "#cecec5", accent: "#3a3a29", created_at: "", updated_at: "" },
  { id: "fallback-9",  label: "Prototyping",         project_name: "Prototyping",         bg: "#c5c8c5", accent: "#2d302d", created_at: "", updated_at: "" },
  { id: "fallback-10", label: "Creative Coding",     project_name: "Creative Coding",     bg: "#c8c5ce", accent: "#30293a", created_at: "", updated_at: "" },
  { id: "fallback-11", label: "Video Editing",       project_name: "Video Editing",       bg: "#cec5ce", accent: "#3a293a", created_at: "", updated_at: "" },
  { id: "fallback-12", label: "Art Direction",       project_name: "Art Direction",       bg: "#c5cec8", accent: "#293a30", created_at: "", updated_at: "" },
  { id: "fallback-13", label: "Interaction Design",  project_name: "Interaction Design",  bg: "#cec8ce", accent: "#3a303a", created_at: "", updated_at: "" },
  { id: "fallback-14", label: "Data Visualization",  project_name: "Data Visualization",  bg: "#c5cec5", accent: "#293a29", created_at: "", updated_at: "" },
  { id: "fallback-15", label: "Product Design",      project_name: "Product Design",      bg: "#cec5c5", accent: "#3a2929", created_at: "", updated_at: "" },
  { id: "fallback-16", label: "Animation",           project_name: "Animation",           bg: "#c8c8ce", accent: "#30303a", created_at: "", updated_at: "" },
  { id: "fallback-17", label: "User Research",       project_name: "User Research",       bg: "#cecec8", accent: "#3a3a30", created_at: "", updated_at: "" },
  { id: "fallback-18", label: "Print Design",        project_name: "Print Design",        bg: "#c5c8ce", accent: "#293040", created_at: "", updated_at: "" },
  { id: "fallback-19", label: "AR / VR",             project_name: "AR / VR",             bg: "#cec8c5", accent: "#3a3029", created_at: "", updated_at: "" },
  { id: "fallback-20", label: "Copywriting",         project_name: "Copywriting",         bg: "#c8cec8", accent: "#303a30", created_at: "", updated_at: "" },
  { id: "fallback-21", label: "Concept Art",         project_name: "Concept Art",         bg: "#c8c5c8", accent: "#30293a", created_at: "", updated_at: "" },
  { id: "fallback-22", label: "Sound Design",        project_name: "Sound Design",        bg: "#c5c5c8", accent: "#292930", created_at: "", updated_at: "" },
  { id: "fallback-23", label: "Generative Art",      project_name: "Generative Art",      bg: "#c8c5c5", accent: "#302929", created_at: "", updated_at: "" },
];

const SATELLITES_DESKTOP = [
  { id: 0,  x: 51, y: 24 }, { id: 1,  x: 62, y: 31 }, { id: 2,  x: 67, y: 47 }, { id: 3,  x: 62, y: 63 },
  { id: 4,  x: 51, y: 70 }, { id: 5,  x: 40, y: 63 }, { id: 6,  x: 35, y: 47 }, { id: 7,  x: 40, y: 31 },
  { id: 8,  x: 51, y: 9  }, { id: 9,  x: 61, y: 12 }, { id: 10, x: 69, y: 20 }, { id: 11, x: 75, y: 33 },
  { id: 12, x: 77, y: 47 }, { id: 13, x: 75, y: 61 }, { id: 14, x: 69, y: 74 }, { id: 15, x: 61, y: 82 },
  { id: 16, x: 51, y: 85 }, { id: 17, x: 41, y: 82 }, { id: 18, x: 33, y: 74 }, { id: 19, x: 27, y: 61 },
  { id: 20, x: 25, y: 47 }, { id: 21, x: 27, y: 33 }, { id: 22, x: 33, y: 20 }, { id: 23, x: 41, y: 12 },
];

const SATELLITES_MOBILE = [
  { id: 0,  x: 18, y: 6  }, { id: 1,  x: 39, y: 6  }, { id: 2,  x: 63, y: 6  }, { id: 3,  x: 82, y: 6  },
  { id: 4,  x: 18, y: 18 }, { id: 5,  x: 39, y: 18 }, { id: 6,  x: 63, y: 18 }, { id: 7,  x: 82, y: 18 },
  { id: 8,  x: 18, y: 30 }, { id: 9,  x: 39, y: 30 }, { id: 10, x: 63, y: 30 }, { id: 11, x: 82, y: 30 },
  { id: 12, x: 18, y: 62 }, { id: 13, x: 39, y: 62 }, { id: 14, x: 63, y: 62 }, { id: 15, x: 82, y: 62 },
  { id: 16, x: 18, y: 74 }, { id: 17, x: 39, y: 74 }, { id: 18, x: 63, y: 74 }, { id: 19, x: 82, y: 74 },
  { id: 20, x: 18, y: 86 }, { id: 21, x: 39, y: 86 }, { id: 22, x: 63, y: 86 }, { id: 23, x: 82, y: 86 },
];

const CENTER_X = 51;
const CENTER_Y = 47;
const MOBILE_BREAKPOINT = 640;

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const isMedia = (src: string) =>
  typeof src === "string" && (src.startsWith("http") || src.startsWith("/"));

const isVideo = (src: string) =>
  isMedia(src) && /\.(mp4|webm|ogg)$/i.test(src);

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function WhatKeepsMeBusy() {
  const dispatch = useDispatch<AppDispatch>();

  const { projects, loading, error } = useSelector(
    (state: RootState) => state.projects,
  );

  // Fetch on mount — dispatching again is safe; add a loaded guard in the
  // slice's extraReducers if you want to prevent duplicate requests.
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const [hoverId, setHoverId] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Show fallback data while loading or on error so the layout is never empty
  const displayProjects  = projects.length > 0 ? projects : FALLBACK_PROJECTS;
  const visibleProjects  = displayProjects.slice(0, 24);

  /* ── Responsive layout switch ── */
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.innerWidth < MOBILE_BREAKPOINT
      : false,
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // Slice satellite positions to match however many projects are actually shown
  const satellites = (isMobile ? SATELLITES_MOBILE : SATELLITES_DESKTOP)
    .slice(0, visibleProjects.length);

  /* Small debounce so the preview doesn't flicker when moving between circles */
  const handleEnter = (id: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setHoverId(id);
  };

  const handleLeave = () => {
    timerRef.current = setTimeout(() => setHoverId(null), 60);
  };

  return (
    <div className="wkmb-root">

      {/* ── Header ───────────────────────────────────────────── */}
      <header className="wkmb-header">
        <div className="wkmb-title-block">
          <h1 className="wkmb-title">
            WHAT KEEPS<br />ME BUSY
          </h1>
          <span className="wkmb-page-num">02</span>
        </div>
        <nav className="wkmb-nav" aria-label="External links">
          {NAV_LINKS.map(({ label, href }) => (
            // <a
            //   key={label}
            //   href={href}
            //   className="wkmb-nav-link"
            //   target="_blank"
            //   rel="noopener noreferrer"
            // >
            //   {label}
            //   <span className="wkmb-arrow" aria-hidden="true">↗</span>
            // </a>
            <AnimatedLink
                linkText={label}
                hoverText={label}
                href={href}
              />
          ))}
        </nav>
      </header>

      {/* ── Circle Field ─────────────────────────────────────── */}
      <main
        className={`wkmb-field${isMobile ? " wkmb-field--mobile" : ""}${loading ? " wkmb-field--loading" : ""}`}
        aria-label="Portfolio projects"
        aria-busy={loading}
      >
        {/* Error banner — rendered in-field so the layout doesn't shift */}
        {error && (
          <p className="wkmb-error" role="alert">{error}</p>
        )}

        {/* Satellite circles */}
        {satellites.map((s, index) => {
          const project = visibleProjects[index];
          if (!project) return null;

          return (
            <div
              key={project.id}
              className={`wkmb-sat${hoverId === index ? " wkmb-sat--active" : ""}${loading ? " wkmb-sat--skeleton" : ""}`}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              onMouseEnter={() => handleEnter(index)}
              onMouseLeave={handleLeave}
              onTouchStart={() => handleEnter(index)}
              onTouchEnd={handleLeave}
              role="button"
              tabIndex={loading ? -1 : 0}
              aria-label={project.label}
              aria-disabled={loading}
              onKeyDown={(e) => !loading && e.key === "Enter" && handleEnter(index)}
              onFocus={() => !loading && handleEnter(index)}
              onBlur={handleLeave}
            >
              <span className="wkmb-sat-label">{project.label}</span>
            </div>
          );
        })}

        {/* Center circle — always shows idle prompt */}
        <div
          className="wkmb-center"
          style={{ left: `${CENTER_X}%`, top: `${CENTER_Y}%` }}
        >
          <div className="wkmb-center-label">
            <span className="wkmb-center-idle">
              Choose a circle<br />to <em>Explore</em>
            </span>
          </div>
        </div>

        {/* Floating preview rectangle — appears above/below the hovered satellite.
            key={preview-${project.id}} re-mounts on each new hover so the
            entrance animation always plays from scratch. */}
        {hoverId !== null && visibleProjects[hoverId] && (() => {
          const sat     = satellites[hoverId];
          const project = visibleProjects[hoverId];
          const dir     = sat.y >= 42 ? "above" : "below";

          return (
            <div
              key={`preview-${project.id}`}
              className={`wkmb-preview wkmb-preview--${dir}`}
              style={{ left: `${sat.x}%`, top: `${sat.y}%` }}
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="wkmb-preview-inner">

                {isVideo(project.bg) ? (
                  <video
                    className="wkmb-preview-media"
                    src={project.bg}
                    autoPlay muted loop playsInline
                  />
                ) : isMedia(project.bg) ? (
                  <img
                    className="wkmb-preview-media"
                    src={project.bg}
                    alt={project.label}
                  />
                ) : (
                  <div
                    className="wkmb-preview-fill"
                    style={{ background: project.bg || "#c8cec5" }}
                  />
                )}

                {/* Uses project_name (the full DB title) rather than the
                    short display label shown inside the satellite circle */}
                <div className="wkmb-preview-label">
                  <span style={{ color: project.accent }}>
                    {project.project_name}
                  </span>
                </div>

              </div>
            </div>
          );
        })()}
      </main>

      {/* Bottom accent line */}
      {/* <div className="wkmb-baseline" /> */}
    </div>
  );
}