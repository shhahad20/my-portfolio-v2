import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import {
  fetchProjects,
  fetchProjectById,
  Project,
} from "../redux/slices/projectsSlice";
import "./style/ProjectDetails.scss";

// ─── Extended project type ────────────────────────────────────────────────────
// Widens the minimal base Project type from the Redux slice.
// All extra fields are optional — the component degrades gracefully when the
// backend does not yet return them.

export interface ProjectDetailData extends Project {
  slug?: string;
  subtitle?: string;
  category?: string;
  description?: string;
  client?: string;
  year?: string | number;
  services?: string[];
  technologies?: string[];
  /** Ordered list of image / video URLs for the gallery */
  media?: string[];
  external_link?: string;
  tags?: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isMediaUrl = (src: string): boolean =>
  typeof src === "string" && (src.startsWith("http") || src.startsWith("/"));

const isVideoUrl = (src: string): boolean =>
  isMediaUrl(src) && /\.(mp4|webm|ogg)$/i.test(src);

// ─── MediaItem sub-component ──────────────────────────────────────────────────
// Handles per-item lazy loading and loading-state spinner.
// The first item (index 0) loads eagerly; all others wait until they
// enter the IntersectionObserver root margin to conserve bandwidth.

interface MediaItemProps {
  src: string;
  alt: string;
  index: number;
  totalCount: number;
}

function MediaItem({ src, alt, index, totalCount }: MediaItemProps) {
  const [loaded, setLoaded] = useState(false);
  // First item is always in view on mount; others wait for the IO callback
  const [inView, setInView] = useState(index === 0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inView) return;
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin: "40%" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [inView]);

  const vid = isVideoUrl(src);

