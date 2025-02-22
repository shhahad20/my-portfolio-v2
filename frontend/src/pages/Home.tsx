import About from "../components/About";
import ChatWidget from "../components/ChatWidget";
import Contact from "../components/Contact";
import Dashboard from "../components/Dashboard";
import Experience from "../components/Experience";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Info from "../components/Info";
import MyPartners from "../components/MyPartners";
import Navbar from "../components/Navbar";
import Testimonials from "../components/Testimonials";

const Home: React.FC = () => {
  return (
    <>
    <ChatWidget />
    <Navbar/>
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
