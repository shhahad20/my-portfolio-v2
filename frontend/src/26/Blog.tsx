import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./style/blog.scss";
import NavigationMenu from "./Nav";
import StickyFooter from "./Footer";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  tags: string[];
  publishDate: string;
  readTime: number;
  featured?: boolean;
  author: {
    name: string;
    initials?: string;
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Sample data ────────────────────────────────────────────────────────────────
// Replace this array with an API/CMS fetch to go live.

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "building-design-systems",
    title: "Building Scalable Design Systems from Scratch",
    excerpt:
      "A practical guide to creating component libraries that grow with your team — from design tokens and color scales to documentation, versioning, and cross-team adoption.",
    category: "Design Systems",
    tags: ["Design", "Components", "Figma"],
    publishDate: "2026-05-10",
    readTime: 8,
    featured: true,
    author: { name: "Shahad Altharwa", initials: "SA" },
  },
  {
    id: "2",
    slug: "framer-motion-micro-interactions",
    title: "Crafting Micro-Interactions with Framer Motion",
    excerpt:
      "Dive into spring physics, gesture animations, and layout transitions that make interfaces feel alive. Real examples from production React apps.",
    category: "Development",
    tags: ["React", "Animation", "Framer Motion"],
    publishDate: "2026-04-22",
    readTime: 6,
    author: { name: "Shahad Altharwa", initials: "SA" },
  },
  {
    id: "3",
    slug: "typography-in-ui-design",
    title: "Typography That Works: A Developer's Perspective",
    excerpt:
      "Choosing typefaces, setting fluid scales with clamp(), and building a type system that reads well across every viewport and device.",
    category: "UI/UX",
    tags: ["Typography", "CSS", "Design"],
    publishDate: "2026-04-05",
    readTime: 5,
    author: { name: "Shahad Altharwa", initials: "SA" },
  },
  {
    id: "4",
    slug: "react-hook-patterns",
    title: "React Hook Patterns Every Senior Dev Should Know",
    excerpt:
      "Beyond useState and useEffect — advanced patterns for data fetching, state machines, and composable logic you can drop into any modern React project.",
    category: "Development",
    tags: ["React", "Hooks", "TypeScript"],
    publishDate: "2026-03-18",
    readTime: 10,
    author: { name: "Shahad Altharwa", initials: "SA" },
  },
  {
    id: "5",
    slug: "accessible-components",
    title: "Accessible Components: More Than ARIA Labels",
    excerpt:
      "Real accessibility goes far beyond adding role and aria-label. Learn focus management, keyboard navigation patterns, and screen-reader UX that actually works.",
    category: "Tutorials",
    tags: ["Accessibility", "HTML", "UX"],
    publishDate: "2026-03-02",
    readTime: 7,
    author: { name: "Shahad Altharwa", initials: "SA" },
  },
  {
    id: "6",
    slug: "css-grid-mastery",
    title: "CSS Grid Mastery: Layouts You Didn't Know Were Possible",
    excerpt:
      "From named grid areas to subgrid and intrinsic sizing — a hands-on exploration of everything CSS Grid can do in 2026, with zero JavaScript.",
    category: "UI/UX",
    tags: ["CSS", "Grid", "Layout"],
    publishDate: "2026-02-14",
    readTime: 9,
    author: { name: "Shahad Altharwa", initials: "SA" },
  },
  {
    id: "7",
    slug: "reusable-component-patterns",
    title: "Building Truly Reusable React Components",
    excerpt:
      "Compound components, render props, and the composition model — a deep dive into patterns that make components work in every context you throw them into.",
    category: "Tutorials",
    tags: ["React", "Components", "Patterns"],
    publishDate: "2026-01-28",
    readTime: 11,
    author: { name: "Shahad Altharwa", initials: "SA" },
  },
  {
    id: "8",
    slug: "color-theory-for-devs",
    title: "Color Theory Every Frontend Developer Should Understand",
    excerpt:
      "HSL, perceptual lightness, accessible contrast ratios, and the science behind building palettes that work for everyone — not just the typical viewer.",
    category: "Design Systems",
    tags: ["Color", "Design", "Accessibility"],
    publishDate: "2026-01-10",
    readTime: 6,
    author: { name: "Shahad Altharwa", initials: "SA" },
  },
];

