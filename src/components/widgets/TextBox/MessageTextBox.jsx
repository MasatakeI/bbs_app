// src/components/widgets/TextBox/MessageTextBox.jsx

import React, { useState } from "react";
import "./MessageTextBox.css";

import BaseTextBox from "./BaseTextBox";

import { useDispatch, useSelector } from "react-redux";

import { addMessageAsync } from "@/redux/features/messages/messagesThunks";
import { selectMessagesCanPost } from "@/redux/features/messages/messagesSelector";

const MessageTextBox = ({ channelId }) => {
  const dispatch = useDispatch();
  const canPost = useSelector(selectMessagesCanPost);
  const [body, setBody] = useState("");

  const post = async () => {
    await dispatch(addMessageAsync({ body, channelId })).unwrap();
    setBody("");
  };

  return (
    <BaseTextBox
      value={body}
      onChange={(e) => setBody(e.target.value)}
      onSubmit={post}
      placeholder={"ここに入力"}
      buttonLabel={"投稿"}
      canSubmit={canPost}
      inputClassName="message-input"
      buttonClassName="message-text-button"
    />
  );
};

export default MessageTextBox;
