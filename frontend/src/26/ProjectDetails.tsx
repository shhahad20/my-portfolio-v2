import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchProjects, fetchProjectById } from "../redux/slices/projectsSlice";
import "./style/ProjectDetails.scss";

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ProjectMedia {
  id: string;
  media_url: string;
  media_type: "image" | "video" | string;
  alt_text?: string | null;
  sort_order: number;
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

const isMediaUrl = (src?: string | null): src is string =>
  typeof src === "string" && (src.startsWith("http") || src.startsWith("/"));

const isVideoUrl = (src: string): boolean =>
  /\.(mp4|webm|ogg)$/i.test(src);

const toMediaItem = (
  url: string,
  overrides: Partial<ProjectMedia> = {}
): ProjectMedia => ({
  id: `fallback-${url}`,
  media_url: url,
  media_type: isVideoUrl(url) ? "video" : "image",
  alt_text: null,
  sort_order: 0,
  ...overrides,
});

/**
 * Build the final ordered media list:
 *  1. bg image always first (if valid URL and not already in media[])
 *  2. project_media rows ordered by sort_order
 */
const buildMediaItems = (
  bg?: string | null,
  media?: ProjectMedia[] | null
): ProjectMedia[] => {
  const rows: ProjectMedia[] = Array.isArray(media) ? [...media] : [];

  // De-dup: check if bg is already represented in the media rows
  const bgAlreadyPresent =
    isMediaUrl(bg) && rows.some((r) => r.media_url === bg);

  const items: ProjectMedia[] = [];

  if (isMediaUrl(bg) && !bgAlreadyPresent) {
    items.push(
      toMediaItem(bg, { id: "bg-hero", sort_order: -1, alt_text: "Hero" })
    );
  }

  // Sort by sort_order ascending, append
  items.push(...rows.sort((a, b) => a.sort_order - b.sort_order));

  return items;
};

// ─── MediaItem ───────────────────────────────────────────────────────────────────

interface MediaItemProps {
  item: ProjectMedia;
  index: number;
  totalCount: number;
  projectName: string;
  /** When true the item is a ghost clone for the infinite loop */
  isClone?: boolean;
}

function MediaItem({
  item,
  index,
  totalCount,
  projectName,
  isClone = false,
}: MediaItemProps) {
  const [loaded, setLoaded] = useState(false);
  const isVid = item.media_type === "video";
  const alt = item.alt_text || `${projectName} — ${index + 1} of ${totalCount}`;

  return (
    <div
      className="pd-gallery-item"
      role={isClone ? "presentation" : "listitem"}
      aria-hidden={isClone}
      aria-label={isClone ? undefined : `Media ${index + 1} of ${totalCount}`}
    >
      {/* Skeleton shimmer until media ready */}
      <div
        className={`pd-item-loader${loaded ? " pd-item-loader--hidden" : ""}`}
        aria-hidden="true"
      />

      {isVid ? (
        <video
          className={`pd-gallery-media${loaded ? " pd-gallery-media--visible" : ""}`}
          src={item.media_url}
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
          src={item.media_url}
          alt={alt}
          loading={index === 0 ? "eager" : "lazy"}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
      )}
    </div>
  );
}

// ─── ProjectNavCard ───────────────────────────────────────────────────────────

interface NavCardProps {
  project: { id: string; project_name: string; bg?: string | null } | null;
  direction: "prev" | "next";
  onClick: () => void;
}

function ProjectNavCard({ project, direction, onClick }: NavCardProps) {
  if (!project) return <span className="pd-nav-placeholder" />;

  const label = direction === "prev" ? "Previous Project" : "Next Project";
  const arrow = direction === "prev" ? "←" : "→";

  return (
    <button
      className={`pd-nav-card pd-nav-card--${direction}`}
      onClick={onClick}
      aria-label={`${label}: ${project.project_name}`}
    >
      <div className="pd-nav-card-thumb">
        {isMediaUrl(project.bg) ? (
          <img src={project.bg} alt={project.project_name} loading="lazy" />
        ) : (
          <div
            className="pd-nav-card-swatch"
            style={{ background: (project as any).bg || "#d4d0c9" }}
          />
        )}
        <div className="pd-nav-card-overlay" aria-hidden="true" />
      </div>

      <div className="pd-nav-card-body">
        <span className="pd-nav-card-dir">
          {direction === "prev" && (
            <span className="pd-nav-card-arrow" aria-hidden="true">
              {arrow}
            </span>
          )}
          <span className="pd-nav-card-label">{label}</span>
          {direction === "next" && (
            <span className="pd-nav-card-arrow" aria-hidden="true">
              {arrow}
            </span>
          )}
        </span>
        <span className="pd-nav-card-name">{project.project_name}</span>
      </div>
    </button>
  );
}

// ─── InfiniteGallery ─────────────────────────────────────────────────────────

interface InfiniteGalleryProps {
  items: ProjectMedia[];
  projectName: string;
}

const SCROLL_SPEED = 0.6; // px per animation frame

function InfiniteGallery({ items, projectName }: InfiniteGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const posRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // We triple the items so there is always content visible when we loop
  const loopItems = items.length > 1 ? [...items, ...items, ...items] : items;
  const singleLen = items.length;

  const tick = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    if (!pausedRef.current) {
      posRef.current += SCROLL_SPEED;

      // Each item is rendered at a fixed width via CSS var --item-w
      // We read actual offsetWidth of one real item for the reset point
      const itemEl = track.querySelector<HTMLElement>(".pd-gallery-item");
      const itemW = itemEl ? itemEl.offsetWidth + 24 : 0; // 24 = gap
      const stripW = itemW * singleLen;

      // Once we've scrolled one full copy, jump back silently
      if (stripW > 0 && posRef.current >= stripW) {
        posRef.current -= stripW;
      }

      track.style.transform = `translateX(${-posRef.current}px)`;

      // Derive active index and progress from pos
      if (itemW > 0) {
        const raw = Math.round(posRef.current / itemW) % singleLen;
        setActiveIndex(raw < 0 ? 0 : raw);
        const maxPos = stripW - (track.parentElement?.clientWidth ?? 0);
        setScrollProgress(
          maxPos > 0 ? (posRef.current % stripW) / stripW : 0
        );
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [singleLen]);

  useEffect(() => {
    if (items.length <= 1) return;
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick, items.length]);

  // Reset when project changes
  useEffect(() => {
    posRef.current = 0;
    setActiveIndex(0);
    setScrollProgress(0);
    if (trackRef.current) {
      trackRef.current.style.transform = "translateX(0)";
    }
  }, [projectName]);

  const pause = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; };

  // Dot click: jump to item position
  const jumpTo = (i: number) => {
    const track = trackRef.current;
    const itemEl = track?.querySelector<HTMLElement>(".pd-gallery-item");
    if (!itemEl) return;
    const itemW = itemEl.offsetWidth + 24;
    posRef.current = i * itemW;
  };

  if (items.length === 0) return null;

  return (
    <div
      className="pd-gallery-wrap"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      aria-label="Project media gallery"
    >
      <div
        className="pd-gallery-track-viewport"
        role="list"
        aria-label="Scroll to browse project media"
      >
        <div
          ref={trackRef}
          className="pd-gallery-track"
          style={{ willChange: "transform" }}
        >
          {loopItems.map((item, i) => {
            const realIndex = i % singleLen;
            const isClone = i >= singleLen;
            return (
              <MediaItem
                key={`${item.id}-${i}`}
                item={item}
                index={realIndex}
                totalCount={singleLen}
                projectName={projectName}
                isClone={isClone}
              />
            );
          })}
        </div>
      </div>

      {/* Progress bar */}
      {items.length > 1 && (
        <div className="pd-gallery-progress" aria-hidden="true">
          <div
            className="pd-gallery-progress-fill"
            style={{ transform: `scaleX(${scrollProgress})` }}
          />
        </div>
      )}

      {/* Dot indicators */}
      {items.length > 1 && (
        <div className="pd-gallery-dots" aria-hidden="true">
          {items.map((_, i) => (
            <button
              key={i}
              className={`pd-gallery-dot${
                i === activeIndex ? " pd-gallery-dot--active" : ""
              }`}
              onClick={() => jumpTo(i)}
              tabIndex={-1}
              aria-label={`Go to media ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { projects, selectedProject, loading, error } = useSelector(
    (state: RootState) => state.projects
  );

  // Always re-fetch by ID on mount / id change
  useEffect(() => {
    if (!id) return;
    dispatch(fetchProjectById(id));
    if (projects.length === 0) dispatch(fetchProjects());
  }, [dispatch, id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Prefer the individually-fetched project; fall back to list entry
  const project =
    selectedProject?.id === id
      ? selectedProject
      : projects.find((p) => p.id === id) ?? null;

  const currentIndex = project
    ? projects.findIndex((p) => p.id === project.id)
    : -1;

  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  // ── Media array ─────────────────────────────────────────────────────────────
  const mediaItems: ProjectMedia[] = project
    ? buildMediaItems(project.bg, (project as any).media as ProjectMedia[])
    : [];

  // ── Scroll-reveal for details ────────────────────────────────────────────────
  const detailsRef = useRef<HTMLDivElement>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    setDetailsVisible(false);
    setNavVisible(false);
    const el = detailsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDetailsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [project?.id]);

  useEffect(() => {
    if (!detailsVisible) return;
    const t = setTimeout(() => setNavVisible(true), 300);
    return () => clearTimeout(t);
  }, [detailsVisible]);

  // ── Loading state ────────────────────────────────────────────────────────────
  // Show skeleton until we have data OR a definitive error
  if (loading && !project) {
    return (
      <div className="pd-state pd-state--loading" aria-live="polite">
        <div className="pd-skeleton-gallery" aria-hidden="true" />
        <div className="pd-skeleton-details" aria-hidden="true">
          <div className="pd-skeleton-line pd-skeleton-line--title" />
          <div className="pd-skeleton-line pd-skeleton-line--sub" />
          <div className="pd-skeleton-line" />
          <div className="pd-skeleton-line" />
        </div>
        <span className="sr-only">Loading project…</span>
      </div>
    );
  }

  // ── Error / not-found state ──────────────────────────────────────────────────
  if (!loading && !project) {
    return (
      <div className="pd-state pd-state--error">
        <p className="pd-state-heading">Project not found</p>
        <p className="pd-state-msg">
          {error
            ? "Something went wrong while loading this project."
            : "This project doesn't exist or may have been removed."}
        </p>
        <Link to="/#projects" className="pd-state-back">
          ← Back to all projects
        </Link>
      </div>
    );
  }

  // ── Guaranteed non-null past this point ─────────────────────────────────────
  const p = project!;

  return (
    <div className="pd-root">
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <header className="pd-topbar">
        <Link
          to="/#projects"
          className="pd-back-link"
          aria-label="Back to all projects"
        >
          <span className="pd-back-arrow" aria-hidden="true">←</span>
          <span className="pd-back-text">All Projects</span>
        </Link>

        <span className="pd-topbar-title" aria-hidden="true">
          {p.project_name}
        </span>

        {mediaItems.length > 1 && (
          <span className="pd-topbar-count" aria-label={`${mediaItems.length} media items`}>
            {mediaItems.length} items
          </span>
        )}
      </header>

      {/* ── Infinite gallery ────────────────────────────────────────────────── */}
      <InfiniteGallery
        items={mediaItems}
        projectName={p.project_name}
      />

      {/* Colour swatch fallback when no media at all */}
      {mediaItems.length === 0 && (
        <div
          className="pd-gallery-swatch"
          style={{ background: (p as any).bg || "#ccc9c0" }}
          aria-label={p.project_name}
        />
      )}

      {/* ── Project details ──────────────────────────────────────────────────── */}
      <section
        ref={detailsRef}
        className={`pd-details${detailsVisible ? " pd-details--visible" : ""}`}
        aria-label="Project information"
      >
        <div className="pd-details-grid">
          {/* Sticky meta column */}
          <aside className="pd-meta">
            <div className="pd-meta-inner">
              <h1 className="pd-project-title">{p.project_name}</h1>

              {(p as any).subtitle && (
                <p className="pd-project-subtitle">{(p as any).subtitle}</p>
              )}

              {((p as any).category ?? (p as any).label) && (
                <span className="pd-project-category">
                  {(p as any).category ?? (p as any).label}
                </span>
              )}

              <dl className="pd-meta-list">
                {(p as any).client && (
                  <><dt>Client</dt><dd>{(p as any).client}</dd></>
                )}
                {(p as any).year && (
                  <><dt>Year</dt><dd>{(p as any).year}</dd></>
                )}
                {(p as any).services?.length > 0 && (
                  <><dt>Services</dt><dd>{(p as any).services.join(", ")}</dd></>
                )}
                {(p as any).technologies?.length > 0 && (
                  <><dt>Made with</dt><dd>{(p as any).technologies.join(", ")}</dd></>
                )}
              </dl>

              {(p as any).external_link && (
                <a
                  href={(p as any).external_link}
                  className="pd-ext-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Live
                  <span className="pd-ext-arrow" aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </aside>

          {/* Long-form description */}
          <div className="pd-description">
            <p
              className={`pd-description-body${
                !(p as any).description ? " pd-description-body--empty" : ""
              }`}
            >
              {(p as any).description ?? "Project details coming soon."}
            </p>

            {(p as any).tags?.length > 0 && (
              <ul className="pd-tags" aria-label="Tags">
                {(p as any).tags.map((tag: string) => (
                  <li key={tag} className="pd-tag">{tag}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <div className="pd-rule" aria-hidden="true" />

      {/* ── Prev / Next navigation ───────────────────────────────────────────── */}
      <nav
        className={`pd-project-nav${navVisible ? " pd-project-nav--visible" : ""}`}
        aria-label="Project navigation"
      >
        <div className="pd-project-nav-inner">
          <ProjectNavCard
            project={prevProject}
            direction="prev"
            onClick={() => prevProject && navigate(`/projects/${prevProject.id}`)}
          />

          <Link
            to="/#projects"
            className="pd-nav-all"
            aria-label="View all projects"
          >
            <span className="pd-nav-all-grid" aria-hidden="true">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className="pd-nav-all-dot" />
              ))}
            </span>
            <span className="pd-nav-all-label">All</span>
          </Link>

          <ProjectNavCard
            project={nextProject}
            direction="next"
            onClick={() => nextProject && navigate(`/projects/${nextProject.id}`)}
          />
        </div>
      </nav>
    </div>
  );
}