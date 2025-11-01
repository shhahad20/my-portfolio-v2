import { useState } from "react";
import AnimatedLink from "./AnimatedLink";
import "../styles/navbar.scss";
// import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [msg, setMsg] = useState(false);

  const showComingSoon = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.preventDefault(); 
    setMsg(true);
    setTimeout(() => {
      setMsg(false);
    }, 5000); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <a href="/">
            <img src="/logo-white.svg" alt="Logo" />
          </a>
        </div>
        {/* Two-line Hamburger Menu */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <div className={`bar top ${menuOpen ? "open" : ""}`}></div>
          <div className={`bar bottom ${menuOpen ? "open" : ""}`}></div>
        </div>
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li onClick={showComingSoon}>
            <AnimatedLink linkText="Updates" hoverText="Updates" href="/" />
            {/* <Link to="/">Updates</Link> */}
          </li>
          <li onClick={showComingSoon}>
            <AnimatedLink linkText="Downloads" hoverText="Downloads" href="/" />
          </li>
          <li>
            <AnimatedLink
              linkText="CV"
              hoverText="CV"
              href="/CV_Shahad_Altharwa_Software_Engineer2025v2.pdf"
              target="_blank"
              rel="noopener noreferrer"
            />
          </li>
          <li onClick={showComingSoon}>
            <AnimatedLink linkText="Blog" hoverText="Blog" href="/" />
            
          </li>
          <li>
            <AnimatedLink
              linkText="Contact"
              hoverText="Contact"
              href="#contact"
            />
          </li>
          {msg && <span className="coming-soon-message">Coming soon! 😎</span>}
        </ul>
        {/* {msg && <span className="coming-soon-message">Coming soon! 😎</span>} */}
      </div>
    </nav>
  );
};

export default Navbar;
