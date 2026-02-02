// src/components/common/Button/Button.jsx

import React from "react";
import "./Button.css";

const Button = ({
  children,
  onClickHandler,
  variant = "primary",
  clickable = true,
}) => {
  const baseClass = "button";
  const variantClass = `button-${variant}`;

  const classes = [baseClass, variantClass];

  const buttonClass = classes.filter(Boolean).join(" ");

  return (
    <button
      className={buttonClass}
      onClick={onClickHandler}
      disabled={!clickable}
    >
      {children}
    </button>
  );
};

export default Button;
