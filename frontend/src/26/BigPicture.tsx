// 'use client'; // ← Uncomment if using Next.js App Router

import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  animate,
} from 'framer-motion';
import './style/BigPicture.scss';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface IconProps {
  /** triggers SVG path-draw animation once */
  active: boolean;
}

interface StatConfig {
  id: string;
  target: number | null; // null → "Unlimited / ∞"
  suffix: string;
  primaryLine: string;
  secondaryLine: string;
  description: string;
  index: string;
  Icon: React.FC<IconProps>;
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG Icon: Clients & Students
// ─────────────────────────────────────────────────────────────────────────────

const ClientsIcon: React.FC<IconProps> = ({ active }) => {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: i * 0.22, duration: 0.9, ease: [0.23, 1, 0.32, 1] as const },
        opacity: { delay: i * 0.22, duration: 0.25 },
      },
    }),
  };
  const pop = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        scale: { delay: i * 0.22, duration: 0.38, ease: [0.34, 1.56, 0.64, 1] as const },
        opacity: { delay: i * 0.22, duration: 0.2 },
      },
    }),
  };

  return (
    <motion.svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="bp-icon"
    >
      {/* Person 2 – back */}
      <motion.circle
        cx="68" cy="29" r="12"
        stroke="currentColor" strokeWidth="2"
        variants={draw} custom={2}
        initial="hidden" animate={active ? 'visible' : 'hidden'}
        style={{ opacity: 0.45 }}
      />
      <motion.path
        d="M 44 82 C 44 61 94 61 94 82"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        variants={draw} custom={3}
        initial="hidden" animate={active ? 'visible' : 'hidden'}
        style={{ opacity: 0.38 }}
      />
      {/* Person 1 – front */}
      <motion.circle
        cx="34" cy="26" r="15"
        stroke="currentColor" strokeWidth="2.5"
        variants={draw} custom={0}
        initial="hidden" animate={active ? 'visible' : 'hidden'}
      />
      <motion.path
        d="M 5 82 C 5 57 65 57 65 82"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        variants={draw} custom={1}
        initial="hidden" animate={active ? 'visible' : 'hidden'}
      />
      {/* Connection arc */}
      <motion.path
        d="M 34 41 Q 51 55 68 41"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        strokeDasharray="4 3"
        variants={draw} custom={4}
        initial="hidden" animate={active ? 'visible' : 'hidden'}
        style={{ opacity: 0.4 }}
      />
      {/* Center node */}
      <motion.circle
        cx="51" cy="54" r="3.5"
        fill="currentColor"
        variants={pop} custom={5}
        initial="hidden" animate={active ? 'visible' : 'hidden'}
        style={{ opacity: 0.55 }}
      />
    </motion.svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SVG Icon: Projects & Designs
// ─────────────────────────────────────────────────────────────────────────────

const ProjectsIcon: React.FC<IconProps> = ({ active }) => {
  const revealRect = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: (i: number) => ({
      scaleX: 1,
      opacity: 1,
      transition: {
        scaleX: { delay: i * 0.18, duration: 0.55, ease: [0.23, 1, 0.32, 1] as const },
        opacity: { delay: i * 0.18, duration: 0.22 },
      },
    }),
  };
  const revealLine = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: 0.6 + i * 0.14, duration: 0.45, ease: [0.23, 1, 0.32, 1] as const },
        opacity: { delay: 0.6 + i * 0.14, duration: 0.18 },
      },
    }),
  };
  const popDot = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 0.75,
      transition: { delay: 1.0, duration: 0.36, ease: [0.34, 1.56, 0.64, 1] as const },
    },
  };

  return (
    <motion.svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="bp-icon"
    >
      {/* Layer 3 (bottom) */}
      <motion.rect
        x="16" y="68" width="68" height="22" rx="3"
        stroke="currentColor" strokeWidth="2"
        variants={revealRect} custom={2}
        initial="hidden" animate={active ? 'visible' : 'hidden'}
        style={{ transformOrigin: '50px 79px', opacity: 0.3 }}
      />
      {/* Layer 2 (middle) */}
      <motion.rect
        x="10" y="44" width="80" height="26" rx="3"
        stroke="currentColor" strokeWidth="2"
        variants={revealRect} custom={1}
        initial="hidden" animate={active ? 'visible' : 'hidden'}
        style={{ transformOrigin: '50px 57px', opacity: 0.58 }}
      />
      {/* Layer 1 (top) */}
      <motion.rect
        x="6" y="14" width="88" height="32" rx="4"
        stroke="currentColor" strokeWidth="2.5"
        variants={revealRect} custom={0}
        initial="hidden" animate={active ? 'visible' : 'hidden'}
        style={{ transformOrigin: '50px 30px' }}
      />
      {/* Title line */}
      <motion.line
        x1="18" y1="30" x2="68" y2="30"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        variants={revealLine} custom={0}
        initial="hidden" animate={active ? 'visible' : 'hidden'}
      />
      {/* Sub-line */}
      <motion.line
        x1="18" y1="22" x2="46" y2="22"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        style={{ opacity: 0.6 }}
        variants={revealLine} custom={1}
        initial="hidden" animate={active ? 'visible' : 'hidden'}
      />
      {/* Accent dot */}
      <motion.circle
        cx="80" cy="22" r="3.5"
        fill="currentColor"
        variants={popDot}
        initial="hidden" animate={active ? 'visible' : 'hidden'}
      />
    </motion.svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SVG Icon: GitHub Repos
// ─────────────────────────────────────────────────────────────────────────────

const ReposIcon: React.FC<IconProps> = ({ active }) => {
  const drawLine = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: i * 0.2, duration: 0.68, ease: [0.23, 1, 0.32, 1] as const },
        opacity: { delay: i * 0.2, duration: 0.2 },
      },
    }),
  };
  const popCircle = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        scale: { delay: 0.08 + i * 0.16, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] as const },
        opacity: { delay: 0.08 + i * 0.16, duration: 0.18 },
      },
    }),
  };

  const mainCy = [8, 36, 64, 92];

  return (
    <motion.svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="bp-icon"
    >
      {/* Main branch */}
      <motion.line
        x1="28" y1="8" x2="28" y2="92"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        variants={drawLine} custom={0}
        initial="hidden" animate={active ? 'visible' : 'hidden'}
      />
      {/* Feature branch 1 */}
      <motion.path
        d="M 28 36 Q 50 36 50 52 L 50 92"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"
        variants={drawLine} custom={1}
        initial="hidden" animate={active ? 'visible' : 'hidden'}
        style={{ opacity: 0.7 }}
      />
      {/* Feature branch 2 */}
      <motion.path
        d="M 50 68 Q 66 68 66 80 L 66 92"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"
        variants={drawLine} custom={2}
        initial="hidden" animate={active ? 'visible' : 'hidden'}
        style={{ opacity: 0.42 }}
      />
      {/* Main commits */}
      {mainCy.map((cy, i) => (
        <motion.circle
          key={`mc-${cy}`}
          cx="28" cy={cy} r={i === 0 ? 5.5 : 4}
          stroke="currentColor" strokeWidth="2.5" fill="var(--bp-surface)"
          variants={popCircle} custom={i}
          initial="hidden" animate={active ? 'visible' : 'hidden'}
        />
      ))}
      {/* Branch 1 commit */}
      <motion.circle
        cx="50" cy="92" r="3.5"
        stroke="currentColor" strokeWidth="2" fill="var(--bp-surface)"
        variants={popCircle} custom={4}
        initial="hidden" animate={active ? 'visible' : 'hidden'}
        style={{ opacity: 0.8 }}
      />
      {/* Branch 2 commit */}
      <motion.circle
        cx="66" cy="92" r="3"
        stroke="currentColor" strokeWidth="2" fill="var(--bp-surface)"
        variants={popCircle} custom={5}
        initial="hidden" animate={active ? 'visible' : 'hidden'}
        style={{ opacity: 0.5 }}
      />
    </motion.svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SVG Icon: Cups of Coffee
// ─────────────────────────────────────────────────────────────────────────────

const CoffeeIcon: React.FC<IconProps> = ({ active }) => {
  const drawPath = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: i * 0.2, duration: 0.72, ease: [0.23, 1, 0.32, 1] as const },
        opacity: { delay: i * 0.2, duration: 0.22 },
      },
    }),
  };
  const revealRim = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: { delay: 0.08, duration: 0.5, ease: [0.23, 1, 0.32, 1] as const },
    },
  };

  const steamPaths = [
    'M 28 18 Q 34 10 28 3',
    'M 43 18 Q 49 10 43 3',
    'M 58 18 Q 64 10 58 3',
  ];

  return (
    <motion.svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="bp-icon bp-icon--coffee"
    >
      {/* Steam wrapper – reveals after cup is drawn */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.1, duration: 0.4 }}
      >
        {steamPaths.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
            className="bp-steam"
            style={{ '--steam-delay': `${i * 0.4}s` } as React.CSSProperties}
          />
        ))}
      </motion.g>

      {/* Cup rim */}
      <motion.rect
        x="14" y="22" width="58" height="8" rx="3"
        stroke="currentColor" strokeWidth="2.5"
        variants={revealRim}
        initial="hidden" animate={active ? 'visible' : 'hidden'}
        style={{ transformOrigin: '43px 26px' }}
      />
      {/* Cup body */}
      <motion.path
        d="M 18 30 L 24 88 Q 24 94 30 94 L 56 94 Q 62 94 62 88 L 68 30"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        variants={drawPath} custom={1}
        initial="hidden" animate={active ? 'visible' : 'hidden'}
      />
      {/* Handle */}
      <motion.path
        d="M 68 44 Q 84 44 84 60 Q 84 76 68 76"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"
        variants={drawPath} custom={2}
        initial="hidden" animate={active ? 'visible' : 'hidden'}
      />
      {/* Liquid surface */}
      <motion.path
        d="M 22 52 Q 43 58 68 52"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"
        variants={drawPath} custom={3}
        initial="hidden" animate={active ? 'visible' : 'hidden'}
        style={{ opacity: 0.42 }}
      />
    </motion.svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Stat Configuration
