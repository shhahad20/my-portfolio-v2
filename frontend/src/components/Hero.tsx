import { useEffect } from "react";
import "../styles/hero.scss";
import HeroHeading from "./HeroHeading";
import ChatWidget from "./ChatWidget";

const Hero = () => {
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

  return (
    <section id="hero">
      <div className="background">
        <div className="spotlight">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="lines-background">
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
        </div>
        <div className="content">
          <HeroHeading />
          <h2 className="head-head">Growth Focused</h2>
          <p className="para">
            I once thought HTML was a programming language-turns out, it was
            just the start of my journey.
          </p>
          {/* <a href="#about-section" className="more-about-button">
            More About
          </a> */}
          <ChatWidget/>
        </div>
      </div>
    </section>
  );
};

export default Hero;
