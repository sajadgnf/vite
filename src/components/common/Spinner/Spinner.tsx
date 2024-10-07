import React from "react";
import "./Spinner.scss";

interface SpinnerProps {
  size?: number;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 24, className = "" }) => {
  return (
    <div
      className={`spinner ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
      }}
    ></div>
  );
};

export default Spinner;
