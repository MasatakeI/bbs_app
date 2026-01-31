import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = () => {
  return (
    <div className="loader-container" role="progressbar" aria-label="loading">
      <div className="loader"></div>
    </div>
  );
};
export default LoadingSpinner;
