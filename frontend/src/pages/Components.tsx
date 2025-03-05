import ChatWidget from "../components/ChatWidget";
import ComponentsCards from "../components/ComponentsCards";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import '../App.css';

const Components: React.FC = () => {
  return (
    <>
      <div className="app-container">
        <ChatWidget />
        <Navbar />
      </div>
      <main className="main-content">
        <ComponentsCards />
      </main>
      <Footer />
    </>
  );
};

export default Components;
