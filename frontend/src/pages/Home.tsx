// import About from "../components/About";
// import Cards from "../components/Cards";
// import ChatWidget from "../components/ChatWidget";
// import Contact from "../components/Contact";
// // import Dashboard from "../components/Dashboard";
// import Experience from "../components/Experience";
// import Footer from "../components/Footer";
// import Hero from "../components/Hero";
// import Info from "../components/Info";
// // import MyPartners from "../components/MyPartners";
// import Navbar from "../components/Navbar";
// import Testimonials from "../components/Testimonials";

import AboutMe from "../26/Aboutme";
import BigPictureStats from "../26/BigPicture";
import StickyFooter from "../26/Footer";
import LandingPage from "../26/LandingPage";
import NavigationMenu from "../26/Nav";
import WhatKeepsMeBusy from "../26/Projects";
import TestimonialsSection from "../26/Testimonials";
import "../26/style/Footer.scss";
const Home: React.FC = () => {
  return (
    // <>
    // <ChatWidget />
    // <Navbar/>
    //   <Hero />
    //   <About />
    //   <Cards/>
    //   {/* <Dashboard/> */}
    //   <Experience />
    //   {/* <MyPartners /> */}
    //   <Testimonials/>
    //   <Info/>
    //   <Contact/>
    //   <Footer/>
    // </>
    <div className="page-shell">
      <main className="page-shell-content">
        <NavigationMenu/>
        <LandingPage imageSrc="../public/Landingill.svg" />
        <AboutMe />
        <WhatKeepsMeBusy />
        <TestimonialsSection />
        <BigPictureStats />
        <StickyFooter />
      </main>

    </div>
  );
};

export default Home;
