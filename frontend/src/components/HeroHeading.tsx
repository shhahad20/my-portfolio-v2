import "../styles/heroHeading.scss";

const HeroHeading = () => {
  return (
    <div id="hero_heading_section">
      <div id="hero_heading">
        <h1 className="brackets">[ </h1>
        <h1 id="hello">Hello, I'm </h1>
        <div className="name">
          <h1 className="word">an Engineer</h1>
          <h1 className="word">a Developer</h1>
          <h1 className="word">a Designer</h1>
          <h1 className="word">a Teacher</h1>
        </div>
        <h1 className="brackets">] </h1>
      </div>
    </div>
  );
};

export default HeroHeading;