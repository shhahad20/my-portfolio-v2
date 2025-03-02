import GradientCard from "./Card";
import "../styles/cards.scss";

const greenishTheme = {
  backgroundColor: "rgb(211, 211, 84)", // Original dark background
  borderColor: "1px solid #D3D354",
  starColor: "rgba(211, 211, 84, 0.7)",
  headerColor: "#D3D354",
};

const pinkishTheme = {
  backgroundColor: "#D96570", // Light pink background
  textBackground: "rgba(217, 101, 113, 0.4)",
  borderColor: "1px solid #D96570",
  starColor: "rgba(255, 154, 205, 0.56)",
  headerColor: "#D96570",
  lightColorHeader: "#F9BDC3",
};
const bluishTheme = {
    backgroundColor: "#5489D6", // Light pink background
    textBackground: "rgba(84, 137, 214, 0.4)",
    borderColor: "1px solid #369EFF",
    starColor: "rgba(84, 137, 214, 0.56)",
    headerColor: "#369EFF",
    lightColorHeader: "#D8ECF8",
  };

  const metalTheme = {
    backgroundColor: "#EFEEEC",
    textBackground: "rgba(192,192,192, 0.4)",
    borderColor: "1px solid #a9a9a9",
    starColor: "rgba(255, 255, 255, 0.8)",
    headerColor: "#d3d3d3",
    lightColorHeader: "#f5f5f5",
  };
const Cards = () => {
  return (
    <div className="cards-container">
      <div className="top-cards">
        <GradientCard
          title="The Fourth Card"
          label="Don't Miss It!"
          onClick={() => console.log("Card clicked")}
          theme={greenishTheme}
        />
        <GradientCard
          title="The Fourth Card"
          label="Don't Miss It!"
          onClick={() => console.log("Card clicked")}
          theme={pinkishTheme}
        />
      </div>
      <div className="bottom-cards">
        <GradientCard
          title="The Fourth Card"
          label="Don't Miss It!"
          onClick={() => console.log("Card clicked")}
          theme={bluishTheme}
        />
        <GradientCard
          title="The Fourth Card"
          label="Don't Miss It!"
          onClick={() => console.log("Card clicked")}
          theme={metalTheme}
        />
      </div>
    </div>
  );
};

export default Cards;
