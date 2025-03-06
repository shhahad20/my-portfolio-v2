import React from "react";
import "../styles/loadingSpinner.scss";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 20,
  color = "#202020",
}) => {
  const borderWidth = size / 8;
  return (
    <div className="loading-spinner-container">
      <div
        className="loading-spinner"
        style={{
          width: size,
          height: size,
          border: `${borderWidth}px solid rgba(0, 0, 0, 0.1)`,
          borderTop: `${borderWidth}px solid ${color}`,
        }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
