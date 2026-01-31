// src/components/widgets/TextBox/MessageTextBox.jsx

import React, { useState } from "react";

import BaseTextBox from "./BaseTextBox";

import { useDispatch, useSelector } from "react-redux";

import { addChannelAsync } from "@/redux/features/channels/channelsThunks";
import { selectChannelsCanPost } from "@/redux/features/channels/channelsSelector";

const ChannelTextBox = () => {
  const dispatch = useDispatch();
  const canPost = useSelector(selectChannelsCanPost);
  const [name, setName] = useState("");

  const post = async () => {
    await dispatch(addChannelAsync({ name })).unwrap();
    setName("");
  };

  return (
    <BaseTextBox
      value={name}
      onChange={(e) => setName(e.target.value)}
      onSubmit={post}
      placeholder={"ここに入力"}
      buttonLabel={"追加"}
      canSubmit={canPost}
    />
  );
};

export default ChannelTextBox;
