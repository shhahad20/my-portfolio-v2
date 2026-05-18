import React from "react";
import "./style/Footer.scss";
import AnimatedLink from "../components/AnimatedLink";

// ─── TypeScript Interfaces ────────────────────────────────────────────────────

export interface FooterNavColumn {
  heading: string;
  links: { label: string; href: string }[];
}

export interface SocialLink {
  platform: string;
  href: string;
  ariaLabel: string;
}

export interface FooterProps {
  /** Navigation columns rendered in the top section of the footer */
  navColumns?: FooterNavColumn[];
  /** Tagline or short blurb displayed prominently */
  tagline?: string;
  /** Contact e-mail address */
  contactEmail?: string;
  /** Physical / mailing address */
  address?: string;
  /** Social media links */
  socialLinks?: SocialLink[];
  /** Copyright text (year + entity) */
  copyright?: string;
  /** Fixed height of the footer in px – must match the CSS variable */
  footerHeight?: number;
}

// ─── Default Content ──────────────────────────────────────────────────────────

const DEFAULT_NAV: FooterNavColumn[] = [
  {
    heading: "Work",
    links: [
      { label: "Projects", href: "#projects" },
      { label: "Case Studies", href: "#case-studies" },
      { label: "Archive", href: "#archive" },
    ],
  },
  {
    heading: "Studio",
    links: [
      { label: "About", href: "#about" },
      { label: "Process", href: "#process" },
      { label: "Careers", href: "#careers" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label: "Contact", href: "#contact" },
      { label: "Press", href: "#press" },
      { label: "Newsletter", href: "#newsletter" },
    ],
  },
];

const DEFAULT_SOCIALS: SocialLink[] = [
  {
    platform: "Twitter / X ↗",
    href: "https://twitter.com",
    ariaLabel: "Follow us on Twitter",
  },
  {
    platform: "Instagram ↗",
    href: "https://instagram.com",
    ariaLabel: "Follow us on Instagram",
  },
  {
    platform: "LinkedIn ↗",
    href: "https://linkedin.com",
    ariaLabel: "Connect on LinkedIn",
  },
  {
    platform: "Dribbble ↗",
    href: "https://dribbble.com",
    ariaLabel: "See our work on Dribbble",
  },
];

// ─── Arrow SVG ────────────────────────────────────────────────────────────────

// const ArrowTopRight: React.FC = () => (
//   <svg
//     className="footer__social-arrow"
//     width="10"
//     height="10"
//     viewBox="0 0 10 10"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//     aria-hidden="true"
//   >
//     <path
//       d="M1 9L9 1M9 1H2M9 1V8"
//       stroke="currentColor"
//       strokeWidth="1.4"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//   </svg>
// );

// ─── Footer Content ───────────────────────────────────────────────────────────

const FooterContent: React.FC<FooterProps> = ({
  navColumns = DEFAULT_NAV,
  tagline = "Crafting digital experiences that move people — and the industry.",
  contactEmail = "shahadaltharwa@gmail.com",
  address = "Made with love and coffee.☕",
  socialLinks = DEFAULT_SOCIALS,
  copyright = `© ${new Date().getFullYear()} Shahad Al-Tharwa. All rights reserved.`,
}) => (
  <footer className="footer" role="contentinfo" aria-label="Site footer">
    {/* ── Top row ── */}
    <div className="footer__top">
      <div className="footer__brand">
        <span className="footer__logo" aria-label="Studio logo">
          SHAHAD AL-THARWA
        </span>
        <p className="footer__tagline">{tagline}</p>
      </div>

      <nav className="footer__nav" aria-label="Footer navigation">
        {navColumns.map((col) => (
          <div key={col.heading} className="footer__nav-col">
            <h3 className="footer__nav-heading">{col.heading}</h3>
            <ul className="footer__nav-list" role="list">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="footer__nav-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>

    {/* ── Divider ── */}
    <div className="footer__divider" aria-hidden="true" />

    {/* ── Bottom row ── */}
    <div className="footer__bottom">
      {/* Contact block */}
      <address className="footer__contact">
        <a href={`mailto:${contactEmail}`} className="footer__email">
          {contactEmail}
        </a>
        <span className="footer__address">{address}</span>
      </address>

      {/* Socials */}
      <ul
        className="footer__social-list"
        role="list"
        aria-label="Social media links"
      >
        {socialLinks.map((s) => (
          <li key={s.platform}>
            <a
              href={s.href}
              className="footer__social-link"
              aria-label={s.ariaLabel}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* {s.platform}
              <ArrowTopRight /> */}
              <AnimatedLink
                linkText={s.platform}
                hoverText={s.platform}
                href={s.href}
                linkColor="#f0ece3"
              />
            </a>
          </li>
        ))}
      </ul>

      {/* Copyright */}
      <small className="footer__copyright">{copyright}</small>
    </div>
  </footer>
);

// ─── StickyFooter (Olivier Larose – Method 1) ─────────────────────────────────
//
// The outer wrapper sits in normal document flow with a fixed height equal to
// the footer's height.  clip-path clips everything outside that box – including
// the inner div which is positioned `fixed` at the bottom of the viewport.
// As the user scrolls and the outer box enters / moves through the viewport,
// the clipping region rises, gradually revealing the fixed footer from below.

const StickyFooter: React.FC<FooterProps> = (props) => {
  const height = props.footerHeight ?? 640;

  return (
    <div
      className="sticky-footer"
      style={{
        height: `${height}px`,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      }}
      aria-label="Page footer region"
    >
      {/* Fixed panel – stays pinned to the bottom of the viewport */}
      <div className="sticky-footer__panel" style={{ height: `${height}px` }}>
        <FooterContent {...props} />
      </div>
    </div>
  );
};

export default StickyFooter;