const ALL_CATEGORIES = [
  "All",
  ...Array.from(new Set(BLOG_POSTS.map((p) => p.category))),
];

// ── Framer Motion Variants ─────────────────────────────────────────────────────

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: EASE_OUT },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: EASE_OUT },
  }),
};

// ── CategoryPill ───────────────────────────────────────────────────────────────

interface CategoryPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const CategoryPill: React.FC<CategoryPillProps> = ({ label, active, onClick }) => (
  <motion.button
    className={`blog-pill${active ? " blog-pill--active" : ""}`}
    onClick={onClick}
    whileTap={{ scale: 0.96 }}
    layout
  >
    {label}
  </motion.button>
);

// ── FeaturedCard ───────────────────────────────────────────────────────────────

interface FeaturedCardProps {
  post: BlogPost;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ post }) => (
  <motion.article
    className="blog-featured"
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.65, ease: EASE_OUT }}
    whileHover={{ y: -4 }}
  >
    <a
      href={`/blog/${post.slug}`}
      className="blog-featured__link"
      aria-label={`Read featured article: ${post.title}`}
    >
      {/* Cover */}
      <div className="blog-featured__cover">
        {post.coverImage ? (
          <img src={post.coverImage} alt={post.title} loading="lazy" />
        ) : (
          <div className="blog-featured__cover-placeholder" aria-hidden="true">
            <span className="blog-featured__cover-letter">
              {post.title.charAt(0)}
            </span>
          </div>
        )}
        <span className="blog-featured__badge">Featured</span>
      </div>

      {/* Body */}
      <div className="blog-featured__body">
        <div className="blog-featured__meta">
          <span className="blog-featured__category">{post.category}</span>
          <span className="blog-featured__dot" aria-hidden="true">·</span>
          <time dateTime={post.publishDate}>{formatDate(post.publishDate)}</time>
          <span className="blog-featured__dot" aria-hidden="true">·</span>
          <span>{post.readTime} min read</span>
        </div>

        <h2 className="blog-featured__title">{post.title}</h2>
        <p className="blog-featured__excerpt">{post.excerpt}</p>

        {post.tags.length > 0 && (
          <div className="blog-tags" aria-label="Tags">
            {post.tags.map((tag) => (
              <span key={tag} className="blog-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="blog-featured__footer">
          <div className="blog-featured__author">
            <span className="blog-featured__avatar" aria-hidden="true">
              {post.author.initials ?? post.author.name.slice(0, 2).toUpperCase()}
            </span>
            <span className="blog-featured__author-name">{post.author.name}</span>
          </div>
          <span className="blog-featured__cta" aria-hidden="true">
            Read article →
          </span>
        </div>
      </div>
    </a>
  </motion.article>
);

// ── BlogCard ───────────────────────────────────────────────────────────────────

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, index }) => (
  <motion.article
    className="blog-card"
    custom={index}
    variants={cardVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.12 }}
    whileHover={{ y: -5, transition: { type: "spring", stiffness: 280, damping: 22 } }}
  >
    <a
      href={`/blog/${post.slug}`}
      className="blog-card__link"
      aria-label={`Read article: ${post.title}`}
    >
      {/* Cover */}
      <div className="blog-card__cover" aria-hidden="true">
        {post.coverImage ? (
          <img src={post.coverImage} alt={post.title} loading="lazy" />
        ) : (
          <div className="blog-card__cover-placeholder">
            <span>{post.title.charAt(0)}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="blog-card__body">
        <div className="blog-card__meta">
          <span className="blog-card__category">{post.category}</span>
          <span className="blog-card__time">{post.readTime} min read</span>
        </div>

        <h3 className="blog-card__title">{post.title}</h3>
        <p className="blog-card__excerpt">{post.excerpt}</p>

        <div className="blog-card__footer">
          <div className="blog-card__author">
            <span className="blog-card__avatar" aria-hidden="true">
              {post.author.initials ?? post.author.name.slice(0, 2).toUpperCase()}
            </span>
            <time className="blog-card__date" dateTime={post.publishDate}>
              {formatDate(post.publishDate)}
            </time>
          </div>
          <span className="blog-card__arrow" aria-hidden="true">→</span>
        </div>
      </div>
    </a>
  </motion.article>
);

// ── BlogPage ───────────────────────────────────────────────────────────────────

const BlogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const featuredPost = useMemo(() => BLOG_POSTS.find((p) => p.featured), []);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return BLOG_POSTS.filter((p) => {
      if (p.featured) return false;
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleReset = () => {
    setActiveCategory("All");
    setSearchQuery("");
    searchRef.current?.focus();
  };

  return (
    <div className="page-shell">
      <main className="page-shell-content">
        <NavigationMenu />

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="blog-hero" aria-labelledby="blog-page-title">
          <div className="blog-hero__inner">
            <motion.span
              className="blog-hero__eyebrow"
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              Journal & Insights
            </motion.span>

            <motion.h1
              id="blog-page-title"
              className="blog-hero__title"
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              Thoughts on
              <br />
              Design & Code
            </motion.h1>

            <motion.p
              className="blog-hero__sub"
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              Tutorials, reusable components, development articles, and UI/UX
              insights from building real products.
            </motion.p>
          </div>

          <motion.span
            className="blog-hero__num"
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            aria-hidden="true"
          >
            04
          </motion.span>
        </section>

        {/* ── Featured Article ──────────────────────────────────────────────── */}
        {featuredPost && (
          <section
            className="blog-section blog-section--featured"
            aria-label="Featured article"
          >
            <FeaturedCard post={featuredPost} />
          </section>
        )}

        {/* ── Controls ──────────────────────────────────────────────────────── */}
        <section
          className="blog-section blog-section--controls"
          aria-label="Filter and search articles"
        >
          <div className="blog-controls">
            {/* Category filters */}
            <div
              className="blog-controls__filters"
              role="group"
              aria-label="Filter by category"
            >
              {ALL_CATEGORIES.map((cat) => (
                <CategoryPill
                  key={cat}
                  label={cat}
                  active={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                />
              ))}
            </div>

            {/* Search */}
            <div className="blog-search" role="search">
              <svg
                className="blog-search__icon"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                focusable="false"
              >
                <circle
                  cx="8.5"
                  cy="8.5"
                  r="5.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M13 13L17 17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>

              <label htmlFor="blog-search" className="sr-only">
                Search articles
              </label>
              <input
                ref={searchRef}
                id="blog-search"
                type="search"
                className="blog-search__input"
                placeholder="Search articles…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />

              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    className="blog-search__clear"
                    onClick={() => {
                      setSearchQuery("");
                      searchRef.current?.focus();
                    }}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.14 }}
                    aria-label="Clear search"
                    type="button"
                  >
                    ×
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* ── Article Grid ──────────────────────────────────────────────────── */}
        <section
          className="blog-section blog-section--grid"
          aria-label="Articles"
          aria-live="polite"
          aria-atomic="false"
        >
          <AnimatePresence mode="wait">
            {filteredPosts.length > 0 ? (
              <motion.div
                key={`grid-${activeCategory}-${searchQuery}`}
                className="blog-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {filteredPosts.map((post, i) => (
                  <BlogCard key={post.id} post={post} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="blog-empty"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
                role="status"
                aria-live="polite"
              >
                <span className="blog-empty__icon" aria-hidden="true">
                  ✦
                </span>
                <p className="blog-empty__text">
                  No articles found for this filter.
                </p>
                <button
                  className="blog-empty__reset"
                  onClick={handleReset}
                  type="button"
                >
                  Reset filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <StickyFooter />
      </main>
    </div>
  );
};

export default BlogPage;