  return (
    <div
      ref={wrapRef}
      className="pd-gallery-item"
      role="listitem"
      aria-label={`Media ${index + 1} of ${totalCount}`}
    >
      {/* Spinner overlay — fades out once the media is ready */}
      <div
        className={`pd-item-loader${loaded ? " pd-item-loader--hidden" : ""}`}
        aria-hidden="true"
      >
        <span className="pd-item-spinner" />
      </div>

      {inView &&
        (vid ? (
          <video
            className={`pd-gallery-media${loaded ? " pd-gallery-media--visible" : ""}`}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setLoaded(true)}
            onError={() => setLoaded(true)}
          />
        ) : (
          <img
            className={`pd-gallery-media${loaded ? " pd-gallery-media--visible" : ""}`}
            src={src}
            alt={alt}
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
          />
        ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {
    projects,
    selectedProject,
    loading: listLoading,
  } = useSelector((state: RootState) => state.projects);

  // Always fetch the current project by ID.
  // Also fetch all projects if needed so previous/next navigation works.
  useEffect(() => {
    if (!id) return;

    dispatch(fetchProjectById(id));

    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [dispatch, id, projects.length]);

  // Use the dedicated selectedProject fetched by ID.
  // Fall back to the projects array if available.
  const project = (selectedProject ?? projects.find((p) => p.id === id)) as
    | ProjectDetailData
    | undefined;

  // Resolve current index for previous/next navigation.
  const currentIndex = project
    ? projects.findIndex((p) => p.id === project.id)
    : -1;

  const prevProject =
    currentIndex > 0 ? (projects[currentIndex - 1] as ProjectDetailData) : null;
  const nextProject =
    currentIndex < projects.length - 1
      ? (projects[currentIndex + 1] as ProjectDetailData)
      : null;

  // ── Build ordered media array ─────────────────────────────────────────────
  // Uses project.media[] when available; falls back to project.bg if it is a URL.
  const mediaItems: string[] = project
    ? project.media && project.media.length > 0
      ? project.media
      : isMediaUrl(project.bg)
        ? [project.bg]
        : []
    : [];

  // ── Gallery refs and scroll state ─────────────────────────────────────────
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Translate vertical mouse-wheel delta → horizontal scroll.
  // deltaX passthrough supports native trackpad horizontal gestures.
  const handleWheel = useCallback((e: WheelEvent) => {
    const el = galleryRef.current;
    if (!el) return;
    e.preventDefault();
    el.scrollLeft +=
      Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  }, []);

  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Update progress bar and active-item counter while scrolling
  const handleScroll = useCallback(() => {
    const el = galleryRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    setScrollProgress(maxScroll > 0 ? el.scrollLeft / maxScroll : 0);

    // Identify which item is closest to the horizontal centre of the viewport
    const viewCentre = el.scrollLeft + el.clientWidth / 2;
    const items = el.querySelectorAll<HTMLElement>(".pd-gallery-item");
    let closest = 0;
    let minDist = Infinity;
    items.forEach((item, i) => {
      const dist = Math.abs(
        item.offsetLeft + item.offsetWidth / 2 - viewCentre,
      );
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  }, []);

  // ── Scroll-reveal for the details section ─────────────────────────────────
  const detailsRef = useRef<HTMLDivElement>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    const el = detailsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDetailsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.06 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [project]);

  // Stagger the project-navigation reveal slightly after details
  useEffect(() => {
    if (!detailsVisible) return;
    const t = setTimeout(() => setNavVisible(true), 260);
    return () => clearTimeout(t);
  }, [detailsVisible]);

  // ── Page-level states ─────────────────────────────────────────────────────

  if (listLoading && !project) {
    return (
      <div className="pd-state pd-state--loading" aria-live="polite">
        <span className="pd-state-spinner" aria-label="Loading project…" />
        <span className="pd-state-label">Loading</span>
      </div>
    );
  }

  if (!listLoading && !project) {
    return (
      <div className="pd-state pd-state--error">
        <p className="pd-state-msg">Project not found.</p>
        <Link to="/#projects" className="pd-state-back">
          ← Back to projects
        </Link>
      </div>
    );
  }

  // Narrowing — guaranteed to be defined past the early returns above
  const p = project!;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="pd-root">
      {/* ── Fixed top bar ─────────────────────────────────────────────────── */}
      <header className="pd-topbar">
        <Link
          to="/#projects"
          className="pd-back-link"
          aria-label="Back to all projects"
        >
          <span className="pd-back-arrow" aria-hidden="true">
            ←
          </span>
          <span className="pd-back-text">All Projects</span>
        </Link>

        <span className="pd-topbar-title" aria-hidden="true">
          {p.project_name}
        </span>

        {mediaItems.length > 1 && (
          <span className="pd-counter" aria-live="polite" aria-atomic="true">
            <span className="pd-counter-current">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="pd-counter-sep"> / </span>
            <span className="pd-counter-total">
              {String(mediaItems.length).padStart(2, "0")}
            </span>
          </span>
        )}
      </header>

      {/* ── Horizontal media gallery ──────────────────────────────────────── */}
      <section className="pd-gallery-wrap" aria-label="Project media gallery">
        {mediaItems.length > 0 ? (
          <>
            <div
              ref={galleryRef}
              className="pd-gallery"
              role="list"
              onScroll={handleScroll}
              tabIndex={0}
              aria-label="Scroll horizontally to browse media"
            >
              {mediaItems.map((src, i) => (
                <MediaItem
                  key={`${p.id}-${i}`}
                  src={src}
                  alt={`${p.project_name} — ${i + 1}`}
                  index={i}
                  totalCount={mediaItems.length}
                />
              ))}
            </div>

            {/* Thin progress bar */}
            <div className="pd-gallery-progress" aria-hidden="true">
              <div
                className="pd-gallery-progress-fill"
                style={{ transform: `scaleX(${scrollProgress})` }}
              />
            </div>

            {/* Dot indicators */}
            {mediaItems.length > 1 && (
              <div className="pd-gallery-dots" aria-hidden="true">
                {mediaItems.map((_, i) => (
                  <button
                    key={i}
                    className={`pd-gallery-dot${i === activeIndex ? " pd-gallery-dot--active" : ""}`}
                    onClick={() => {
                      const items =
                        galleryRef.current?.querySelectorAll<HTMLElement>(
                          ".pd-gallery-item",
                        );
                      items?.[i]?.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "start",
                      });
                    }}
                    tabIndex={-1}
                    aria-label={`Go to media ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          /* Solid-colour swatch fallback when no media URLs exist */
          <div
            className="pd-gallery-swatch"
            style={{ background: p.bg || "#c8cec5" }}
            aria-label={p.project_name}
          />
        )}
      </section>

      {/* ── Project details ───────────────────────────────────────────────── */}
      <section
        ref={detailsRef}
        className={`pd-details${detailsVisible ? " pd-details--visible" : ""}`}
        aria-label="Project information"
      >
        <div className="pd-details-grid">
          {/* ── Left: sticky metadata column ────────────────────────────── */}
          <aside className="pd-meta">
            <div className="pd-meta-inner">
              <h1 className="pd-project-title">{p.project_name}</h1>

              {p.subtitle && (
                <p className="pd-project-subtitle">{p.subtitle}</p>
              )}

              {(p.category ?? p.label) && (
                <span className="pd-project-category">
                  {p.category ?? p.label}
                </span>
              )}

              {/* Key-value pairs */}
              <dl className="pd-meta-list">
                {p.client && (
                  <>
                    <dt>Client</dt>
                    <dd>{p.client}</dd>
                  </>
                )}
                {p.year && (
                  <>
                    <dt>Year</dt>
                    <dd>{p.year}</dd>
                  </>
                )}
                {p.services && p.services.length > 0 && (
                  <>
                    <dt>Services</dt>
                    <dd>{p.services.join(", ")}</dd>
                  </>
                )}
                {p.technologies && p.technologies.length > 0 && (
                  <>
                    <dt>Made with</dt>
                    <dd>{p.technologies.join(", ")}</dd>
                  </>
                )}
              </dl>

              {p.external_link && (
                <a
                  href={p.external_link}
                  className="pd-ext-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Live
                  <span className="pd-ext-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              )}
            </div>
          </aside>

          {/* ── Right: long-form description ─────────────────────────────── */}
          <div className="pd-description">
            <p
              className={`pd-description-body${
                !p.description ? " pd-description-body--empty" : ""
              }`}
            >
              {p.description ?? "Project details coming soon."}
            </p>

            {p.tags && p.tags.length > 0 && (
              <ul className="pd-tags" aria-label="Tags">
                {p.tags.map((tag) => (
                  <li key={tag} className="pd-tag">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* ── Divider line ──────────────────────────────────────────────────── */}
      <div className="pd-rule" aria-hidden="true" />

      {/* ── Previous / Next project navigation ───────────────────────────── */}
      <nav
        className={`pd-project-nav${navVisible ? " pd-project-nav--visible" : ""}`}
        aria-label="Project navigation"
      >
        <div className="pd-project-nav-inner">
          {prevProject ? (
            <button
              className="pd-nav-btn pd-nav-btn--prev"
              onClick={() => navigate(`/projects/${prevProject.id}`)}
              aria-label={`Previous project: ${prevProject.project_name}`}
            >
              <span className="pd-nav-dir">
                <span className="pd-nav-arrow" aria-hidden="true">
                  ←
                </span>
                Previous
              </span>
              <span className="pd-nav-name">{prevProject.project_name}</span>
            </button>
          ) : (
            <span />
          )}

          <Link
            to="/#projects"
            className="pd-nav-all"
            aria-label="All projects"
          >
            <span className="pd-nav-all-grid" aria-hidden="true">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className="pd-nav-all-dot" />
              ))}
            </span>
            <span className="pd-nav-all-label">All</span>
          </Link>

          {nextProject ? (
            <button
              className="pd-nav-btn pd-nav-btn--next"
              onClick={() => navigate(`/projects/${nextProject.id}`)}
              aria-label={`Next project: ${nextProject.project_name}`}
            >
              <span className="pd-nav-dir">
                Next
                <span className="pd-nav-arrow" aria-hidden="true">
                  →
                </span>
              </span>
              <span className="pd-nav-name">{nextProject.project_name}</span>
            </button>
          ) : (
            <span />
          )}
        </div>
      </nav>
    </div>
  );
}
