import '../styles/navbar.scss';

const Navbar = () => {
  return (
    <nav className="navbar">
        <div className="navbar-container">
      <div className="logo">
        <a href="/">SHAHAD ALTHARWA</a>
      </div>
      <ul className="nav-links">
        <li><a href="/home">Resume</a></li>
        <li><a href="/about">Blog</a></li>
        {/* <li><a href="/services">Services</a></li> */}
        <li><a href="/contact">Contact</a></li>
      </ul>
      </div>
    </nav>
  );
};

export default Navbar;
