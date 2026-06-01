import React, { useState, useCallback, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import "./style/blogpost.scss";
import NavigationMenu from "./Nav";
import StickyFooter from "./Footer";
import { BLOG_POSTS, type BlogPost } from "./Blog";
import { blogApi, type ApiPostDetail, type ApiContentBlock } from "../api/blogApi";

// ── Content block types ────────────────────────────────────────────────────────
// Swap `ContentBlock[]` arrays below with CMS/API/markdown data later.

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "code"; language: string; code: string; filename?: string }
  | { type: "quote"; text: string; author?: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "divider" }
  | { type: "callout"; variant: "tip" | "note" | "warning"; text: string }
  | { type: "video"; src: string; title?: string };

// ── GitHub Light syntax theme ──────────────────────────────────────────────────
// Matches the warm cream palette of the website.

const PRISM_THEME: { [key: string]: React.CSSProperties } = {
  'pre[class*="language-"]': { background: "transparent", margin: 0, padding: 0 },
  'code[class*="language-"]': {
    fontFamily: '"SF Mono","Fira Code","Cascadia Code",monospace',
    fontSize: "13.5px",
    lineHeight: "1.75",
    color: "#24292e",
    background: "transparent",
  },
  comment: { color: "#6a737d", fontStyle: "italic" },
  prolog: { color: "#6a737d" },
  doctype: { color: "#6a737d" },
  cdata: { color: "#6a737d" },
  punctuation: { color: "#24292e" },
  property: { color: "#005cc5" },
  keyword: { color: "#d73a49" },
  tag: { color: "#22863a" },
  boolean: { color: "#005cc5" },
  number: { color: "#005cc5" },
  string: { color: "#032f62" },
  "attr-value": { color: "#032f62" },
  char: { color: "#032f62" },
  operator: { color: "#d73a49" },
  function: { color: "#6f42c1" },
  "class-name": { color: "#6f42c1" },
  variable: { color: "#e36209" },
  atrule: { color: "#6f42c1" },
  "attr-name": { color: "#005cc5" },
  selector: { color: "#22863a" },
  regex: { color: "#032f62" },
  important: { color: "#e36209", fontWeight: "bold" },
  inserted: { color: "#22863a", background: "#f0fff4" },
  deleted: { color: "#b31d28", background: "#ffeef0" },
};

// ── Sample article content ─────────────────────────────────────────────────────

