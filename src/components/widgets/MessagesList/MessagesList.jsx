// src/components/widgets/TextBox/TextBox.jsx

import React, { useState } from "react";
import "./MessagesList.css";

import { useDispatch, useSelector } from "react-redux";
import {
  selectAllMessages,
  selectMessagesIsLoading,
} from "@/redux/features/messages/messagesSelector";
import { deleteMessageAsync } from "@/redux/features/messages/messagesThunks";

import MessageCard from "../MessageCard/MessageCard";
import Modal from "@/components/common/Modal/Modal";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";

const MessagesList = ({ channelId }) => {
  const dispatch = useDispatch();
  const messages = useSelector(selectAllMessages);
  const isLoading = useSelector(selectMessagesIsLoading);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [targetId, setTargetId] = useState(null);

  const handleDelete = () => {
    setModalOpen(false);
    dispatch(deleteMessageAsync({ id: targetId, channelId }));
  };

  const messagesContent = () => {
    if (isLoading) {
      return (
        <div className="message-spinner">
          <LoadingSpinner />
        </div>
      );
    }

    if (messages.length === 0) {
      return <p className="no-message">該当する メッセージ がありません</p>;
    }

    return (
      <>
        {messages.map((message) => {
          return (
            <MessageCard
              key={message.id}
              body={message.body}
              date={message.date}
              id={message.id}
              onDelete={() => {
                setTargetId(message.id);
                setModalOpen(true);
                setModalMessage(message.body);
              }}
            />
          );
        })}
      </>
    );
  };

  return (
    <div className="messages-list">
      {messagesContent()}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDelete}
        title={"削除しますか?"}
        message={modalMessage}
      />
    </div>
  );
};

export default MessagesList;
