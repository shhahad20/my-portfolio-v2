import { useState, useRef, useEffect } from "react";
import './style/projects.scss';

/* ─── Data ──────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: "GITHUB",    href: "#" },
  { label: "INSTAGRAM", href: "#" },
  { label: "BEHANCE",   href: "#" },
];

/**
 * Projects — replace `bg` with a real image URL / video src when ready.
 * The component treats any value that starts with "http" or "/" as a media URL.
 */
const PROJECTS = [
  { id: 0,  label: "Design Systems",      bg: "#c8cec5", accent: "#2d3a29" },
  { id: 1,  label: "Motion Graphics",     bg: "#c5c8ce", accent: "#29303a" },
  { id: 2,  label: "Brand Identity",      bg: "https://puakrabhbhosdpyxfsfk.supabase.co/storage/v1/object/public/images/Hillside%2017.png", accent: "#3a2929" },
  { id: 3,  label: "3D Visualization",    bg: "#c5cece", accent: "#293a3a" },
  { id: 4,  label: "Web Development",     bg: "#cec8c5", accent: "#3a3029" },
  { id: 5,  label: "Photography",         bg: "#c5c5ce", accent: "#29293a" },
  { id: 6,  label: "UI/UX Research",      bg: "#cec5c8", accent: "#3a2930" },
  { id: 7,  label: "Typography",          bg: "#c8cec5", accent: "#303a2d" },
  { id: 8,  label: "Illustration",        bg: "#cecec5", accent: "#3a3a29" },
  { id: 9,  label: "Prototyping",         bg: "#c5c8c5", accent: "#2d302d" },
  { id: 10, label: "Creative Coding",     bg: "#c8c5ce", accent: "#30293a" },
  { id: 11, label: "Video Editing",       bg: "#cec5ce", accent: "#3a293a" },
  { id: 12, label: "Art Direction",       bg: "#c5cec8", accent: "#293a30" },
  { id: 13, label: "Interaction Design",  bg: "#cec8ce", accent: "#3a303a" },
  { id: 14, label: "Data Visualization",  bg: "#c5cec5", accent: "#293a29" },
  { id: 15, label: "Product Design",      bg: "#cec5c5", accent: "#3a2929" },
  { id: 16, label: "Animation",           bg: "#c8c8ce", accent: "#30303a" },
  { id: 17, label: "User Research",       bg: "#cecec8", accent: "#3a3a30" },
  { id: 18, label: "Print Design",        bg: "#c5c8ce", accent: "#293040" },
  { id: 19, label: "AR / VR",             bg: "#cec8c5", accent: "#3a3029" },
  { id: 20, label: "Copywriting",         bg: "#c8cec8", accent: "#303a30" },
  { id: 21, label: "Concept Art",         bg: "#c8c5c8", accent: "#30293a" },
  { id: 22, label: "Sound Design",        bg: "#c5c5c8", accent: "#292930" },
  { id: 23, label: "Generative Art",      bg: "#c8c5c5", accent: "#302929" },
];

/**
 * DESKTOP — Two concentric rings around the center circle at (51%, 47%).
 *
 * Layer 1 — inner ring (r ≈ 16 % width), 8 circles, 45° step.
 * Layer 2 — outer ring (r ≈ 26 % width), 16 circles, 22.5° step.
 * Y-offsets are scaled by the 16:11 aspect ratio so the rings read
 * as true circles in pixel space.
 */
const SATELLITES_DESKTOP = [
  // ── Inner ring ────────────────────────────────────────────────────────────
  { id: 0,  x: 51,  y: 24  },
  { id: 1,  x: 62,  y: 31  },
  { id: 2,  x: 67,  y: 47  },
  { id: 3,  x: 62,  y: 63  },
  { id: 4,  x: 51,  y: 70  },
  { id: 5,  x: 40,  y: 63  },
  { id: 6,  x: 35,  y: 47  },
  { id: 7,  x: 40,  y: 31  },
  // ── Outer ring ────────────────────────────────────────────────────────────
  { id: 8,  x: 51,  y: 9   },
  { id: 9,  x: 61,  y: 12  },
  { id: 10, x: 69,  y: 20  },
  { id: 11, x: 75,  y: 33  },
  { id: 12, x: 77,  y: 47  },
  { id: 13, x: 75,  y: 61  },
  { id: 14, x: 69,  y: 74  },
  { id: 15, x: 61,  y: 82  },
  { id: 16, x: 51,  y: 85  },
  { id: 17, x: 41,  y: 82  },
  { id: 18, x: 33,  y: 74  },
  { id: 19, x: 27,  y: 61  },
  { id: 20, x: 25,  y: 47  },
  { id: 21, x: 27,  y: 33  },
  { id: 22, x: 33,  y: 20  },
  { id: 23, x: 41,  y: 12  },
];