const DESIGN_SYSTEMS_CONTENT: ContentBlock[] = [
  {
    type: "paragraph",
    text: "A design system is more than a component library — it's a shared language between designers and developers that scales as your product grows. In this guide we'll walk through building one from scratch, from token decisions all the way to team adoption and versioning.",
  },
  { type: "heading", level: 2, text: "1. Start with Design Tokens" },
  {
    type: "paragraph",
    text: "Design tokens are the atomic decisions of your visual language: colors, spacing, typography, and radii. They're the single source of truth that both Figma and your codebase reference. Get these right first — everything else builds on top.",
  },
  {
    type: "code",
    language: "scss",
    filename: "_tokens.scss",
    code: `// ── Color tokens ─────────────────────────────────
$color-bg:      #f8f6f2;
$color-text:    #111111;
$color-accent:  #ff9500;
$color-muted:   rgba(87, 79, 71, 0.50);
$color-border:  rgba(87, 79, 71, 0.14);

// ── Spacing (4px base) ────────────────────────────
$sp-1:  0.25rem;  //  4px
$sp-4:  1rem;     // 16px
$sp-6:  2rem;     // 32px
$sp-8:  4rem;     // 64px

// ── Typography ────────────────────────────────────
$font-display: "PPNeueMontreal-Regular", sans-serif;
$font-light:   "PPNeueMontreal-Light", sans-serif;
$heading-size: clamp(3.2rem, 6.5vw, 5.4rem);`,
  },
  {
    type: "callout",
    variant: "tip",
    text: "Export tokens as CSS custom properties too, not just SCSS variables. That way consuming teams can use them in vanilla CSS, Tailwind, or any other framework without a SCSS build step.",
  },
  { type: "heading", level: 2, text: "2. Define a Clear Component API" },
  {
    type: "paragraph",
    text: "Each component should have a well-typed, intentional interface. Use TypeScript to enforce constraints at compile time. Design with composition in mind — a Button shouldn't need to know about its parent's layout.",
  },
  {
    type: "code",
    language: "tsx",
    filename: "Button.tsx",
    code: `export interface ButtonProps {
  variant?:  "primary" | "ghost" | "outline";
  size?:     "sm" | "md" | "lg";
  loading?:  boolean;
  disabled?: boolean;
  children:  React.ReactNode;
  onClick?:  (e: React.MouseEvent) => void;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size    = "md",
  loading = false,
  disabled = false,
  children,
  onClick,
}) => (
  <button
    className={\`btn btn--\${variant} btn--\${size}\`}
    disabled={disabled || loading}
    aria-busy={loading}
    onClick={onClick}
  >
    {loading ? <Spinner size={14} /> : children}
  </button>
);`,
  },
  { type: "heading", level: 2, text: "3. Document Everything" },
  {
    type: "quote",
    text: "A design system without documentation is just a bag of parts. Documentation is what turns parts into a system.",
    author: "Nathan Curtis",
  },
  {
    type: "paragraph",
    text: "Storybook is the standard for interactive component documentation. Write prop tables, usage examples, accessibility notes, and do/don't guidelines for every component. Treat the docs as a first-class product — they're what the rest of your team actually interacts with.",
  },
  { type: "divider" },
  { type: "heading", level: 2, text: "4. Versioning & Releases" },
  {
    type: "paragraph",
    text: "Publish your system as an npm package with semantic versioning. Maintain a changelog so consuming teams know exactly what changed and can plan migrations. Use Changesets or Semantic Release to automate the process.",
  },
  {
    type: "list",
    ordered: true,
    items: [
      "Patch (1.0.1) — bug fixes, visual tweaks, no breaking changes",
      "Minor (1.1.0) — new components or tokens, fully backwards compatible",
      "Major (2.0.0) — breaking API changes, requires a migration guide",
    ],
  },
  { type: "heading", level: 2, text: "5. Driving Team Adoption" },
  {
    type: "paragraph",
    text: "Technical quality alone doesn't drive adoption. Embed a design system advocate in each product team. Hold office hours. Create a low-friction contribution process with a clear RFC template. The system should feel like a gift, not a constraint.",
  },
  {
    type: "callout",
    variant: "note",
    text: "The hardest part of a design system isn't building the components — it's convincing teams to use them instead of rolling their own. Plan for this from day one and invest in developer experience as much as the components themselves.",
  },
  {
    type: "paragraph",
    text: "With a solid token foundation, well-typed APIs, thorough documentation, and a clear release cadence, your design system becomes the highest-leverage investment your team can make. Start small, ship often, and let real product needs drive the roadmap.",
  },
];

const FRAMER_MOTION_CONTENT: ContentBlock[] = [
  {
    type: "paragraph",
    text: "Framer Motion transforms React interfaces from static to alive. In this deep dive we'll cover spring physics, gesture animations, layout transitions, and the subtle details that separate polished micro-interactions from clunky ones.",
  },
  { type: "heading", level: 2, text: "Spring Physics over Duration" },
  {
    type: "paragraph",
    text: "Forget duration-based easing. Springs are physical — they have stiffness and damping, and they feel natural because they mimic real-world object behavior. Use them for hover lifts, modal entrances, and drag interactions.",
  },
  {
    type: "code",
    language: "tsx",
    code: `// Natural hover lift with spring physics
<motion.div
  whileHover={{ y: -6 }}
  transition={{ type: "spring", stiffness: 300, damping: 24 }}
>
  {children}
</motion.div>

// Staggered list entrance
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 }
  }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } }
};`,
  },
  {
    type: "callout",
    variant: "tip",
    text: "Respect prefers-reduced-motion. Wrap your Lenis setup and complex animations in a media query check so users with vestibular disorders get a comfortable experience.",
  },
  { type: "heading", level: 2, text: "Layout Animations" },
  {
    type: "paragraph",
    text: "The layout prop is Framer Motion's hidden superpower. Add layout to any element and it automatically animates between size and position changes — list reorders, accordion expansions, filter transitions — with zero extra code.",
  },
  {
    type: "code",
    language: "tsx",
    code: `// Animated filter pills that reflow smoothly
{categories.map(cat => (
  <motion.button
    key={cat}
    layout
    className={\`pill\${active === cat ? " pill--active" : ""}\`}
    onClick={() => setActive(cat)}
    whileTap={{ scale: 0.95 }}
  >
    {cat}
  </motion.button>
))}`,
  },
];

