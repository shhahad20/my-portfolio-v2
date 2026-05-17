import { useState } from "react";
import './style/Testimonials.scss';

const testimonials = [
  {
    id: 1,
    name: "Fatima Abdullah",
    role: "Client · Graphic Design",
    text: "يعطيك العافية العمل جميل جدًا وماراح يكون اخر تعاون بيننا، أسلوبك في العمل مميز جداً ويعكس احترافية عالية.",
  },
  {
    id: 2,
    name: "Mohammed Al-Rashidi",
    role: "Student · UI/UX Design",
    text: "الدورة كانت من أفضل ما حضرته، الأستاذ يشرح بأسلوب واضح ومبسط، وكل تفصيلة كانت مدروسة بعناية. بالتوفيق دائمًا.",
  },
  {
    id: 3,
    name: "Sara Al-Qahtani",
    role: "Client · Brand Identity",
    text: "تعامل راقي واحترافية واضحة من أول لقاء. النتيجة فاقت توقعاتي وأنا سعيدة جدًا بالهوية البصرية الجديدة.",
  },
  {
    id: 4,
    name: "Khalid Bin Nasser",
    role: "Student · Motion Graphics",
    text: "شرح منظم ومرتب، وكل درس يبني على اللي قبله. استفدت كثير وأنا أنصح كل من يريد يتعلم يلتحق بهذي الدورة.",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("next");

  const navigate = (dir: "next" | "prev") => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) =>
        dir === "next"
          ? (prev + 1) % testimonials.length
          : (prev - 1 + testimonials.length) % testimonials.length,
      );
      setAnimating(false);
    }, 380);
  };

  const t = testimonials[current];

  return (
    <div className="testimonials-section">
      {/* Decorative background number */}
      {/* <div className="testimonials-bgnum">03</div> */}

      {/* Section heading */}
      <div className="testimonials-heading">
        <div className="testimonials-heading-row">
          <h2 className="testimonials-title">
            The Word,<br />From Others
          </h2>
          <span className="testimonials-count-header">
            03
          </span>
        </div>
      </div>

      {/* Main testimonial area */}
      <div className="testimonial-layout">
        {/* Author column */}
        <div className="author-col">
          <div
            key={`author-${current}`}
            className={
              animating
                ? direction === "next"
                  ? "slide-exit-next"
                  : "slide-exit-prev"
                : direction === "next"
                  ? "slide-enter-next"
                  : "slide-enter-prev"
            }
          >
            <div className="author-accent-line" />
             <span className="testimonials-count">
            0{current + 1} / 0{testimonials.length}
          </span>
            <p className="author-name">{t.name}</p>
            <p className="author-role">{t.role}</p>
          </div>
        </div>

        {/* Quote content */}
        <div className="quote-col">
          <div className="quote-marks">"</div>
          <div
            key={`quote-${current}`}
            className={
              animating
                ? direction === "next"
                  ? "slide-exit-next"
                  : "slide-exit-prev"
                : direction === "next"
                  ? "slide-enter-next"
                  : "slide-enter-prev"
            }
          >
            <p className="quote-text" dir="rtl">{t.text}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="testimonials-nav">
        <div className="testimonials-nav-wrap">
        <button
          className="nav-btn"
          onClick={() => navigate("prev")}
          aria-label="Previous testimonial"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="testimonials-dots">
          {testimonials.map((_, i) => (
            <div
              key={i}
              className={`dot${i === current ? " active" : ""}`}
              onClick={() => {
                if (i !== current) {
                  setDirection(i > current ? "next" : "prev");
                  navigate(i > current ? "next" : "prev");
                }
              }}
            />
          ))}
        </div>
        <button
          className="nav-btn"
          onClick={() => navigate("next")}
          aria-label="Next testimonial"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        </div>
      </div>
    </div>
  );
}
