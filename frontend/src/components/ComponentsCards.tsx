import React, { useEffect, useState, useMemo } from "react";
import "../styles/componentsCards.scss";

interface ComponentItem {
  id: number;
  name: string;
  label: string;
  image: string;
  // Add additional properties as needed
}

type RowType = "two-first-wide" | "three-equal" | "two-second-wide" | "single";

interface Row {
  type: RowType;
  items: ComponentItem[];
}

const ComponentsCards: React.FC = () => {
  const [componentsData, setComponentsData] = useState<ComponentItem[]>([]);

  // Simulate fetching data from your backend
  useEffect(() => {
    const dummyComponents: ComponentItem[] = [
      { id: 1, name: "Component A", label: "hi", image: "" },
      { id: 2, name: "Component B", label: "hi", image: "" },
      { id: 3, name: "Component C", label: "hi", image: "" },
      { id: 4, name: "Component D", label: "hi", image: "" },
      { id: 5, name: "Component E", label: "hi", image: "" },
      { id: 6, name: "Component F", label: "hi", image: "" },
      { id: 7, name: "Component G", label: "hi", image: "" },
      { id: 8, name: "Component H", label: "hi", image: "" },
      { id: 9, name: "Component I", label: "hi", image: "" },
      { id: 10, name: "Component J", label: "hi", image: "" },
      // Add more items as needed
    ];
    setComponentsData(dummyComponents);
  }, []);

  // Group components into rows following the cycle: 2, 3, 2, then repeat
  const rows: Row[] = useMemo(() => {
    const result: Row[] = [];
    let i = 0;
    const patterns: RowType[] = [
      "two-first-wide",
      "three-equal",
      "two-second-wide",
    ];
    let cycleIndex = 0;

    while (i < componentsData.length) {
      // Determine how many items are needed for the current row type
      const neededItems = patterns[cycleIndex] === "three-equal" ? 3 : 2;
      if (i + neededItems > componentsData.length) {
        // If there aren't enough items left, group the remaining items in a single row
        result.push({ type: "single", items: componentsData.slice(i) });
        break;
      }
      result.push({
        type: patterns[cycleIndex],
        items: componentsData.slice(i, i + neededItems),
      });
      i += neededItems;
      cycleIndex = (cycleIndex + 1) % patterns.length;
    }
    return result;
  }, [componentsData]);

  return (
    <section className="components-page">
      <h1 className="second-header">UI Gallery</h1>
      {rows.map((row, index) => {
        // Assign a CSS class based on the row type
        let rowClass = "";
        if (row.type === "two-first-wide") {
          rowClass = "row-two-first";
        } else if (row.type === "three-equal") {
          rowClass = "row-three";
        } else if (row.type === "two-second-wide") {
          rowClass = "row-two-second";
        } else if (row.type === "single") {
          rowClass = "row-single";
        }
        return (
          <div key={index} className={`row ${rowClass}`}>
            {row.items.map((item) => (
              <div key={item.id} className="component-card">
                <div className="component-card__content">
                  <div className="component-card__header">
                    <div className="component-card__category">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 17L17 7M17 7H7M17 7V17"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Recently
                    </div>
                  </div>
                  <div className="component-card__bottom">
                    {item.label && (
                      <div className="component-card__label">{item.name}</div>
                    )}
                    <h2 className="component-card__title">{item.name}</h2>
                    {item.image && (
                      <div className="component-card__image">
                        <img src={item.image} alt={item.name} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </section>
  );
};

export default ComponentsCards;