// Fallback for posts without full content
function makeFallback(post: BlogPost): ContentBlock[] {
  return [
    { type: "paragraph", text: post.excerpt },
    {
      type: "callout",
      variant: "note",
      text: "Full article content is coming soon. This is a placeholder built from the excerpt — connect a CMS or markdown source to populate complete articles.",
    },
  ];
}

const ARTICLE_CONTENTS: Record<string, ContentBlock[]> = {
  "building-design-systems": DESIGN_SYSTEMS_CONTENT,
  "framer-motion-micro-interactions": FRAMER_MOTION_CONTENT,
};

function getContent(post: BlogPost): ContentBlock[] {
  return ARTICLE_CONTENTS[post.slug] ?? makeFallback(post);
}

function mapApiBlock(b: ApiContentBlock): ContentBlock | null {
  const d = b.data as Record<string, unknown>;
  switch (b.type) {
    case "paragraph": return { type: "paragraph", text: (d.text as string) || "" };
    case "heading": return { type: "heading", level: ([2, 3].includes(Number(d.level)) ? Number(d.level) : 2) as 2 | 3, text: (d.text as string) || "" };
    case "code": return { type: "code", language: (d.language as string) || "text", code: (d.code as string) || "", filename: d.filename as string | undefined };
    case "quote": return { type: "quote", text: (d.text as string) || "", author: d.attribution as string | undefined };
    case "image": return { type: "image", src: (d.url as string) || "", alt: (d.alt as string) || "", caption: d.caption as string | undefined };
    case "video": return { type: "video", src: (d.url as string) || "", title: d.caption as string | undefined };
    case "list": return { type: "list", ordered: Boolean(d.ordered), items: (d.items as string[]) || [] };
    case "divider": return { type: "divider" };
    case "callout": return { type: "callout", variant: (["tip", "note", "warning"].includes(d.variant as string) ? d.variant : "note") as "tip" | "note" | "warning", text: (d.text as string) || "" };
    default: return null;
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

// ── ReadingProgress ────────────────────────────────────────────────────────────

const ReadingProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div
      className="blogpost-progress"
      style={{ scaleX, transformOrigin: "0% 50%" }}
      aria-hidden="true"
    />
  );
};

// ── CodeBlock ─────────────────────────────────────────────────────────────────

interface CodeBlockProps {
  language: string;
  code: string;
  filename?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code, filename }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard API unavailable */
    }
  }, [code]);

  return (
    <div className="blogpost-code-block">
      <div className="blogpost-code-block__header">
        <div className="blogpost-code-block__left">
          <div className="blogpost-code-block__dots" aria-hidden="true">
            <span /><span /><span />
          </div>
          {filename && (
            <span className="blogpost-code-block__filename">{filename}</span>
          )}
        </div>
        <div className="blogpost-code-block__right">
          <span className="blogpost-code-block__lang">{language}</span>
          <button
            className="blogpost-code-block__copy"
            onClick={handleCopy}
            aria-label={copied ? "Copied!" : "Copy code"}
            type="button"
          >
            {copied ? (
              <>
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M11 5V4a1 1 0 00-1-1H3a1 1 0 00-1 1v7a1 1 0 001 1h1" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <SyntaxHighlighter language={language} style={PRISM_THEME as any} wrapLongLines={false}>
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
};

// ── ContentRenderer ────────────────────────────────────────────────────────────

const CALLOUT_ICONS = { tip: "✦", note: "◉", warning: "⚠" } as const;

const ContentRenderer: React.FC<{ blocks: ContentBlock[] }> = ({ blocks }) => (
  <div className="blogpost-body">
    {blocks.map((block, i) => {
      switch (block.type) {
        case "paragraph":
          return (
            <motion.p
              key={i}
              className="blogpost-p"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
            >
              {block.text}
            </motion.p>
          );

        case "heading":
          return block.level === 2 ? (
            <motion.h2
              key={i}
              className="blogpost-h2"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            >
              {block.text}
            </motion.h2>
          ) : (
            <motion.h3
              key={i}
              className="blogpost-h3"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            >
              {block.text}
            </motion.h3>
          );

        case "code":
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.08 }}
              transition={{ duration: 0.38, ease: EASE_OUT }}
            >
              <CodeBlock
                language={block.language}
                code={block.code}
                filename={block.filename}
              />
            </motion.div>
          );

        case "quote":
          return (
            <motion.blockquote
              key={i}
              className="blogpost-quote"
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
            >
              <span className="blogpost-quote__mark" aria-hidden="true">"</span>
              <p className="blogpost-quote__text">{block.text}</p>
              {block.author && (
                <cite className="blogpost-quote__author">— {block.author}</cite>
              )}
            </motion.blockquote>
          );

        case "image":
          return (
            <motion.figure
              key={i}
              className="blogpost-figure"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            >
              <img src={block.src} alt={block.alt} loading="lazy" />
              {block.caption && <figcaption>{block.caption}</figcaption>}
            </motion.figure>
          );

        case "list":
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            >
              {block.ordered ? (
                <ol className="blogpost-list">
                  {block.items.map((item, j) => <li key={j}>{item}</li>)}
                </ol>
              ) : (
                <ul className="blogpost-list">
                  {block.items.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              )}
            </motion.div>
          );

        case "callout":
          return (
            <motion.div
              key={i}
              className={`blogpost-callout blogpost-callout--${block.variant}`}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            >
              <span className="blogpost-callout__icon" aria-hidden="true">
                {CALLOUT_ICONS[block.variant]}
              </span>
              <p className="blogpost-callout__text">{block.text}</p>
            </motion.div>
          );

        case "divider":
          return <hr key={i} className="blogpost-divider" />;

        case "video":
          return (
            <div key={i} className="blogpost-video">
              <iframe
                src={block.src}
                title={block.title ?? "Video embed"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          );

        default:
          return null;
      }
    })}
  </div>
);

// ── ShareButtons ───────────────────────────────────────────────────────────────

const ShareButtons: React.FC<{ title: string }> = ({ title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback: do nothing */
    }
  }, []);

  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;

  return (
    <div className="blogpost-share">
      <span className="blogpost-share__label">Share</span>

      <div className="blogpost-share__buttons">
        {/* X / Twitter */}
        <motion.a
          href={twitterHref}
          target="_blank"
          rel="noopener noreferrer"
          className="blogpost-share-btn"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Share on X (Twitter)"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.766l7.44-8.506-7.874-10.495h3.556l4.213 5.569L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
          </svg>
        </motion.a>

        {/* LinkedIn */}
        <motion.a
          href={linkedinHref}
          target="_blank"
          rel="noopener noreferrer"
          className="blogpost-share-btn"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Share on LinkedIn"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </motion.a>

        {/* Copy link */}
        <motion.button
          className={`blogpost-share-btn${copied ? " blogpost-share-btn--copied" : ""}`}
          onClick={handleCopyLink}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          aria-label={copied ? "Link copied!" : "Copy link"}
          type="button"
        >
          {copied ? (
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </motion.button>
      </div>

      {copied && (
        <motion.span
          className="blogpost-share-copied"
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          Link copied!
        </motion.span>
      )}
    </div>
  );
};

// ── AuthorBio ──────────────────────────────────────────────────────────────────

const AuthorBio: React.FC<{ author: BlogPost["author"] }> = ({ author }) => (
  <div className="blogpost-author-bio">
    <motion.div
      className="blogpost-author-bio__card"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
    >
      <div className="blogpost-author-bio__avatar" aria-hidden="true">
        {author.initials ?? author.name.slice(0, 2).toUpperCase()}
      </div>
      <div className="blogpost-author-bio__body">
        <p className="blogpost-author-bio__name">{author.name}</p>
        <span className="blogpost-author-bio__role">
          Software Engineer & Designer · Based in Saudi Arabia
        </span>
        <p className="blogpost-author-bio__desc">
          Building digital products at the intersection of design and
          engineering. Writing about UI/UX, front-end development, and design
          systems from real product experience.
        </p>
      </div>
    </motion.div>
  </div>
);

// ── RelatedPosts ───────────────────────────────────────────────────────────────

interface RelatedPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover_image_url?: string | null;
  published_at?: string | null;
  read_time?: number;
}

const RelatedPosts: React.FC<{ currentSlug: string; category: string; apiRelated?: RelatedPost[] }> = ({
  currentSlug,
  category,
  apiRelated,
}) => {
  const navigate = useNavigate();

  const posts: RelatedPost[] = apiRelated && apiRelated.length > 0
    ? apiRelated
    : (() => {
        const sameCategory = BLOG_POSTS.filter(p => p.slug !== currentSlug && p.category === category);
        const others = BLOG_POSTS.filter(p => p.slug !== currentSlug && !sameCategory.find(r => r.slug === p.slug));
        return [...sameCategory, ...others].slice(0, 3).map(p => ({
          id: p.id, slug: p.slug, title: p.title, excerpt: p.excerpt,
          category: p.category, cover_image_url: p.coverImage,
          published_at: p.publishDate, read_time: p.readTime,
        }));
      })();

  if (posts.length === 0) return null;

  return (
    <section className="blogpost-related" aria-label="Related articles">
      <div className="blogpost-related__header">
        <h2 className="blogpost-related__title">More to Read</h2>
        <a href="/blog" className="blogpost-related__all">
          All articles →
        </a>
      </div>

      <div className="blogpost-related__grid">
        {posts.map((post, i) => (
          <motion.a
            key={post.id}
            href={`/blog/${post.slug}`}
            className="blogpost-rcard"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: EASE_OUT }}
            whileHover={{
              y: -5,
              transition: { type: "spring", stiffness: 280, damping: 22 },
            }}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/blog/${post.slug}`);
            }}
          >
            <div className="blogpost-rcard__cover" aria-hidden="true">
              {post.cover_image_url ? (
                <img src={post.cover_image_url} alt={post.title} loading="lazy" />
              ) : (
                <div className="blogpost-rcard__cover-placeholder">
                  <span>{post.title.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="blogpost-rcard__body">
              <span className="blogpost-rcard__category">{post.category}</span>
              <h3 className="blogpost-rcard__title">{post.title}</h3>
              <span className="blogpost-rcard__meta">
                {post.published_at ? formatDate(post.published_at) : ""}{post.read_time ? ` · ${post.read_time} min read` : ""}
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

// ── BlogPostPage ───────────────────────────────────────────────────────────────

const AUTHOR = { name: "Shahad Altharwa", initials: "SA" };

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [apiPost, setApiPost] = useState<ApiPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    blogApi
      .getPost(slug)
      .then(setApiPost)
      .catch(() => {
        const fallback = BLOG_POSTS.find((p) => p.slug === slug);
        if (!fallback) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Derive display data from API response or fallback to sample data
  const samplePost = BLOG_POSTS.find((p) => p.slug === slug);

  const title = apiPost?.title ?? samplePost?.title ?? "";
  const excerpt = apiPost?.excerpt ?? samplePost?.excerpt ?? "";
  const coverImage = apiPost?.cover_image_url ?? samplePost?.coverImage ?? null;
  const category = apiPost?.category ?? samplePost?.category ?? "";
  const tags = apiPost?.tags ?? samplePost?.tags ?? [];
  const publishDate = apiPost?.published_at ?? samplePost?.publishDate ?? "";
  const readTime = apiPost?.read_time ?? samplePost?.readTime ?? 1;

  const content: ContentBlock[] = apiPost?.blocks?.length
    ? (apiPost.blocks.map(mapApiBlock).filter(Boolean) as ContentBlock[])
    : samplePost
    ? getContent(samplePost)
    : [{ type: "paragraph", text: excerpt }];

  if (loading) {
    return (
      <div className="page-shell">
        <main className="page-shell-content">
          <NavigationMenu />
          <div className="blogpost-loading" aria-label="Loading article">
            <div className="blogpost-loading__bar" />
            <div className="blogpost-loading__title" />
            <div className="blogpost-loading__line" />
            <div className="blogpost-loading__line blogpost-loading__line--short" />
          </div>
        </main>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="page-shell">
        <main className="page-shell-content">
          <NavigationMenu />
          <div className="blogpost-notfound">
            <span className="blogpost-notfound__eyebrow" aria-hidden="true">404</span>
            <h1 className="blogpost-notfound__title">Article not found</h1>
            <p className="blogpost-notfound__sub">This article doesn't exist or may have been moved.</p>
            <button className="blogpost-notfound__btn" onClick={() => navigate("/blog")} type="button">
              ← Back to Blog
            </button>
          </div>
          <StickyFooter />
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <main className="page-shell-content">
        <ReadingProgress />
        <NavigationMenu />

        {/* ── Back navigation ───────────────────────────────────────────── */}
        <nav className="blogpost-back" aria-label="Breadcrumb">
          <motion.button
            className="blogpost-back-btn"
            onClick={() => navigate("/blog")}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: EASE_OUT }}
            type="button"
          >
            <span className="blogpost-back-btn__arrow" aria-hidden="true">←</span>
            <span>Back to Blog</span>
          </motion.button>
        </nav>

        {/* ── Post header ───────────────────────────────────────────────── */}
        <header className="blogpost-header">
          <motion.div
            className="blogpost-cover"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, ease: EASE_OUT }}
          >
            {coverImage ? (
              <img src={coverImage} alt={title} />
            ) : (
              <div className="blogpost-cover-placeholder" aria-hidden="true">
                <span>{title.charAt(0)}</span>
              </div>
            )}
          </motion.div>

          <div className="blogpost-title-area">
            <motion.div
              className="blogpost-category-row"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25, ease: EASE_OUT }}
            >
              <span className="blogpost-category">{category}</span>
              {tags.map((tag) => (
                <span key={tag} className="blogpost-tag">{tag}</span>
              ))}
            </motion.div>

            <motion.h1
              className="blogpost-title"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease: EASE_OUT }}
            >
              {title}
            </motion.h1>

            <motion.div
              className="blogpost-meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.46, ease: EASE_OUT }}
              role="contentinfo"
              aria-label="Article metadata"
            >
              <div className="blogpost-author">
                <div className="blogpost-author__avatar" aria-hidden="true">{AUTHOR.initials}</div>
                <span className="blogpost-author__name">{AUTHOR.name}</span>
              </div>
              <span className="blogpost-meta__sep" aria-hidden="true" />
              {publishDate && (
                <time className="blogpost-meta__item" dateTime={publishDate}>
                  {formatDate(publishDate)}
                </time>
              )}
              <span className="blogpost-meta__sep" aria-hidden="true" />
              <span className="blogpost-meta__item">{readTime} min read</span>
            </motion.div>
          </div>
        </header>

        {/* ── Article content ───────────────────────────────────────────── */}
        <article aria-label={`Article: ${title}`}>
          <ContentRenderer blocks={content} />
        </article>

        <ShareButtons title={title} />
        <AuthorBio author={AUTHOR} />
        <RelatedPosts
          currentSlug={slug ?? ""}
          category={category}
          apiRelated={apiPost?.related}
        />

        <StickyFooter />
      </main>
    </div>
  );
};

export default BlogPostPage;
