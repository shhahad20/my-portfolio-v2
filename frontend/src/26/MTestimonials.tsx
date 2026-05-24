import React from "react";
import Marquee from "./Marquee";
import "./style/Marquee.scss";
// import type { Testimonial } from "../../data/testimonials";
// ─── testimonials.ts ──────────────────────────────────────────────────────────
// Static data for the marquee demo
// ─────────────────────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  name: string;
  handle: string;
  role: string;
  company: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** Initials shown when no avatar URL is provided */
  initials: string;
  /** Optional avatar image URL */
  avatarUrl?: string;
  /** Platform / source label */
  source: string;
}

 const ROW_ONE: Testimonial[] = [
  {
    id: "t1",
    name: "Amara Osei",
    handle: "@amara_osei",
    role: "Head of Product",
    company: "Meridian Labs",
    quote:
      "The level of craft here is unmatched. Every interaction feels intentional — this is what modern design should aspire to.",
    rating: 5,
    initials: "AO",
    source: "Product Hunt",
  },
  {
    id: "t2",
    name: "Luís Ferreira",
    handle: "@luisf_dev",
    role: "Senior Engineer",
    company: "Volta Systems",
    quote:
      "I've evaluated dozens of component libraries. Nothing comes close to this level of polish and performance. Truly exceptional.",
    rating: 5,
    initials: "LF",
    source: "GitHub",
  },
  {
    id: "t3",
    name: "Yuki Tanaka",
    handle: "@yukitanaka",
    role: "Creative Director",
    company: "Studio Nōto",
    quote:
      "Finally, a tool that respects the craft. The attention to typographic detail alone is worth every penny.",
    rating: 5,
    initials: "YT",
    source: "Twitter / X",
  },
  {
    id: "t4",
    name: "Chidinma Eze",
    handle: "@chi_builds",
    role: "UX Designer",
    company: "Pillar Digital",
    quote:
      "Our team's velocity doubled after adopting this. The DX is impeccable — no friction, just flow.",
    rating: 5,
    initials: "CE",
    source: "Dribbble",
  },
  {
    id: "t5",
    name: "Mateo Reyes",
    handle: "@mateo_r",
    role: "Co-Founder",
    company: "Archetype Studio",
    quote:
      "We rebuilt our entire design system around this foundation. Six months later, we haven't looked back once.",
    rating: 5,
    initials: "MR",
    source: "LinkedIn",
  },
  {
    id: "t6",
    name: "Ingrid Halvorsen",
    handle: "@ingridh_ux",
    role: "Principal Designer",
    company: "Fjord Solutions",
    quote:
      "The motion design is genuinely cinematic. Our stakeholders asked if we hired a new design team — we just upgraded our tools.",
    rating: 5,
    initials: "IH",
    source: "Twitter / X",
  },
];

 const ROW_TWO: Testimonial[] = [
  {
    id: "t7",
    name: "Kwame Asante",
    handle: "@kwame_codes",
    role: "Engineering Lead",
    company: "Vantage AI",
    quote:
      "Accessibility, performance, and aesthetics in perfect balance. I've been in the industry 12 years — this is rare.",
    rating: 5,
    initials: "KA",
    source: "Dev.to",
  },
  {
    id: "t8",
    name: "Sofía Morales",
    handle: "@sofia_design",
    role: "Brand Strategist",
    company: "Lúmina Creative",
    quote:
      "Our conversion rate jumped 34% after the redesign. The testimonials section alone drove 18% of that. Stunning work.",
    rating: 5,
    initials: "SM",
    source: "Product Hunt",
  },
  {
    id: "t9",
    name: "Ravi Nair",
    handle: "@ravinair_io",
    role: "CTO",
    company: "Helios Cloud",
    quote:
      "The TypeScript support is flawless. Zero runtime surprises, total IDE confidence. My team was productive on day one.",
    rating: 5,
    initials: "RN",
    source: "GitHub",
  },
  {
    id: "t10",
    name: "Zara Al-Amin",
    handle: "@zara_amin",
    role: "Startup Founder",
    company: "Prism Labs",
    quote:
      "I showed this to our investors during a demo. They asked who built the UI — we shipped it in under a week.",
    rating: 5,
    initials: "ZA",
    source: "Twitter / X",
  },
  {
    id: "t11",
    name: "Elias Bergström",
    handle: "@elias_b",
    role: "Design Systems Lead",
    company: "Nordic UX",
    quote:
      "Every spacing decision, every shadow — it all feels considered. This is the benchmark I now use for all client work.",
    rating: 5,
    initials: "EB",
    source: "Figma Community",
  },
  {
    id: "t12",
    name: "Priya Krishnan",
    handle: "@priyak_pm",
    role: "Product Manager",
    company: "Elevate Ventures",
    quote:
      "The onboarding was seamless and the output was breathtaking. Shipped to production with zero regressions. Remarkable.",
    rating: 5,
    initials: "PK",
    source: "LinkedIn",
  },
];
// ─── Star Rating ──────────────────────────────────────────────────────────────

interface StarRatingProps {
  rating: number;
  max?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, max = 5 }) => (
  <div
    className="testimonial-card__stars"
    role="img"
    aria-label={`${rating} out of ${max} stars`}
  >
    {Array.from({ length: max }).map((_, i) => (
      <span key={i} className="star" aria-hidden="true">
        {i < rating ? "★" : "☆"}
      </span>
    ))}
  </div>
);

// ─── Avatar ───────────────────────────────────────────────────────────────────

interface AvatarProps {
  src?: string;
  alt: string;
  initials: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, initials }) => {
  if (src) {
    return (
      <img
        className="testimonial-card__avatar"
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        width={44}
        height={44}
      />
    );
  }

  return (
    <div
      className="testimonial-card__avatar"
      role="img"
      aria-label={`${alt} avatar`}
    >
      {initials}
    </div>
  );
};

// ─── TestimonialCard ──────────────────────────────────────────────────────────

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const { name, handle, role, company, quote, rating, initials, avatarUrl, source } =
    testimonial;

  return (
    <article
      className="testimonial-card"
      aria-label={`Testimonial from ${name}, ${role} at ${company}`}
    >
      {/* ── Header: identity + stars ── */}
      <header className="testimonial-card__header">
        <div className="testimonial-card__identity">
          <Avatar src={avatarUrl} alt={name} initials={initials} />
          <div className="testimonial-card__meta">
            <span className="testimonial-card__name">{name}</span>
            <span className="testimonial-card__handle">{handle}</span>
          </div>
        </div>
        <StarRating rating={rating} />
      </header>

      <hr className="testimonial-card__divider" aria-hidden="true" />

      {/* ── Body: quote ── */}
      <blockquote className="testimonial-card__quote" cite={`https://x.com/${handle.replace("@", "")}`}>
        {quote}
      </blockquote>

      {/* ── Footer: source badge ── */}
      <footer className="testimonial-card__source" aria-label={`Posted on ${source}`}>
        <span className="source-dot" aria-hidden="true" />
        <span>{source}</span>
      </footer>
    </article>
  );
};


// ─── MarqueeDemo ──────────────────────────────────────────────────────────────
// Full-page testimonials section showcasing the Marquee component.
// Two rows: first scrolls left, second scrolls right (slightly faster).
// ─────────────────────────────────────────────────────────────────────────────

const MarqueeDemo: React.FC = () => {
  return (
    <>
      {/* Google Fonts — Playfair Display for headings */}
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
      />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <main
        className="testimonials-section"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* ── Section Header ── */}
        <header className="testimonials-section__header">
          <p className="testimonials-section__eyebrow">
            Social proof
          </p>
          <h1 className="testimonials-section__title">
            Trusted by teams who<br />
            <em>demand the best</em>
          </h1>
          <p className="testimonials-section__subtitle">
            From indie founders to Fortune 500 design teams —
            here's what they're saying.
          </p>
        </header>

        {/* ── Two-Row Marquee ── */}
        <div className="testimonials-section__rows" role="region" aria-label="Customer testimonials">
          {/* Row 1 — left scroll, standard speed */}
          <Marquee
            direction="left"
            speed={45}
            gap="1.25rem"
            pauseOnHover
            repeat={2}
            ariaLabel="Testimonials row 1, scrolling left"
          >
            {ROW_ONE.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </Marquee>

          {/* Row 2 — right scroll, slightly faster */}
          <Marquee
            direction="right"
            speed={38}
            gap="1.25rem"
            pauseOnHover
            repeat={2}
            ariaLabel="Testimonials row 2, scrolling right"
          >
            {ROW_TWO.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </Marquee>
        </div>

        {/* ── Stats Strip ── */}
        <footer className="testimonials-section__stats" aria-label="Summary statistics">
          <div className="testimonials-section__stat">
            <strong className="stat-value">
              4.9<span>★</span>
            </strong>
            <span className="stat-label">Average rating</span>
          </div>

          <div className="testimonials-section__stat-divider" aria-hidden="true" />

          <div className="testimonials-section__stat">
            <strong className="stat-value">
              12<span>k+</span>
            </strong>
            <span className="stat-label">Happy teams</span>
          </div>

          <div className="testimonials-section__stat-divider" aria-hidden="true" />

          <div className="testimonials-section__stat">
            <strong className="stat-value">
              98<span>%</span>
            </strong>
            <span className="stat-label">Would recommend</span>
          </div>
        </footer>
      </main>
    </>
  );
};

export default MarqueeDemo;