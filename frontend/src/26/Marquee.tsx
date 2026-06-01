import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./style/Marquee.scss";
import { API_URL } from "../api/api";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

/** Delay (ms) after viewport entry before the marquee starts scrolling */
const MARQUEE_START_DELAY_MS = 700;

/** Skeleton cards rendered per row while fetching */
const SKELETON_COUNT = 6;

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface Testimonial {
  id: string;
  name: string;
  role?: string;
  text: string;
}

interface TestimonialsApiResponse {
  success: boolean;
  data: Testimonial[];
}

type MarqueeDirection = "left" | "right";

interface MarqueeProps {
  children: React.ReactNode;
  direction?: MarqueeDirection;
  /** Duration in seconds — lower = faster. Default: 40 */
  speed?: number;
  pauseOnHover?: boolean;
  /** Any valid CSS length. Default: "1.25rem" */
  gap?: string;
  /** Times children are duplicated for seamless looping. Default: 2 */
  repeat?: number;
  /** Gates the scroll animation — false keeps it paused. Default: true */
  isPlaying?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK — useIntersectionObserver
// ─────────────────────────────────────────────────────────────────────────────

function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  options: UseIntersectionObserverOptions = {},
): { ref: React.RefCallback<T>; isIntersecting: boolean } {
  const { threshold = 0.15, rootMargin = "0px", once = true } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => () => observerRef.current?.disconnect(), []);

  const ref = useCallback(
    (node: T | null) => {
      observerRef.current?.disconnect();
      if (!node) return;

      if (typeof IntersectionObserver === "undefined") {
        setIsIntersecting(true);
        return;
      }

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            if (once) observerRef.current?.disconnect();
          } else if (!once) {
            setIsIntersecting(false);
          }
        },
        { threshold, rootMargin },
      );

      observerRef.current.observe(node);
    },
    [threshold, rootMargin, once],
  );

  return { ref, isIntersecting };
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK — useTestimonials
// ─────────────────────────────────────────────────────────────────────────────

function useTestimonials(): {
  testimonials: Testimonial[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/testimonials`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const result: TestimonialsApiResponse = await res.json();
      setTestimonials(
        result.success && Array.isArray(result.data) ? result.data : [],
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("[useTestimonials]", message);
      setError(message);
      setTestimonials([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  return { testimonials, isLoading, error, refetch: fetchTestimonials };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT — Marquee
// ─────────────────────────────────────────────────────────────────────────────

const Marquee: React.FC<MarqueeProps> = ({
  children,
  direction = "left",
  speed = 40,
  pauseOnHover = true,
  gap = "1.25rem",
  repeat = 2,
  isPlaying = true,
  className = "",
  style,
  ariaLabel = "Scrolling marquee",
}) => {
  const cssVars = {
    "--marquee-duration": `${speed}s`,
    "--marquee-gap": gap,
  } as CSSProperties;

  const trackClasses = [
    "marquee__track",
    `marquee__track--${direction}`,
    pauseOnHover ? "marquee__track--pause-on-hover" : "",
    !isPlaying ? "marquee__track--paused" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={`marquee ${className}`.trim()}
      style={{ ...cssVars, ...style }}
      aria-label={ariaLabel}
      aria-live="off"
      aria-roledescription="marquee"
    >
      <div className="marquee__fade marquee__fade--left" aria-hidden="true" />
      <div className="marquee__fade marquee__fade--right" aria-hidden="true" />

      <div className="marquee__viewport" aria-hidden="true">
        {Array.from({ length: repeat }).map((_, i) => (
          <div key={i} className={trackClasses}>
            {children}
          </div>
        ))}
      </div>

      {/* Static copy for assistive technology */}
      <div className="marquee__sr-only">{children}</div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT — TestimonialCard
// ─────────────────────────────────────────────────────────────────────────────

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({
  testimonial,
}) => {
  const { name, text, role } = testimonial;
  //   const bylineParts = [role, name].filter(Boolean);
  //   const byline      = bylineParts.length > 0 ? bylineParts.join(", ") : undefined;

  return (
    <article
      className="t-card"
      aria-label={`Testimonial from ${name}${role ? `, ${role}` : ""}`}
    >
      <blockquote className="t-card__quote">
        <p>{text}</p>
      </blockquote>

      <footer className="t-card__author">
        <span className="t-card__name">{name}</span>

        {/* {handle && (
          <span className="t-card__handle" aria-hidden="true">
            {handle}
          </span>
        )} */}

        {role && (
          <>
            <span className="t-card__sep" aria-hidden="true">
              ·
            </span>
            <span className="t-card__byline">{role}</span>
          </>
        )}
      </footer>
    </article>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT — SkeletonRow
// ─────────────────────────────────────────────────────────────────────────────

const SkeletonRow: React.FC = () => (
  <div className="testimonials__skeleton" aria-hidden="true">
    {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
      <div key={i} className="skeleton-card" />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — splitIntoRows
// ─────────────────────────────────────────────────────────────────────────────

function splitIntoRows(items: Testimonial[]): [Testimonial[], Testimonial[]] {
  if (items.length < 2) return [items, items];
  const mid = Math.ceil(items.length / 2);
  return [items.slice(0, mid), items.slice(mid)];
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT — TestimonialsSection (default export)
// ─────────────────────────────────────────────────────────────────────────────

const TestimonialsSection: React.FC = () => {
  const { testimonials, isLoading, error } = useTestimonials();
  const [rowOne, rowTwo] = useMemo(
    () => splitIntoRows(testimonials),
    [testimonials],
  );

  // Entrance — fires once at 12% viewport visibility
  const { ref: sectionRef, isIntersecting } =
    useIntersectionObserver<HTMLElement>({
      threshold: 0.12,
      rootMargin: "0px",
      once: true,
    });

  // Marquee starts paused; begins scrolling after entrance animations settle
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isIntersecting) return;
    const id = window.setTimeout(
      () => setIsPlaying(true),
      MARQUEE_START_DELAY_MS,
    );
    return () => window.clearTimeout(id);
  }, [isIntersecting]);

  return (
    <section
      ref={sectionRef}
      className={`testimonials-section${isIntersecting ? " is-visible" : ""}`}
      aria-labelledby="testimonials-heading"
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="section-header">
        <h2 className="section-header__title" id="testimonials-heading">
          The Word,
          <br />
          From Others
          <span className="section-header__index" aria-hidden="true">
            05
          </span>
        </h2>
      </header>

      {/* ── Marquee rows ─────────────────────────────────────────────────────── */}
      <div
        className="testimonials-section__rows"
        role="region"
        aria-label="Customer testimonials"
      >
        {isLoading && (
          <>
            <SkeletonRow />
            <SkeletonRow />
          </>
        )}

        {!isLoading && error && (
          <p className="testimonials-section__error" role="alert">
            Could not load testimonials. Please try again later.
          </p>
        )}

        {!isLoading && !error && testimonials.length > 0 && (
          <>
            <Marquee
              direction="left"
              speed={48}
              gap="1rem"
              pauseOnHover
              repeat={2}
              isPlaying={isPlaying}
              ariaLabel="Testimonials row one, scrolling left"
            >
              {rowOne.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </Marquee>

            <Marquee
              direction="right"
              speed={40}
              gap="1rem"
              pauseOnHover
              repeat={2}
              isPlaying={isPlaying}
              ariaLabel="Testimonials row two, scrolling right"
            >
              {rowTwo.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </Marquee>
          </>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