/**
 * MOBILE — 4-column × 6-row aligned grid inside a portrait (2:3) field.
 *
 * Columns  x : [18, 39, 63, 82] %
 * Rows     y : [6, 18, 30, ·, 62, 74, 86] % — gap at ~47 % for center circle.
 *
 * Closest satellite to center (51 %, 47 %):
 *   (39 %, 30 %) → Δx = 45 px, Δy = 96 px (at 375 × 562 px)
 *   distance ≈ 106 px  >  clearance (40 + 21 = 61 px) ✓
 */
const SATELLITES_MOBILE = [
  // Row 1 — y = 6 %
  { id: 0,  x: 18, y: 6  },
  { id: 1,  x: 39, y: 6  },
  { id: 2,  x: 63, y: 6  },
  { id: 3,  x: 82, y: 6  },
  // Row 2 — y = 18 %
  { id: 4,  x: 18, y: 18 },
  { id: 5,  x: 39, y: 18 },
  { id: 6,  x: 63, y: 18 },
  { id: 7,  x: 82, y: 18 },
  // Row 3 — y = 30 % (above center gap)
  { id: 8,  x: 18, y: 30 },
  { id: 9,  x: 39, y: 30 },
  { id: 10, x: 63, y: 30 },
  { id: 11, x: 82, y: 30 },
  //  ·····  center circle at (51 %, 47 %)  ·····
  // Row 4 — y = 62 % (below center gap)
  { id: 12, x: 18, y: 62 },
  { id: 13, x: 39, y: 62 },
  { id: 14, x: 63, y: 62 },
  { id: 15, x: 82, y: 62 },
  // Row 5 — y = 74 %
  { id: 16, x: 18, y: 74 },
  { id: 17, x: 39, y: 74 },
  { id: 18, x: 63, y: 74 },
  { id: 19, x: 82, y: 74 },
  // Row 6 — y = 86 %
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

const isVideo = (src: string) =>
  isMedia(src) && /\.(mp4|webm|ogg)$/i.test(src);

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function WhatKeepsMeBusy() {
  const [hoverId, setHoverId] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Responsive layout switch ── */
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const satellites = isMobile ? SATELLITES_MOBILE : SATELLITES_DESKTOP;
  const active = hoverId !== null ? PROJECTS[hoverId] : null;

  /* Small debounce so the center doesn't flicker between adjacent circles */
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
            <a
              key={label}
              href={href}
              className="wkmb-nav-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {label}<span className="wkmb-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
      </header>

      {/* ── Circle Field ─────────────────────────────────────── */}
      <main
        className={`wkmb-field${isMobile ? " wkmb-field--mobile" : ""}`}
        aria-label="Portfolio projects"
      >
        {/* Satellite circles */}
        {satellites.map((s) => (
          <div
            key={s.id}
            className={`wkmb-sat${hoverId === s.id ? " wkmb-sat--active" : ""}`}
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            onMouseEnter={() => handleEnter(s.id)}
            onMouseLeave={handleLeave}
            onTouchStart={() => handleEnter(s.id)}
            onTouchEnd={handleLeave}
            role="button"
            tabIndex={0}
            aria-label={PROJECTS[s.id].label}
            onKeyDown={(e) => e.key === "Enter" && handleEnter(s.id)}
            onFocus={() => handleEnter(s.id)}
            onBlur={handleLeave}
          />
        ))}

        {/* Center circle */}
        <div
          className="wkmb-center"
          style={{
            left: `${CENTER_X}%`,
            top: `${CENTER_Y}%`,
            background: active ? active.bg : "transparent",
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          {/* Media layer (image / video) */}
          {active && isMedia(active.bg) && (
            isVideo(active.bg) ? (
              <video
                key={active.id}
                className="wkmb-media"
                src={active.bg}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                key={active.id}
                className="wkmb-media"
                src={active.bg}
                alt={active.label}
              />
            )
          )}

          {/* Text overlay */}
          <div className="wkmb-center-label">
            {active ? (
              <span
                className="wkmb-center-project"
                style={{ color: active.accent }}
              >
                {active.label}
              </span>
            ) : (
              <span className="wkmb-center-idle">
                Choose a circle<br />to <em>Explore</em>
              </span>
            )}
          </div>
        </div>
      </main>

      {/* Bottom accent line */}
      <div className="wkmb-baseline" />
    </div>
  );
}