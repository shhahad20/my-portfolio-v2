"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import "./style/Nav.scss";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface NavLink {
  title: string;
  href: string;
  src?: string; // optional preview image path
}

export interface FooterColumn {
  label?: string;
  links: string[];
}

export interface NavigationMenuProps {
  /** Brand / logo text shown in the top-left */
  brand?: string;
  /** Navigation links rendered in the expanded panel */
  navLinks?: NavLink[];
  /** Footer columns rendered at the bottom of the panel */
  footerColumns?: FooterColumn[];
  /** Path prefix for preview images (e.g. "/images/") */
  imageBasePath?: string;
  /** Called when any nav link is clicked */
  onNavigate?: (href: string) => void;
}

interface SelectedLink {
  isActive: boolean;
  index: number;
}

// ─────────────────────────────────────────────
// Default data
// ─────────────────────────────────────────────

const DEFAULT_NAV_LINKS: NavLink[] = [
  { title: "Home", href: "/", src: "home.jpg" },
  { title: "Work", href: "/work", src: "work.jpg" },
  { title: "About", href: "/about", src: "about.jpg" },
  { title: "Journal", href: "/journal", src: "journal.jpg" },
  { title: "Contact", href: "/contact", src: "contact.jpg" },
];

const DEFAULT_FOOTER_COLUMNS: FooterColumn[] = [
  { label: "Social", links: ["Twitter", "Instagram", "LinkedIn"] },
  { label: "Legal", links: ["Privacy Policy", "Terms & Conditions"] },
];

// ─────────────────────────────────────────────
// Framer Motion Variants
// ─────────────────────────────────────────────

const opacityVariants: Variants = {
  initial: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.35 } },
  closed: { opacity: 0, transition: { duration: 0.35 } },
};

const heightVariants: Variants = {
  initial: { height: 0 },
  enter: {
    height: "auto",
    transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    height: 0,
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
  },
};

const backgroundVariants: Variants = {
  initial: { height: 0 },
  open: {
    height: "100vh",
    transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
  },
  closed: {
    height: 0,
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
  },
};

/**
 * Per-character translate + fade.
 * custom: [enterDelay, exitDelay]
 */
const translateVariants: Variants = {
  initial: { y: "30%", opacity: 0 },
  enter: ([enterDelay]: [number, number]) => ({
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.65,
      delay: enterDelay,
      ease: [0.215, 0.61, 0.355, 1.0],
    },
  }),
  exit: ([, exitDelay]: [number, number]) => ({
    y: "10%",
    opacity: 0,
    transition: {
      duration: 0.3,
      delay: exitDelay,
      ease: [0.55, 0, 1, 0.45],
    },
  }),
};

