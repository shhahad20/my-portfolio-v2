import { useEffect, useRef, useState, useCallback } from "react";
import "./style/Testimonials.scss";
import { API_URL } from "../api/api";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  display_order: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants  — ANIM_DURATION must equal $anim-dur in Testimonials.scss
// ─────────────────────────────────────────────────────────────────────────────

const AUTOPLAY_DELAY  = 5000;  // ms between auto-advances
const ANIM_DURATION   = 500;   // ms — sync with $anim-dur in SCSS

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getVisibleCount(): number {
  if (typeof window === "undefined") return 2;
  return window.innerWidth <= 768 ? 1 : 2;
}

function wrap(index: number, total: number): number {
  return ((index % total) + total) % total;
}

// ─────────────────────────────────────────────────────────────────────────────
// TestimonialCard
// ─────────────────────────────────────────────────────────────────────────────

interface CardProps {
  testimonial: Testimonial;
  /** Used only for the 60 ms stagger on the second card in a pair. */
  index: number;
}

function TestimonialCard({ testimonial, index }: CardProps) {
  const staggerStyle = index === 1 ? { animationDelay: "60ms" } : undefined;

  return (
    <article
      className="testimonial-card"
      style={staggerStyle}
      aria-label={`Testimonial from ${testimonial.name}`}
    >
      {/* <span className="card__quote-mark" aria-hidden="true">"</span> */}

      <p className="card__text" dir="rtl" lang="ar">
        {testimonial.text}
      </p>

      <div className="card__divider" />

      <footer className="card__author">
        <div className="card__author-avatar" aria-hidden="true">
          {testimonial.name.charAt(0)}
        </div>
        <div className="card__author-info">
          <span className="card__author-name">{testimonial.name}</span>
          <span className="card__author-role">{testimonial.role}</span>
        </div>
      </footer>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CardGrid — a positioned layer inside the stage
// ─────────────────────────────────────────────────────────────────────────────

interface GridLayerProps {
  items: Testimonial[];
  cols: number;
  /** CSS class applied to the wrapping grid div (drives the animation). */
  layerClass?: string;
  /** aria-hidden when this layer is decorative / invisible. */
  hidden?: boolean;
}

function GridLayer({ items, cols, layerClass = "", hidden = false }: GridLayerProps) {
  return (
    <div
      className={`stage__grid stage__grid--cols-${cols} ${layerClass}`.trim()}
      aria-hidden={hidden || undefined}
    >
      {items.map((t, i) => (
        <TestimonialCard key={t.id} testimonial={t} index={i} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dots
// ─────────────────────────────────────────────────────────────────────────────

interface DotsProps {
  total: number;
  current: number;
  onSelect: (i: number) => void;
  progress: number; // 0–1
}

function Dots({ total, current, onSelect, progress }: DotsProps) {
  return (
    <div className="dots" role="tablist" aria-label="Testimonial navigation">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === current}
          aria-label={`Go to testimonial group ${i + 1}`}
          className={`dots__dot${i === current ? " dots__dot--active" : ""}`}
          onClick={() => onSelect(i)}
        >
          {i === current && (
            <span
              className="dots__progress"
              style={{ transform: `scaleX(${progress})` }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TestimonialsSection
// ─────────────────────────────────────────────────────────────────────────────

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading]           = useState(true);
  const [visibleCount, setVisibleCount] = useState<number>(getVisibleCount());

  // Page state
  const [currentPage, setCurrentPage]   = useState(0);
  const [exitingPage, setExitingPage]   = useState<number | null>(null);
  const [direction, setDirection]       = useState<"next" | "prev">("next");
  const isTransitioning                 = exitingPage !== null;

  // Autoplay
  const [progress, setProgress] = useState(0);
  const [paused, setPaused]     = useState(false);

  const rafRef           = useRef<number>(0);
  const progressStart    = useRef<number | null>(null);
  const transitionLockRef = useRef(false);

  // ── Fetch ────────────────────────────────────────────────────────────────

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch(`${API_URL}/testimonials`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        setTestimonials(
          result.success && Array.isArray(result.data) ? result.data : []
        );
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  // ── Responsive count ──────────────────────────────────────────────────────

  useEffect(() => {
    const onResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────

  const totalPages = testimonials.length > 0
    ? Math.ceil(testimonials.length / visibleCount)
    : 0;

  const getPageItems = useCallback(
    (p: number): Testimonial[] => {
      const start = wrap(p, totalPages) * visibleCount;
      return testimonials.slice(start, start + visibleCount);
    },
    [testimonials, totalPages, visibleCount]
  );

  // ── Navigation ────────────────────────────────────────────────────────────
  //
  // Layout-shift-free strategy:
  //   1. A "ghost" grid (visibility:hidden) always renders the CURRENT page
  //      items, so the stage container has a stable, content-driven height.
  //   2. Two absolutely-positioned layers overlay the ghost:
  //      • "exiting" layer  → the old page, animating out
  //      • "entering" layer → the new page, animating in
  //   3. After ANIM_DURATION ms the exiting layer is removed from the DOM
  //      and we return to the idle (single layer) state.
  //
  // Because the ghost is always present the section never collapses/jumps.

  const goTo = useCallback(
    (target: number, dir: "next" | "prev") => {
      if (transitionLockRef.current || totalPages <= 1) return;
      transitionLockRef.current = true;

      const nextPage = wrap(target, totalPages);
      setDirection(dir);
      setExitingPage(currentPage);    // keep old page in DOM for exit anim
      setCurrentPage(nextPage);       // ghost immediately reflects new page

      // Reset autoplay progress
      progressStart.current = null;
      setProgress(0);

      setTimeout(() => {
        setExitingPage(null);          // remove exit layer
        transitionLockRef.current = false;
      }, ANIM_DURATION);
    },
    [currentPage, totalPages]
  );

  const next = useCallback(() => goTo(currentPage + 1, "next"), [currentPage, goTo]);
  const prev = useCallback(() => goTo(currentPage - 1, "prev"), [currentPage, goTo]);

  // ── Autoplay RAF loop ─────────────────────────────────────────────────────

  useEffect(() => {
    if (paused || totalPages <= 1 || loading) return;

    let cancelled = false;

    function tick(ts: number) {
      if (cancelled) return;
      if (progressStart.current === null) progressStart.current = ts;

      const ratio = Math.min((ts - progressStart.current) / AUTOPLAY_DELAY, 1);
      setProgress(ratio);

      if (ratio < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        next();
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
    };
  // next changes identity when currentPage changes → re-run to reset progress
  }, [paused, totalPages, loading, currentPage, next]);

  const handleMouseEnter = () => {
    setPaused(true);
    cancelAnimationFrame(rafRef.current);
  };

  const handleMouseLeave = () => {
    setPaused(false);
    progressStart.current = null;
    setProgress(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft")  prev();
  };

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="testimonials-section testimonials-section--loading">
        <div className={`skeleton-grid skeleton-grid--cols-${getVisibleCount()}`}>
          {[0, 1].map((i) => <div key={i} className="skeleton-card" />)}
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="testimonials-section testimonials-section--empty">
        <p className="empty-message">No testimonials available.</p>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const currentItems = getPageItems(currentPage);
  const exitingItems = exitingPage !== null ? getPageItems(exitingPage) : [];

  // Direction-based animation class names
  const exitClass  = direction === "next" ? "layer--exit-left"   : "layer--exit-right";
  const enterClass = direction === "next" ? "layer--enter-right"  : "layer--enter-left";

  return (
    <section
      className="testimonials-section"
      aria-label="Testimonials"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* ── Header ── */}
      <header className="testimonials-header">
        <div className="testimonials-header__meta">
          <span className="testimonials-header__label">What clients say</span>
          <span className="testimonials-header__index">
            {String(currentPage + 1).padStart(2, "0")}&thinsp;/&thinsp;
            {String(totalPages).padStart(2, "0")}
          </span>
        </div>
        <h2 className="testimonials-header__title">
          The Word,
          <br />
          From Others
        </h2>
      </header>

      {/* ── Stage ── */}
      {/*
        The stage uses three layers stacked via CSS:
          [ghost]   — visibility:hidden, always in normal flow → pins height
          [exiting] — position:absolute, animates OUT (only during transition)
          [entering]— position:absolute, animates IN  (always present)
      */}
      <div
        className="testimonials-stage"
        role="region"
        aria-live="polite"
        aria-atomic="true"
      >
        {/* Ghost: determines the stage height, never visible */}
        <GridLayer
          items={currentItems}
          cols={visibleCount}
          layerClass="stage__grid--ghost"
          hidden
        />

        {/* Exiting layer: old cards slide out */}
        {isTransitioning && (
          <GridLayer
            items={exitingItems}
            cols={visibleCount}
            layerClass={`stage__grid--overlay ${exitClass}`}
            hidden
          />
        )}

        {/* Entering / idle layer: new cards slide in (or sit idle) */}
        <GridLayer
          items={currentItems}
          cols={visibleCount}
          layerClass={`stage__grid--overlay${isTransitioning ? ` ${enterClass}` : ""}`}
        />
      </div>

      {/* ── Controls ── */}
      <div className="testimonials-controls">
        <Dots
          total={totalPages}
          current={currentPage}
          onSelect={(i) => goTo(i, i > currentPage ? "next" : "prev")}
          progress={progress}
        />

        <div className="testimonials-arrows">
          <button
            className="arrow-btn"
            onClick={prev}
            aria-label="Previous testimonials"
            disabled={isTransitioning}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            className="arrow-btn"
            onClick={next}
            aria-label="Next testimonials"
            disabled={isTransitioning}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}