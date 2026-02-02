import React from "react";
import "./BaseTextBox.css";

import Button from "@/components/common/Button/Button";

const BaseTextBox = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  buttonLabel,
  canSubmit,
  inputClassName,
  buttonClassName,
}) => {
  return (
    <div className="textbox">
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        role="textbox"
        aria-label="textbox"
        className={`textbox-input ${inputClassName}`}
      ></textarea>

      <div className={`textbox-button ${buttonClassName}`}>
        <Button onClickHandler={onSubmit} clickable={canSubmit}>
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
};

export default BaseTextBox;
