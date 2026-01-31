// src/components/common/Button/Button.jsx

import React from "react";
import "./Button.css";

const Button = ({
  children,
  onClickHandler,
  variant = "primary",
  clickable = true,
  isActive,
}) => {
  const baseClass = "button";
  const variantClass = `button-${variant}`;
  const activeClass = isActive ? "button-active" : "";

  const classes = [baseClass, variantClass, activeClass];

  const buttonClass = classes.filter(Boolean).join(" ");

  return (
    <button
      className={buttonClass}
      onClick={onClickHandler}
      disabled={!clickable}
      aria-pressed={isActive}
      data-active={isActive}
    >
      {children}
    </button>
  );
};

export default Button;