// ─────────────────────────────────────────────────────────────────────────────

const STATS: StatConfig[] = [
  {
    id: 'clients',
    target: 105,
    suffix: '+',
    primaryLine: 'Clients &',
    secondaryLine: '160 Students',
    description: 'Trusted by professionals and learners across the globe.',
    index: '01',
    Icon: ClientsIcon,
  },
  {
    id: 'projects',
    target: 272,
    suffix: '+',
    primaryLine: 'Projects &',
    secondaryLine: 'Designs',
    description: 'From early explorations to production-grade digital products.',
    index: '02',
    Icon: ProjectsIcon,
  },
  {
    id: 'repos',
    target: 71,
    suffix: '+',
    primaryLine: 'GitHub',
    secondaryLine: 'Repositories',
    description: 'Open-source contributions and personal experiments in code.',
    index: '03',
    Icon: ReposIcon,
  },
  {
    id: 'coffee',
    target: null,
    suffix: '',
    primaryLine: 'Cups of',
    secondaryLine: 'Coffee',
    description: 'The only resource that remains truly inexhaustible.',
    index: '04',
    Icon: CoffeeIcon,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// BigPicture Component
// ─────────────────────────────────────────────────────────────────────────────

const BigPicture: React.FC = () => {
  /* ── Refs & Scroll ──────────────────────────────────────────────────────── */
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  /**
   * Smooth spring wrapper – stiffness/damping tuned for cinematic feel.
   * Increase stiffness or remove spring for sharper tracking on mobile.
   */
  const smooth = useSpring(scrollYProgress, {
    stiffness: 78,
    damping: 26,
    restDelta: 0.001,
  });

  /* ── Local state ────────────────────────────────────────────────────────── */
  const [activeStats, setActiveStats] = useState([false, false, false, false]);
  const [counts, setCounts] = useState(['0', '0', '0', '0']);

  /* ── Scroll Transforms ──────────────────────────────────────────────────── */

  // Progress bar width
  const progressWidth = useTransform(smooth, [0, 1], ['0%', '100%']);

  // Parallax backdrop drift
  const backdropY = useTransform(smooth, [0, 1], ['0%', '-12%']);

  // ── Scene 0: Intro ──────────────────────────────────────────────────────
  // Range: 0 → 0.15
  const s0Opacity = useTransform(smooth, [0, 0.04, 0.10, 0.16], [0, 1, 1, 0]);
  const s0Y       = useTransform(smooth, [0, 0.04, 0.10, 0.16], [28, 0, 0, -24]);

  // ── Scene 1: Clients ────────────────────────────────────────────────────
  // Range: 0.13 → 0.33
  const s1Opacity = useTransform(smooth, [0.13, 0.20, 0.27, 0.33], [0, 1, 1, 0]);
  const s1Y       = useTransform(smooth, [0.13, 0.20, 0.27, 0.33], [56, 0, 0, -44]);
  const s1Scale   = useTransform(smooth, [0.13, 0.20, 0.27, 0.33], [0.95, 1, 1, 1.04]);

  // ── Scene 2: Projects ───────────────────────────────────────────────────
  // Range: 0.30 → 0.50
  const s2Opacity = useTransform(smooth, [0.30, 0.37, 0.44, 0.50], [0, 1, 1, 0]);
  const s2Y       = useTransform(smooth, [0.30, 0.37, 0.44, 0.50], [56, 0, 0, -44]);
  const s2Scale   = useTransform(smooth, [0.30, 0.37, 0.44, 0.50], [0.95, 1, 1, 1.04]);

  // ── Scene 3: Repos ──────────────────────────────────────────────────────
  // Range: 0.47 → 0.67
  const s3Opacity = useTransform(smooth, [0.47, 0.54, 0.61, 0.67], [0, 1, 1, 0]);
  const s3Y       = useTransform(smooth, [0.47, 0.54, 0.61, 0.67], [56, 0, 0, -44]);
  const s3Scale   = useTransform(smooth, [0.47, 0.54, 0.61, 0.67], [0.95, 1, 1, 1.04]);

  // ── Scene 4: Coffee ─────────────────────────────────────────────────────
  // Range: 0.64 → 0.83
  const s4Opacity = useTransform(smooth, [0.64, 0.71, 0.78, 0.83], [0, 1, 1, 0]);
  const s4Y       = useTransform(smooth, [0.64, 0.71, 0.78, 0.83], [56, 0, 0, -44]);
  const s4Scale   = useTransform(smooth, [0.64, 0.71, 0.78, 0.83], [0.95, 1, 1, 1.04]);

  // ── Scene 5: Grid ───────────────────────────────────────────────────────
  // Range: 0.80 → 1.00 (persistent)
  const s5Opacity = useTransform(smooth, [0.80, 0.87], [0, 1]);
  const s5Y       = useTransform(smooth, [0.80, 0.87], [44, 0]);

  // Grid card stagger
  const gc0Opacity = useTransform(smooth, [0.81, 0.87], [0, 1]);
  const gc1Opacity = useTransform(smooth, [0.84, 0.90], [0, 1]);
  const gc2Opacity = useTransform(smooth, [0.87, 0.93], [0, 1]);
  const gc3Opacity = useTransform(smooth, [0.90, 0.96], [0, 1]);
  const gc0Y       = useTransform(smooth, [0.81, 0.88], [28, 0]);
  const gc1Y       = useTransform(smooth, [0.84, 0.91], [28, 0]);
  const gc2Y       = useTransform(smooth, [0.87, 0.94], [28, 0]);
  const gc3Y       = useTransform(smooth, [0.90, 0.97], [28, 0]);

  /* ── Counter & activation triggers ─────────────────────────────────────── */
  useEffect(() => {
    /**
     * Each threshold maps to when a stat scene is "fully in" (peak opacity).
     * Once crossed the counter animates and the SVG icon activates.
     */
    const TRIGGER_POINTS = [0.20, 0.37, 0.54, 0.71] as const;
    const triggered = [false, false, false, false];

    const unsub = smooth.onChange((v: number) => {
      TRIGGER_POINTS.forEach((tp, i) => {
        if (v >= tp && !triggered[i]) {
          triggered[i] = true;

          // Activate SVG icon animation
          setActiveStats((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });

          const target = STATS[i].target;
          if (target !== null) {
            // Smooth numeric counter
            animate(0, target, {
              duration: 1.85,
              ease: [0.23, 1, 0.32, 1],
              onUpdate: (val) =>
                setCounts((prev) => {
                  const next = [...prev];
                  next[i] = Math.round(val).toString();
                  return next;
                }),
            });
          } else {
            // Unlimited: rapid flip → ∞
            const flips = ['1', '7', '42', '99', '∞'];
            flips.forEach((s, j) =>
              setTimeout(
                () =>
                  setCounts((prev) => {
                    const next = [...prev];
                    next[i] = s;
                    return next;
                  }),
                j * 130,
              ),
            );
          }
        }
      });

      // Safety net: ensure everything is initialised when grid appears
      if (v >= 0.87 && triggered.some((t) => !t)) {
        STATS.forEach((stat, i) => {
          if (!triggered[i]) {
            triggered[i] = true;
            setActiveStats((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
            setCounts((prev) => {
              const next = [...prev];
              next[i] = stat.target !== null ? stat.target.toString() : '∞';
              return next;
            });
          }
        });
      }
    });

    return () => unsub();
    // smooth is a stable MotionValue ref – intentionally omitted from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Zipped transform arrays ────────────────────────────────────────────── */
  const sceneTransforms = [
    { opacity: s1Opacity, y: s1Y, scale: s1Scale },
    { opacity: s2Opacity, y: s2Y, scale: s2Scale },
    { opacity: s3Opacity, y: s3Y, scale: s3Scale },
    { opacity: s4Opacity, y: s4Y, scale: s4Scale },
  ];

  const cardTransforms = [
    { opacity: gc0Opacity, y: gc0Y },
    { opacity: gc1Opacity, y: gc1Y },
    { opacity: gc2Opacity, y: gc2Y },
    { opacity: gc3Opacity, y: gc3Y },
  ];

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <section
      ref={containerRef}
      className="big-picture"
      aria-label="Career statistics"
    >
      <div className="big-picture__sticky">

        {/* ── Scroll progress bar ──────────────────────────────────────── */}
        <motion.div
          className="bp-progress-bar"
          style={{ width: progressWidth }}
          aria-hidden="true"
        />

        {/* ── Parallax backdrop glow ───────────────────────────────────── */}
        <motion.div
          className="bp-backdrop"
          style={{ y: backdropY }}
          aria-hidden="true"
        />

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* Scene 0 – Intro                                               */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <motion.div
          className="bp-scene bp-scene--intro"
          style={{ opacity: s0Opacity, y: s0Y }}
          aria-hidden="true"
        >
          <div className="bp-intro__content">
            <span className="bp-eyebrow">The Big Picture</span>
            <h2 className="bp-intro__heading">
              Numbers that
              <br />
              <em>tell the story.</em>
            </h2>
            <p className="bp-intro__sub">Scroll to explore</p>
            <span className="bp-scroll-indicator" aria-hidden="true" />
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* Scenes 1–4 – Individual stats                                 */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {STATS.map((stat, i) => {
          const { opacity, y, scale } = sceneTransforms[i];
          const isInfinity = stat.target === null;

          return (
            <motion.div
              key={stat.id}
              className={`bp-scene bp-scene--stat bp-scene--${stat.id}`}
              style={{ opacity, y, scale }}
              aria-hidden="true"
            >
              {/* Large decorative index watermark */}
              <span className="bp-watermark" aria-hidden="true">
                {stat.index}
              </span>

              <div className="bp-stat__layout">

                {/* Left column: typography */}
                <div className="bp-stat__text">

                  <span className="bp-stat__index-label">
                    <span className="bp-stat__index-accent">{stat.index}</span>
                    {' / '}
                    <span className="bp-stat__index-total">04</span>
                  </span>

                  <div className="bp-stat__counter-row">
                    <span
                      className={`bp-stat__number${isInfinity ? ' bp-stat__number--inf' : ''}`}
                    >
                      {counts[i]}
                    </span>
                    {stat.suffix && (
                      <span className="bp-stat__suffix">{stat.suffix}</span>
                    )}
                  </div>

                  <h3 className="bp-stat__headline">
                    {stat.primaryLine}
                    <br />
                    <span className="bp-stat__headline-b">{stat.secondaryLine}</span>
                  </h3>

                  <p className="bp-stat__desc">{stat.description}</p>

                  {/* Accent reveal line driven by scene opacity */}
                  <motion.div
                    className="bp-stat__accent-line"
                    style={{ scaleX: opacity }}
                    aria-hidden="true"
                  />
                </div>

                {/* Right column: animated SVG icon */}
                <div className="bp-stat__icon-wrap" aria-hidden="true">
                  <stat.Icon active={activeStats[i]} />
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* Scene 5 – Final 2×2 grid                                      */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <motion.div
          className="bp-scene bp-scene--grid"
          style={{ opacity: s5Opacity, y: s5Y }}
        >
          <div className="bp-grid__container">

            <header className="bp-grid__header">
              <span className="bp-eyebrow">The full picture</span>
            </header>

            {/* Accessible, semantic summary */}
            <div className="bp-grid" role="list">
              {STATS.map((stat, i) => {
                const { opacity: cOp, y: cY } = cardTransforms[i];
                const isInfinity = stat.target === null;

                return (
                  <motion.article
                    key={stat.id}
                    className={`bp-card bp-card--${stat.id}`}
                    style={{ opacity: cOp, y: cY }}
                    role="listitem"
                    tabIndex={0}
                    aria-label={`${counts[i]}${stat.suffix} ${stat.primaryLine} ${stat.secondaryLine}`}
                  >
                    <div className="bp-card__icon-wrap" aria-hidden="true">
                      <stat.Icon active={activeStats[i]} />
                    </div>

                    <div className="bp-card__body">
                      <div className="bp-card__value-row">
                        <span
                          className={`bp-card__value${isInfinity ? ' bp-card__value--inf' : ''}`}
                        >
                          {counts[i]}
                        </span>
                        {stat.suffix && (
                          <span className="bp-card__suffix">{stat.suffix}</span>
                        )}
                      </div>
                      <h3 className="bp-card__label">
                        {stat.primaryLine} {stat.secondaryLine}
                      </h3>
                    </div>
                  </motion.article>
                );
              })}
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default BigPicture;