/** Blur + dim non-hovered sibling links */
const blurVariants: Variants = {
  open: {
    filter: "blur(4px)",
    opacity: 0.3,
    transition: { duration: 0.3 },
  },
  closed: {
    filter: "blur(0px)",
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

/** Burger bar animation */
const burgerTopVariants: Variants = {
  closed: { y: 0, rotate: 0, transition: { duration: 0.3 } },
  open: { y: 7, rotate: 45, transition: { duration: 0.3, delay: 0.05 } },
};
const burgerBottomVariants: Variants = {
  closed: { y: 0, rotate: 0, transition: { duration: 0.3 } },
  open: { y: -7, rotate: -45, transition: { duration: 0.3, delay: 0.05 } },
};

// ─────────────────────────────────────────────
// Sub-component: AnimatedBurger
// ─────────────────────────────────────────────

interface AnimatedBurgerProps {
  isActive: boolean;
}

const AnimatedBurger: React.FC<AnimatedBurgerProps> = ({ isActive }) => (
  <div className="nm-burger" aria-hidden="true">
    <motion.span
      className="nm-burger__bar"
      variants={burgerTopVariants}
      animate={isActive ? "open" : "closed"}
    />
    <motion.span
      className="nm-burger__bar"
      variants={burgerBottomVariants}
      animate={isActive ? "open" : "closed"}
    />
  </div>
);

// ─────────────────────────────────────────────
// Sub-component: NavBody
// ─────────────────────────────────────────────

interface NavBodyProps {
  links: NavLink[];
  selectedLink: SelectedLink;
  setSelectedLink: React.Dispatch<React.SetStateAction<SelectedLink>>;
  onNavigate?: (href: string) => void;
}

const NavBody: React.FC<NavBodyProps> = ({
  links,
  selectedLink,
  setSelectedLink,
  onNavigate,
}) => {
  const getChars = (word: string) =>
    word.split("").map((char, i) => (
      <motion.span
        key={char + i}
        custom={[i * 0.025, (word.length - i) * 0.01]}
        variants={translateVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="nm-body__char"
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ));

  return (
    <nav className="nm-body" aria-label="Primary navigation">
      {links.map((link, index) => (
        <a
          key={`link-${index}`}
          href={link.href}
          className="nm-body__link"
          onClick={(e) => {
            e.preventDefault();
            setSelectedLink({ isActive: false, index });
            onNavigate?.(link.href);
          }}
          onMouseEnter={() => setSelectedLink({ isActive: true, index })}
          onMouseLeave={() => setSelectedLink({ isActive: false, index })}
        >
          <motion.p
            className="nm-body__title"
            variants={blurVariants}
            animate={
              selectedLink.isActive && selectedLink.index !== index
                ? "open"
                : "closed"
            }
          >
            {getChars(link.title)}
          </motion.p>
        </a>
      ))}
    </nav>
  );
};

// ─────────────────────────────────────────────
// Sub-component: NavImage
// ─────────────────────────────────────────────

interface NavImageProps {
  src?: string;
  imageBasePath: string;
  selectedLink: SelectedLink;
}

const NavImage: React.FC<NavImageProps> = ({
  src,
  imageBasePath,
  selectedLink,
}) => (
  <motion.div
    className="nm-image"
    variants={opacityVariants}
    initial="initial"
    animate={selectedLink.isActive ? "open" : "closed"}
    aria-hidden="true"
  >
    {src && (
      <img
        src={`${imageBasePath}${src}`}
        alt=""
        className="nm-image__img"
        loading="lazy"
      />
    )}
  </motion.div>
);

// ─────────────────────────────────────────────
// Sub-component: NavFooter
// ─────────────────────────────────────────────

interface NavFooterProps {
  columns: FooterColumn[];
}

const NavFooter: React.FC<NavFooterProps> = ({ columns }) => (
  <footer className="nm-footer" aria-label="Menu footer">
    {columns.map((col, colIdx) => (
      <ul key={colIdx} className="nm-footer__col">
        {col.label && (
          <motion.li
            className="nm-footer__label"
            custom={[0.3 + colIdx * 0.05, 0]}
            variants={translateVariants}
            initial="initial"
            animate="enter"
            exit="exit"
          >
            <span>{col.label}</span>
          </motion.li>
        )}
        {col.links.map((link, linkIdx) => (
          <motion.li
            key={linkIdx}
            className="nm-footer__item"
            custom={[0.35 + colIdx * 0.05 + linkIdx * 0.04, 0]}
            variants={translateVariants}
            initial="initial"
            animate="enter"
            exit="exit"
          >
            <a href="#">{link}</a>
          </motion.li>
        ))}
      </ul>
    ))}
  </footer>
);

// ─────────────────────────────────────────────
// Sub-component: Nav (panel)
// ─────────────────────────────────────────────

interface NavProps {
  links: NavLink[];
  footerColumns: FooterColumn[];
  imageBasePath: string;
  onNavigate?: (href: string) => void;
}

const Nav: React.FC<NavProps> = ({
  links,
  footerColumns,
  imageBasePath,
  onNavigate,
}) => {
  const [selectedLink, setSelectedLink] = useState<SelectedLink>({
    isActive: false,
    index: 0,
  });

  return (
    <motion.div
      className="nm-nav"
      variants={heightVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <div className="nm-nav__wrapper">
        <div className="nm-nav__content">
          <NavBody
            links={links}
            selectedLink={selectedLink}
            setSelectedLink={setSelectedLink}
            onNavigate={onNavigate}
          />
          <NavFooter columns={footerColumns} />
        </div>
        <NavImage
          src={links[selectedLink.index]?.src}
          imageBasePath={imageBasePath}
          selectedLink={selectedLink}
        />
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// Root Component: NavigationMenu
// ─────────────────────────────────────────────

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  brand = "Studio",
  navLinks = DEFAULT_NAV_LINKS,
  footerColumns = DEFAULT_FOOTER_COLUMNS,
  imageBasePath = "/images/",
  onNavigate,
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => setIsActive((prev) => !prev);
  const handleNavigate = (href: string) => {
    setIsActive(false);
    onNavigate?.(href);
  };

  return (
    <header className="nm-header" role="banner">
      {/* Top bar */}
      <div className="nm-bar">
        {/* Brand */}
        <a href="/" className="nm-bar__brand" aria-label="Go to homepage">
          {brand}
        </a>

        {/* Menu toggle */}
        <button
          className={`nm-bar__toggle${isActive ? " nm-bar__toggle--active" : ""}`}
          onClick={handleToggle}
          aria-expanded={isActive}
          aria-controls="navigation-panel"
          aria-label={isActive ? "Close menu" : "Open menu"}
        >
          <AnimatedBurger isActive={isActive} />
          <div className="nm-bar__label" aria-hidden="true">
            <motion.span
              className="nm-bar__label-text"
              variants={opacityVariants}
              animate={isActive ? "closed" : "open"}
            >
              Menu
            </motion.span>
            <motion.span
              className="nm-bar__label-text nm-bar__label-text--abs"
              variants={opacityVariants}
              animate={isActive ? "open" : "closed"}
            >
              Close
            </motion.span>
          </div>
        </button>
      </div>

      {/* Expanding background */}
      <motion.div
        className="nm-background"
        variants={backgroundVariants}
        initial="initial"
        animate={isActive ? "open" : "closed"}
        aria-hidden="true"
      />

      {/* Nav panel */}
      <AnimatePresence mode="wait">
        {isActive && (
          <Nav
            key="nav"
            links={navLinks}
            footerColumns={footerColumns}
            imageBasePath={imageBasePath}
            onNavigate={handleNavigate}
          />
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavigationMenu;