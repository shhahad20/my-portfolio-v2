// ─────────────────────────────────────────────────────────────────────────────
// About Me — content for the five-character ring.
//
// Each character maps to one topic of the original About Me section and
// carries its original paragraph(s) verbatim (`paragraphs`, **bold** markers
// preserved). Every other field is drawn only from those paragraphs.
// Images live in /public/about. `tags` are the [left%, top%] hotspot
// positions on each figure, one per `highlights` item, in order.
// ─────────────────────────────────────────────────────────────────────────────

export interface PersonaFact {
  label: string;
  value: string;
}

export interface PersonaHighlight {
  name: string;
  meta: string;
  desc: string;
}

export interface Persona {
  key: string;
  /** Topic name — the original section's link labels. */
  name: string;
  /** Short tag shown under the name (labels, dock pills). */
  tag: string;
  /** One-line summary shown in the dock and the focus view. */
  summary: string;
  /** Key line quoted from the original paragraph. */
  lead: string;
  /** Original About Me paragraph(s), verbatim. */
  paragraphs: string[];
  facts: PersonaFact[];
  skills: string[];
  highlights: PersonaHighlight[];
  image: string;
  /** Vertical nudge of the figure, as a fraction of its height. */
  foot: number;
  tags: [number, number][];
}

export const PERSONAS: Persona[] = [
  {
    key: "engineering",
    name: "Software Engineering",
    tag: "Bachelor's · 2018–2023",
    summary: "Bachelor's degree in Software Engineering · University of Hail",
    lead: "My journey in tech started with a curiosity for how things work.",
    paragraphs: [
      "My journey in tech started with a curiosity for how things work, which led me to earn my **Bachelor's degree** in Software Engineering from the University of Hail 2018–2023. Along the way, I developed a strong foundation in problem-solving, algorithms, and building efficient, scalable systems.",
    ],
    facts: [
      { label: "Degree", value: "Bachelor's, Software Engineering" },
      { label: "University", value: "University of Hail" },
      { label: "Years", value: "2018–2023" },
    ],
    skills: ["Problem-Solving", "Algorithms", "Efficient Systems", "Scalable Systems"],
    highlights: [
      { name: "Bachelor's Degree", meta: "2018–2023", desc: "Software Engineering at the University of Hail" },
      { name: "Problem-Solving & Algorithms", meta: "Foundation", desc: "A strong foundation developed along the way" },
      { name: "Scalable Systems", meta: "Foundation", desc: "Building efficient, scalable systems" },
    ],
    image: "/about/explorer.webp",
    foot: 0.02,
    tags: [[68, 32], [76, 52], [50, 88]],
  },
  {
    key: "fullstack",
    name: "Full-Stack Dev",
    tag: "Front-end · Back-end",
    summary: "From front-end to back-end · MERN Bootcamp, 2023",
    lead: "Bringing ideas to life with HTML, CSS, and JavaScript.",
    paragraphs: [
      "I began with front-end development bringing ideas to life with HTML, CSS, and JavaScript, then naturally moved into backend development with Python, working with databases and APIs.",
      "**MERN Bootcamp** at Saudi Digital Academy x Integrify (Sep–Dec 2023) helped me grow into a more confident full-stack developer and explore data-driven solutions.",
    ],
    facts: [
      { label: "Front-end", value: "HTML, CSS, JavaScript" },
      { label: "Back-end", value: "Python, databases, APIs" },
      { label: "Bootcamp", value: "MERN · Saudi Digital Academy x Integrify" },
      { label: "Dates", value: "Sep–Dec 2023" },
    ],
    skills: ["HTML", "CSS", "JavaScript", "Python", "Databases", "APIs", "MERN"],
    highlights: [
      { name: "Front-End Development", meta: "Where I began", desc: "Bringing ideas to life with HTML, CSS, and JavaScript" },
      { name: "Back-End Development", meta: "Python", desc: "Working with databases and APIs" },
      { name: "MERN Bootcamp", meta: "Sep–Dec 2023", desc: "Saudi Digital Academy x Integrify" },
    ],
    image: "/about/developer.webp",
    foot: 0.02,
    tags: [[68, 48], [40, 68], [55, 90]],
  },
  {
    key: "design",
    name: "Graphic Design",
    tag: "Freelance · 5+ years",
    summary: "Freelance graphic designer · 5+ years · 300+ projects",
    lead: "An experience that still shapes how I think about design and user experience today.",
    paragraphs: [
      "I spent over five years as a **freelance graphic designer**, completing 300+ projects, an experience that still shapes how I think about design and user experience today.",
    ],
    facts: [
      { label: "Role", value: "Freelance graphic designer" },
      { label: "Experience", value: "5+ years" },
      { label: "Projects", value: "300+" },
    ],
    skills: ["Graphic Design", "Visual Design", "User Experience"],
    highlights: [
      { name: "Freelance Designer", meta: "5+ years", desc: "Over five years as a freelance graphic designer" },
      { name: "300+ Projects", meta: "Completed", desc: "More than 300 projects delivered" },
      { name: "Design Thinking", meta: "Today", desc: "Still shapes how I think about design and user experience" },
    ],
    image: "/about/artist.webp",
    foot: 0.02,
    tags: [[68, 38], [42, 64], [58, 88]],
  },
  {
    key: "teaching",
    name: "Teaching Assistant",
    tag: "Java · Data Structures",
    summary: "Teaching Assistant · Java & data structures",
    lead: "Supporting students in building strong programming foundations.",
    paragraphs: [
      "I also worked as a **Teaching Assistant**, where I taught Java and data structures and supported students in building strong programming foundations.",
    ],
    facts: [
      { label: "Role", value: "Teaching Assistant" },
      { label: "Taught", value: "Java, data structures" },
    ],
    skills: ["Java", "Data Structures", "Teaching", "Mentoring"],
    highlights: [
      { name: "Java", meta: "Taught", desc: "Teaching Java programming" },
      { name: "Data Structures", meta: "Taught", desc: "Teaching data structures" },
      { name: "Student Support", meta: "Mentoring", desc: "Helping students build strong programming foundations" },
    ],
    image: "/about/teacher.webp",
    foot: 0.02,
    tags: [[74, 46], [42, 66], [54, 90]],
  },
  {
    key: "certifications",
    name: "Certifications",
    tag: "SCRUM · Azure AI",
    summary: "Growing as a full-stack developer while exploring AI",
    lead: "Exploring artificial intelligence to build smarter, more impactful systems.",
    paragraphs: [
      "Today, I'm focused on growing as a full-stack developer while exploring artificial intelligence to build smarter, more impactful systems. I hold **SCRUM** and **Microsoft Azure AI Fundamentals** certifications that support this journey.",
    ],
    facts: [
      { label: "Certified", value: "SCRUM" },
      { label: "Certified", value: "Microsoft Azure AI Fundamentals" },
      { label: "Focus", value: "Full-stack development & AI" },
    ],
    skills: ["SCRUM", "Azure AI Fundamentals", "Artificial Intelligence", "Full-Stack"],
    highlights: [
      { name: "SCRUM", meta: "Certification", desc: "Certified in SCRUM" },
      { name: "Azure AI Fundamentals", meta: "Certification", desc: "Microsoft Azure AI Fundamentals" },
      { name: "Exploring AI", meta: "Today", desc: "Building smarter, more impactful systems" },
    ],
    image: "/about/learner.webp",
    foot: 0.02,
    tags: [[64, 46], [44, 70], [52, 90]],
  },
];
