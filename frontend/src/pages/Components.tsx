import ChatWidget from "../components/ChatWidget";
import ComponentsCards from "../components/ComponentsCards";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Components: React.FC = () => {
  return (
    <>
      <ChatWidget />
      <Navbar />
      <ComponentsCards />
      <Footer />
    </>
  );
};

export default Components;
