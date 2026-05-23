import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import "./style/projects.scss";
import { Project, fetchProjects } from "../redux/slices/projectsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../redux/store";
import AnimatedLink from "../components/AnimatedLink";

/* ─── Data ──────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { id: 1, label: "GITHUB ↗", href: "https://github.com/shhahad20" },
  {
    id: 2,
    label: "INSTAGRAM ↗",
    href: "https://www.instagram.com/shahad.th.designer/",
  },
  { id: 3, label: "BEHANCE ↗", href: "https://www.behance.net/shhahad20" },
];

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: "fallback-0",
    label: "Design Systems",
    project_name: "Design Systems",
    bg: "#c8cec5",
    accent: "#2d3a29",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-1",
    label: "Motion Graphics",
    project_name: "Motion Graphics",
    bg: "#c5c8ce",
    accent: "#29303a",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-2",
    label: "Brand Identity",
    project_name: "Brand Identity",
    bg: "https://puakrabhbhosdpyxfsfk.supabase.co/storage/v1/object/public/images/Hillside%2017.png",
    accent: "#3a2929",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-3",
    label: "3D Visualization",
    project_name: "3D Visualization",
    bg: "#c5cece",
    accent: "#293a3a",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-4",
    label: "Web Development",
    project_name: "Web Development",
    bg: "#cec8c5",
    accent: "#3a3029",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-5",
    label: "Photography",
    project_name: "Photography",
    bg: "#c5c5ce",
    accent: "#29293a",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-6",
    label: "UI/UX Research",
    project_name: "UI/UX Research",
    bg: "#cec5c8",
    accent: "#3a2930",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-7",
    label: "Typography",
    project_name: "Typography",
    bg: "#c8cec5",
    accent: "#303a2d",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-8",
    label: "Illustration",
    project_name: "Illustration",
    bg: "#cecec5",
    accent: "#3a3a29",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-9",
    label: "Prototyping",
    project_name: "Prototyping",
    bg: "#c5c8c5",
    accent: "#2d302d",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-10",
    label: "Creative Coding",
    project_name: "Creative Coding",
    bg: "#c8c5ce",
    accent: "#30293a",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-11",
    label: "Video Editing",
    project_name: "Video Editing",
    bg: "#cec5ce",
    accent: "#3a293a",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-12",
    label: "Art Direction",
    project_name: "Art Direction",
    bg: "#c5cec8",
    accent: "#293a30",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-13",
    label: "Interaction Design",
    project_name: "Interaction Design",
    bg: "#cec8ce",
    accent: "#3a303a",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-14",
    label: "Data Visualization",
    project_name: "Data Visualization",
    bg: "#c5cec5",
    accent: "#293a29",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-15",
    label: "Product Design",
    project_name: "Product Design",
    bg: "#cec5c5",
    accent: "#3a2929",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-16",
    label: "Animation",
    project_name: "Animation",
    bg: "#c8c8ce",
    accent: "#30303a",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-17",
    label: "User Research",
    project_name: "User Research",
    bg: "#cecec8",
    accent: "#3a3a30",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-18",
    label: "Print Design",
    project_name: "Print Design",
    bg: "#c5c8ce",
    accent: "#293040",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-19",
    label: "AR / VR",
    project_name: "AR / VR",
    bg: "#cec8c5",
    accent: "#3a3029",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-20",
    label: "Copywriting",
    project_name: "Copywriting",
    bg: "#c8cec8",
    accent: "#303a30",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-21",
    label: "Concept Art",
    project_name: "Concept Art",
    bg: "#c8c5c8",
    accent: "#30293a",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-22",
    label: "Sound Design",
    project_name: "Sound Design",
    bg: "#c5c5c8",
    accent: "#292930",
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-23",
    label: "Generative Art",
    project_name: "Generative Art",
    bg: "#c8c5c5",
    accent: "#302929",
    created_at: "",
    updated_at: "",
  },
];

const SATELLITES_DESKTOP = [
  { id: 0, x: 51, y: 24 },
  { id: 1, x: 62, y: 31 },
  { id: 2, x: 67, y: 47 },
  { id: 3, x: 62, y: 63 },
  { id: 4, x: 51, y: 70 },
  { id: 5, x: 40, y: 63 },
  { id: 6, x: 35, y: 47 },
  { id: 7, x: 40, y: 31 },
  { id: 8, x: 51, y: 9 },
  { id: 9, x: 61, y: 12 },
  { id: 10, x: 69, y: 20 },
  { id: 11, x: 75, y: 33 },
  { id: 12, x: 77, y: 47 },
  { id: 13, x: 75, y: 61 },
  { id: 14, x: 69, y: 74 },
  { id: 15, x: 61, y: 82 },
  { id: 16, x: 51, y: 85 },
  { id: 17, x: 41, y: 82 },
  { id: 18, x: 33, y: 74 },
  { id: 19, x: 27, y: 61 },
  { id: 20, x: 25, y: 47 },
  { id: 21, x: 27, y: 33 },
  { id: 22, x: 33, y: 20 },
  { id: 23, x: 41, y: 12 },
];

const SATELLITES_MOBILE = [
  { id: 0, x: 18, y: 6 },
  { id: 1, x: 39, y: 6 },
  { id: 2, x: 63, y: 6 },
  { id: 3, x: 82, y: 6 },
  { id: 4, x: 18, y: 18 },
  { id: 5, x: 39, y: 18 },
  { id: 6, x: 63, y: 18 },
  { id: 7, x: 82, y: 18 },
  { id: 8, x: 18, y: 30 },
  { id: 9, x: 39, y: 30 },
  { id: 10, x: 63, y: 30 },
  { id: 11, x: 82, y: 30 },
  { id: 12, x: 18, y: 62 },
  { id: 13, x: 39, y: 62 },
  { id: 14, x: 63, y: 62 },
  { id: 15, x: 82, y: 62 },
  { id: 16, x: 18, y: 74 },
  { id: 17, x: 39, y: 74 },
  { id: 18, x: 63, y: 74 },
  { id: 19, x: 82, y: 74 },
  { id: 20, x: 18, y: 86 },
  { id: 21, x: 39, y: 86 },
  { id: 22, x: 63, y: 86 },
  { id: 23, x: 82, y: 86 },
];

const CENTER_X = 51;
const CENTER_Y = 47;
const MOBILE_BREAKPOINT = 640;

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const isMedia = (src: string) =>
  typeof src === "string" && (src.startsWith("http") || src.startsWith("/"));

const isVideo = (src: string) => isMedia(src) && /\.(mp4|webm|ogg)$/i.test(src);

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function WhatKeepsMeBusy() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { projects, loading, error } = useSelector(
    (state: RootState) => state.projects,
  );

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // ── Unified active-item state ─────────────────────────────────────────────
  //
  // A single `activeId` drives both the satellite "active" ring and the
  // floating preview across all input modes (mouse, touch, keyboard).
  //
  //   Desktop (mouse) : mouseEnter sets it → mouseLeave clears it (60ms debounce)
  //   Touch           : first tap sets it  → second tap on same item navigates
  //   Keyboard        : focus sets it      → Enter opens (first) / navigates (second)
  const [activeId, setActiveId] = useState<number | null>(null);

  // ── Touch-device detection ────────────────────────────────────────────────
  //
  // Detected lazily on the first touchstart so SSR, hybrid pointer devices
  // (Surface, iPad with Magic Keyboard), and mouse-after-touch scenarios all
  // work correctly. A plain ref avoids a re-render on detection.
  const isTouchRef = useRef(false);

  // ── Two-tap navigation guard ──────────────────────────────────────────────
  //
  // On touch devices a tap generates both a touchstart AND a synthetic click.
  // We want:
  //   1st tap → show preview only   (suppress the follow-up click)
  //   2nd tap → navigate            (allow the click through)
  //
  // When set to `true` by `handleTouchStart` the very next `handleClick`
  // consumes the flag and returns without navigating.  Subsequent clicks
  // (i.e. the second tap) find the flag `false` and navigate normally.
  const suppressNavRef = useRef(false);

  // ── Debounce timer for mouseleave ─────────────────────────────────────────
  //
  // Prevents preview flicker when the cursor briefly crosses the gap between
  // two adjacent satellite circles.
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Media-load cache ──────────────────────────────────────────────────────
  //
  // Tracks project IDs whose image/video has already been fetched.
  // Once cached the spinner is never shown again for that satellite —
  // even if the user hovers away and comes back.
  const loadedMediaSet = useRef<Set<string>>(new Set());
  const [mediaLoaded, setMediaLoaded] = useState(false);

  // ── Responsive layout switch ──────────────────────────────────────────────
  //
  // ResizeObserver on <body> is more efficient than window "resize" for a
  // simple breakpoint check — it only fires when the document width actually
  // changes and doesn't trigger on virtual-keyboard / scroll-bar appearances.
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.innerWidth < MOBILE_BREAKPOINT
      : false,
  );

  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => {
      setIsMobile(entry.contentRect.width < MOBILE_BREAKPOINT);
    });
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  // ── Memoised derived values ───────────────────────────────────────────────
  //
  // Memoisation prevents the satellite list from being re-sliced / re-mapped
  // on every render caused by unrelated state updates (e.g. mediaLoaded).
  const displayProjects = useMemo(
    () => (projects.length > 0 ? projects : FALLBACK_PROJECTS),
    [projects],
  );

  const visibleProjects = useMemo(
    () => displayProjects.slice(0, 24),
    [displayProjects],
  );

  // On mobile, evenly interleave projects that have real media across all
  // satellite positions so populated circles are never clustered at the bottom.
  const orderedVisibleProjects = useMemo(() => {
    if (!isMobile) return visibleProjects;
    const withMedia = visibleProjects.filter((p) => isMedia(p.bg));
    const withoutMedia = visibleProjects.filter((p) => !isMedia(p.bg));
    if (withMedia.length === 0 || withoutMedia.length === 0) return visibleProjects;
    const total = visibleProjects.length;
    const result: Project[] = [];
    let mIdx = 0;
    let eIdx = 0;
    for (let i = 0; i < total; i++) {
      const mediaExpected = Math.round(((i + 1) * withMedia.length) / total);
      if (mIdx < mediaExpected && mIdx < withMedia.length) {
        result.push(withMedia[mIdx++]);
      } else if (eIdx < withoutMedia.length) {
        result.push(withoutMedia[eIdx++]);
      } else {
        result.push(withMedia[mIdx++]);
      }
    }
    return result;
  }, [isMobile, visibleProjects]);

  const satellites = useMemo(
    () =>
      (isMobile ? SATELLITES_MOBILE : SATELLITES_DESKTOP).slice(
        0,
        orderedVisibleProjects.length,
      ),
    [isMobile, orderedVisibleProjects.length],
  );

  // ── Sync media-loaded state with activeId ─────────────────────────────────
  useEffect(() => {
    if (activeId === null) {
      setMediaLoaded(false);
      return;
    }
    const project = orderedVisibleProjects[activeId];
    if (!project) return;

    // Colour fills never need a network fetch; cached items are already done.
    if (!isMedia(project.bg) || loadedMediaSet.current.has(project.id)) {
      setMediaLoaded(true);
    } else {
      setMediaLoaded(false);
    }
  }, [activeId, orderedVisibleProjects]);

  // Stable callback so media elements never get a new function reference.
  const handleMediaLoaded = useCallback((projectId: string) => {
    loadedMediaSet.current.add(projectId);
    setMediaLoaded(true);
  }, []);

  // ── Desktop mouse handlers ────────────────────────────────────────────────

  const handleMouseEnter = useCallback((id: number) => {
    // Ignore ghost mouse events that browsers fire after a touch sequence.
    if (isTouchRef.current) return;
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setActiveId(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isTouchRef.current) return;
    leaveTimerRef.current = setTimeout(() => setActiveId(null), 60);
  }, []);

  // ── Touch handlers ────────────────────────────────────────────────────────

  const handleTouchStart = useCallback(
    (id: number) => {
      isTouchRef.current = true;

      // Cancel any pending leave timer from a previous mouse interaction.
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
        leaveTimerRef.current = null;
      }

      if (activeId !== id) {
        // ── First tap on a new satellite ──────────────────────────────────
        // Show the preview.  Raise the suppress flag so the synthetic click
        // that follows this touchstart doesn't immediately navigate.
        suppressNavRef.current = true;
        setActiveId(id);
      }
      // ── Second tap on the same satellite ──────────────────────────────
      // suppressNavRef stays false → the follow-up click fires → navigate.
    },
    [activeId],
  );

  // ── Unified click handler (desktop direct-click + touch second-tap) ───────

  const handleClick = useCallback(
    (projectId: string) => {
      if (loading) return;

      // Consume the one-shot suppress flag set by the first touch.
      if (suppressNavRef.current) {
        suppressNavRef.current = false;
        return; // first tap: preview was just shown — don't navigate yet
      }

      navigate(`/projects/${projectId}`);
    },
    [loading, navigate],
  );

  // ── Touch-outside dismiss ─────────────────────────────────────────────────
  //
  // Tapping anywhere outside a satellite or the preview collapses the
  // currently-shown preview.  Uses event delegation on the root element so
  // no extra listeners are attached per-satellite.
  const handleRootTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".wkmb-sat, .wkmb-preview")) {
        setActiveId(null);
      }
    },
    [],
  );

  // ── Keyboard handler ──────────────────────────────────────────────────────
  //
  // Enter on unfocused/different satellite → show preview (mirrors first tap)
  // Enter on already-focused satellite     → navigate   (mirrors second tap)
  // Escape                                 → dismiss preview
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, id: number, projectId: string) => {
      if (e.key === "Enter") {
        if (activeId !== id) {
          setActiveId(id);
        } else {
          navigate(`/projects/${projectId}`);
        }
      }
      if (e.key === "Escape") {
        setActiveId(null);
      }
    },
    [activeId, navigate],
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="wkmb-root"
      id="projects"
      onTouchStart={handleRootTouchStart}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="wkmb-header">
        <div className="wkmb-title-block">
          <h1 className="wkmb-title">
            WHAT KEEPS
            <br />
            ME BUSY
          </h1>
          <span className="wkmb-page-num">02</span>
        </div>
        <nav className="wkmb-nav" aria-label="External links">
          {NAV_LINKS.map(({ id, label, href }) => (
            <AnimatedLink
              key={id}
              linkText={label}
              hoverText={label}
              href={href}
            />
          ))}
        </nav>
      </header>

      {/* ── Circle field ────────────────────────────────────────────────── */}
      <main
        className={[
          "wkmb-field",
          isMobile ? "wkmb-field--mobile" : "",
          loading ? "wkmb-field--loading" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label="Portfolio projects"
        aria-busy={loading}
      >
        {error && (
          <p className="wkmb-error" role="alert">
            {error}
          </p>
        )}

        {/* ── Satellite circles ──────────────────────────────────────────── */}
        {satellites.map((s, index) => {
          const project = orderedVisibleProjects[index];
          if (!project) return null;
          const isActive = activeId === index;

          return (
            <div
              key={project.id}
              className={[
                "wkmb-sat",
                isActive ? "wkmb-sat--active" : "",
                loading ? "wkmb-sat--skeleton" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart(index)}
              onClick={() => handleClick(project.id)}
              onKeyDown={(e) => handleKeyDown(e, index, project.id)}
              onFocus={() => !loading && handleMouseEnter(index)}
              onBlur={() => !loading && handleMouseLeave()}
              role="button"
              tabIndex={loading ? -1 : 0}
              // Tell screen-reader users the two-tap model on touch devices.
              aria-label={
                isActive && isTouchRef.current
                  ? `${project.label} — tap again to open`
                  : project.label
              }
              aria-expanded={isActive}
              aria-disabled={loading}
            >
              <span className="wkmb-sat-label">{project.label}</span>
            </div>
          );
        })}

        {/* ── Center circle ─────────────────────────────────────────────── */}
        <div
          className="wkmb-center"
          style={{ left: `${CENTER_X}%`, top: `${CENTER_Y}%` }}
        >
          <div className="wkmb-center-label">
            {loading ? (
              <span
                className="wkmb-center-loading"
                aria-label="Loading projects"
              >
                <span className="wkmb-loading-dot" aria-hidden="true" />
                <span className="wkmb-loading-dot" aria-hidden="true" />
                <span className="wkmb-loading-dot" aria-hidden="true" />
              </span>
            ) : (
              <span className="wkmb-center-idle">
                Choose a circle
                <br />
                to <em>Explore</em>
              </span>
            )}
          </div>
        </div>

        {/* ── Floating preview rectangle ─────────────────────────────────── */}
        {activeId !== null &&
          orderedVisibleProjects[activeId] &&
          (() => {
            const sat = satellites[activeId];
            const project = orderedVisibleProjects[activeId];
            const dir = sat.y >= 42 ? "above" : "below";

            return (
              <div
                key={`preview-${project.id}`}
                className={`wkmb-preview wkmb-preview--${dir}`}
                style={{ left: `${sat.x}%`, top: `${sat.y}%` }}
                aria-live="polite"
                aria-atomic="true"
                role="link"
                tabIndex={0}
                // Preview is always directly navigable (no suppress needed —
                // the satellite's own click already consumed the flag before
                // the user can tap the preview).
                onClick={() => handleClick(project.id)}
                onKeyDown={(e) => e.key === "Enter" && handleClick(project.id)}
              >
                <div className="wkmb-preview-inner">
                  {/* ── Loading overlay ────────────────────────────────── */}
                  <div
                    className={`wkmb-preview-loader${mediaLoaded ? " wkmb-preview-loader--hidden" : ""}`}
                    aria-hidden="true"
                  >
                    <span className="wkmb-preview-spinner" />
                  </div>

                  {isVideo(project.bg) ? (
                    <video
                      className="wkmb-preview-media"
                      src={project.bg}
                      autoPlay
                      muted
                      loop
                      playsInline
                      onLoadedData={() => handleMediaLoaded(project.id)}
                      onError={() => handleMediaLoaded(project.id)}
                    />
                  ) : isMedia(project.bg) ? (
                    <img
                      className="wkmb-preview-media"
                      src={project.bg}
                      alt={project.label}
                      // Defer off-screen images; decode async keeps the main
                      // thread free while the image is being parsed.
                      loading="lazy"
                      decoding="async"
                      onLoad={() => handleMediaLoaded(project.id)}
                      onError={() => handleMediaLoaded(project.id)}
                    />
                  ) : (
                    <div
                      className="wkmb-preview-fill"
                      style={{ background: project.bg || "#c8cec5" }}
                    >
                      <span className="wkmb-preview-fallback-text">
                        Looks like this project
                        <br />
                        is still in progress.
                      </span>
                    </div> 
                  )}

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
    </div>
  );
}
