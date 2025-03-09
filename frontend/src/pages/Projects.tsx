import ChatWidget from "../components/ChatWidget";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import '../App.css';
import ProjectsCards from "../components/ProjectsCards";

const Projects: React.FC = () => {
  return (
    <>
      <div className="app-container">
        <ChatWidget />
        <Navbar />
      </div>
      <main className="main-content">
        <ProjectsCards />
      </main>
      <Footer />
    </>
  );
};

export default Projects;
