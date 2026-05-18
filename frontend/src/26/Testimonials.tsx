import { useEffect, useState } from "react";
import "./style/Testimonials.scss";
import { API_URL } from "../api/api";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  display_order: number;
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  // Current testimonial shortcut
  const currentTestimonial = testimonials[current];

  // Fetch testimonials from API
  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch(`${API_URL}/testimonials`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Expected API response:
        // {
        //   success: true,
        //   data: [...]
        // }
        if (result.success && Array.isArray(result.data)) {
          setTestimonials(result.data);
        } else {
          console.error("Invalid API response:", result);
          setTestimonials([]);
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  // Reset current index if testimonials length changes
  useEffect(() => {
    if (testimonials.length > 0 && current >= testimonials.length) {
      setCurrent(0);
    }
  }, [testimonials, current]);

  // Navigation handler
  const navigate = (dir: "next" | "prev") => {
    // Prevent navigation while animating or when there is no data
    if (animating || testimonials.length === 0) return;

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

  // Loading state
  if (loading) {
    return (
      <div className="testimonials-section">
        <p>Loading testimonials...</p>
      </div>
    );
  }

  // Empty state
  if (testimonials.length === 0) {
    return (
      <div className="testimonials-section">
        <p>No testimonials available.</p>
      </div>
    );
  }

  return (
    <div className="testimonials-section">
      {/* Section heading */}
      <div className="testimonials-heading">
        <div className="testimonials-heading-row">
          <h2 className="testimonials-title">
            The Word,
            <br />
            From Others
          </h2>
          <span className="testimonials-count-header">03</span>
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
              {String(current + 1).padStart(2, "0")} /{" "}
              {String(testimonials.length).padStart(2, "0")}
            </span>

            <p className="author-name">{currentTestimonial.name}</p>
            <p className="author-role">{currentTestimonial.role}</p>
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
            <p className="quote-text" dir="rtl">
              {currentTestimonial.text}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="testimonials-nav">
        <div className="testimonials-nav-wrap">
          {/* Previous Button */}
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

          {/* Dots */}
          <div className="testimonials-dots">
            {testimonials.map((_, i) => (
              <div
                key={i}
                className={`dot${i === current ? " active" : ""}`}
                onClick={() => {
                  if (i === current || animating) return;

                  setDirection(i > current ? "next" : "prev");
                  setCurrent(i);
                }}
              />
            ))}
          </div>

          {/* Next Button */}
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