// src/components/widgets/TextBox/MessageTextBox.jsx

import React from "react";
import "./ChannelForm.css";

import Button from "@/components/common/Button/Button";

import { useChannelForm } from "./useChannelForm";

const ChannelForm = ({ isOpen, onClose }) => {
  const { form, setForm, handleSubmit, canPost } = useChannelForm(onClose);

  if (!isOpen) return null;
  return (
    <div className="channel-form">
      <div>
        <div className="channel-form-container">
          <h3 className="channel-form-title">新しいチャンネル</h3>
          <div className="channel-form-fields">
            <input
              type="text"
              className="channel-input"
              placeholder="ID(半角英数)"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
            />

            <input
              type="text"
              className="channel-input"
              placeholder="チャンネル名"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <div className="channel-form-button-container">
              <Button
                onClickHandler={handleSubmit}
                clickable={canPost && form.id && form.name}
              >
                作成
              </Button>
              <Button
                onClickHandler={() => {
                  onClose();
                  setForm({ id: "", name: "" });
                }}
                variant="tertiary"
              >
                キャンセル
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelForm;
