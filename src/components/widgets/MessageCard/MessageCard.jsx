// src/components/widgets/TextBox/TextBox.jsx

import React from "react";
import "./MessageCard.css";

const MessageCard = ({ body, date, id, onDelete }) => {
  return (
    <div className="message-card">
      <div className="message-header">
        <div className="message-date">{date}</div>
        <button className="message-button delete" onClick={() => onDelete(id)}>
          削除
        </button>
      </div>

      <p className="message-body">{body}</p>
    </div>
  );
};

export default MessageCard;
