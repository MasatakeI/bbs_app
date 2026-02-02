// src/components/widgets/TextBox/TextBox.jsx

import React from "react";
import "./MessageCard.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const MessageCard = ({ body, date, id, onDelete }) => {
  return (
    <div className="message-card">
      <div className="message-header">
        <div className="message-date">{date}</div>
        <button className="message-button delete" onClick={() => onDelete(id)}>
          <FontAwesomeIcon icon={faTrash} role="img" aria-label="icon" />
        </button>
      </div>

      <p className="message-body">{body}</p>
    </div>
  );
};

export default MessageCard;
