import About from "../components/About";
import Contact from "../components/Contact";
import Dashboard from "../components/Dashboard";
import Experience from "../components/Experience";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Info from "../components/Info";
import MyPartners from "../components/MyPartners";
import Testimonials from "../components/Testimonials";

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <About />
      <Dashboard/>
      <Experience />
      <MyPartners />
      <Testimonials/>
      <Info/>
      <Contact/>
      <Footer/>
    </>
  );
};

export default Home;
