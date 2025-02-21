import { useState } from "react";
import AnimatedLink from "./AnimatedLink";
import "../styles/navbar.scss";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <a href="/">SHAHAD ALTHARWA</a>
        </div>
        {/* Two-line Hamburger Menu */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <div className={`bar top ${menuOpen ? "open" : ""}`}></div>
          <div className={`bar bottom ${menuOpen ? "open" : ""}`}></div>
        </div>
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li>
            <AnimatedLink linkText="Updates" hoverText="Updates" href="/home" />
          </li>
          <li>
            <AnimatedLink
              linkText="Downloads"
              hoverText="Downloads"
              href="/about"
            />
          </li>
          <li>
            <AnimatedLink linkText="CV" hoverText="CV" href="/services" />
          </li>
          <li>
            <AnimatedLink linkText="Blog" hoverText="Blog" href="/services" />
          </li>
          <li>
            <AnimatedLink
              linkText="Contact"
              hoverText="Contact"
              href="/contact"
            />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
