import React from "react";
import "./MainPage.css";

import MessagesList from "@/components/widgets/MessagesList/MessagesList";
import MessageTextBox from "@/components/widgets/TextBox/MessageTextBox";

import { Navigate } from "react-router";
import { useMainPage } from "./useMainpage";

const MainPage = () => {
  const { channelId, isChannelsLoading, redirectTo } = useMainPage();

  // 早期リターン（Loading）
  if (isChannelsLoading) return;

  // ガード（Redirect）
  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }
  return (
    <div className="main">
      <MessageTextBox channelId={channelId} />
      <div className="divider"></div>
      <MessagesList channelId={channelId} />
    </div>
  );
};

export default MainPage;
