import { useEffect, useState } from "react";
import "../styles/hero.scss";
import HeroHeading from "./HeroHeading";
import ChatModal from "./ChatModal";

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const headHeadElement = document.querySelector(".head-head");

    const showHeadHead = () => {
      // headHeadElement.classList.add('visible');
      if (headHeadElement) {
        headHeadElement.classList.add("visible");
      }
    };
    setTimeout(showHeadHead, 100);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    });
    if (headHeadElement) {
      observer.observe(headHeadElement);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  // Open and close the modal
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <section id="hero">
      <div className="background">
        <div className="spotlight">
          <div></div>
          <div></div>
          <div></div>
        </div>
        {/* <div className="lines-background">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
        <div className="lines-background-ver">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div> */}
        <div className="content">
          <HeroHeading />
          <h2 className="head-head">Growth Focused</h2>
          <p className="para">
            I once thought HTML was a programming language-turns out, it was
            just the start of my journey.
          </p>
          {/* Render the modal conditionally */}
          <div onClick={openModal} className="more-about-button">
            <span className="badge">New</span>
            <span className="button-text">Ask Shahad's AI</span>
            {/* <span className="arrow">→</span> */}
            <span className="arrow"><img src="/white-right-arrow.svg" alt="Arrow" /></span>
          </div>
        </div>
      </div>
      {isModalOpen && <ChatModal closeModal={closeModal} />}
    </section>
  );
};

export default Hero;
