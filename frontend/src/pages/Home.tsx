// import "../styles/home.scss";

import About from "../components/About";
import Dashboard from "../components/Dashboard";
import Education from "../components/Education";
import Experience from "../components/Experience";
import Hero from "../components/Hero";
import MyPartners from "../components/MyPartners";

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <About />
      <Dashboard/>
      {/* <Education/> */}
      <Experience />
      <MyPartners />
    </>
  );
};

export default Home;
