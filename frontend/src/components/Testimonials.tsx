import { motion, PanInfo } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import FlipLink from "./AnimatedHeader ";

import "../styles/testimonials.scss";

const testimonials = [
  {
    name: "Student",
    text: "دكتوره ماندري وش نقول لكن الله يفتحها بوجهك ويجزاك خير ، وييسر لك كل ماتعسّر ويفرجها عليك بيوم العرض ، هذا الخبر الزين💖..",
    role: "Student - Java Course",
  },
  {
    name: "Student",
    text: "شكرا دكتوره الله يسخر لك جنود الأرض وملائكة السماء الله يدخل على قلبك اضعاف الفرحه، محاضرات معك مره خفيف ويكفي حنيتك علينا رغم نجي لك نهاية دوام تعبانين من المحاضرات ياللي ورا بعض ومانتفاعل معك حيل بالمحاضره مع ذاك ماقصرتي معنا الله يجعل والدينك للجنه البارده وسامحينا لو قصرنا بحقك ❤️❤️❤️❤️",
    role: "Student - Java Course",
  },
  {
    name: "فيصل",
    text: "والله واو ولا غلطه",
    role: "Client - Graphic Design",
  },
  {
    name: "نجلاء الحقباني",
    text: "الله يعطيك العافية على الشغل الجميل اسرع مما توقعت ومتعاونة جدا وتردين بسرعه",
    role: "Client - Graphic Design",
  },
  {
    name: "Student",
    text: "اذا بتدرسينها علميني ب اخذها عندك الترم الجاي افضل دكتوره 💛🥺",
    role: "Student - Java Course",
  },
  {
    name: "Ahmed",
    text: "يعطيك العافية عمل جميل جداَ وبإذن الله ماراح يكون اخر تعاون بينا",
    role: "Entrepreneur",
  },
  {
    name: "شوق",
    text: "انتي رائعة يا بنت ماشاء الله ربي يحفظك",
    role: "Client - Graphic Design",
  },
  {
    name: "Student",
    text: "ماقصرتي الحمدلله عندنا دكتورة مثلك حببتيني بالماده",
    role: "Student - Java Course",
  },
];

const AUTO_SLIDE_INTERVAL = 8000; // 8 seconds
// Each card is fixed at 500px wide:
const DEFAULT_CARD_WIDTH = 500; // The maximum card width for larger screens

const Testimonials = () => {
  // currentIndex: which testimonial is currently centered
  const [currentIndex, setCurrentIndex] = useState(0);

  // Measure the container so we can position the cards properly
  const sliderRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // On mount and on window resize, update container width
  useEffect(() => {
    const updateWidth = () => {
      if (sliderRef.current) {
        setContainerWidth(sliderRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Auto-advance every 8s
  useEffect(() => {
    const timer = setInterval(() => {
      goNext();
    }, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  // Handle the swipe offset on drag end
  const handleDragEnd = (    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo) => {
    const offset = info.offset.x;
    if (offset < -50) {
      // Swiped left => next
      goNext();
    } else if (offset > 50) {
      // Swiped right => prev
      goPrev();
    }
  };

  const effectiveCardWidth =
    containerWidth < DEFAULT_CARD_WIDTH
      ? containerWidth * 0.9
      : DEFAULT_CARD_WIDTH;

  // Calculate track width & offset based on the effective card width
  const trackWidth = testimonials.length * effectiveCardWidth;
  const xOffset =
    containerWidth / 2 -
    effectiveCardWidth / 2 -
    currentIndex * effectiveCardWidth;

  return (
    <section id="testimonials">
      <motion.div
        className="header-content"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="between-lines">
          <div>
            <h1 className="community-header">Our Community</h1>
          </div>
        </div>
        {/* <h1 className="second-header">Career Highlights</h1> */}
        <div className="flip">
          <div className="flip1">
            {" "}
            <FlipLink href="#">The</FlipLink>
            <FlipLink href="#">Word</FlipLink>
            <h1 className="comma">,</h1>
          </div>
          <div className="flip2">
            {" "}
            <FlipLink href="#">From</FlipLink>
            <FlipLink href="#">Others</FlipLink>
          </div>
        </div>
        <p className="third-p">Connecting through shared experiences</p>
      </motion.div>
      <motion.div
        className="slider"
        ref={sliderRef}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          className="slider-track"
          style={{ width: trackWidth }}
          drag="x"
          dragMomentum={false}
          dragConstraints={{
            left: -(trackWidth - containerWidth),
            right: 0,
          }}
          onDragEnd={handleDragEnd}
          animate={{ x: xOffset }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {testimonials.map((testimonial, index) => (
            // Full opacity for the center card; half opacity for the others.

            <div
              key={index}
              className="slide"
              style={{ width: effectiveCardWidth }}
            >
              <div
                className="card"
                style={{
                  opacity: index === currentIndex ? 1 : 0.5,
                  transform: `scale(${index === currentIndex ? 1 : 0.9})`,
                }}
              >
                <p>{testimonial.text}</p>
                <h4>{testimonial.name}</h4>
                <span>{testimonial.role}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Testimonials;
