import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import {
  selectAllChannels,
  selectChannelsIsDeleting,
  selectChannelsIsLoading,
  selectChannelsLastDeletedId,
} from "@/redux/features/channels/channelsSelector";

import { clearMessagesState } from "@/redux/features/messages/messagesSlice";

import { showSnackbar } from "@/redux/features/snackbar/snackbarSlice";

import { fetchMessagesAsync } from "@/redux/features/messages/messagesThunks";

export const useMainPage = () => {
  const { channelId } = useParams();
  const dispatch = useDispatch();
  const isChannelsLoading = useSelector(selectChannelsIsLoading);
  const isDeleting = useSelector(selectChannelsIsDeleting);
  const lastDeletedId = useSelector(selectChannelsLastDeletedId);

  const channels = useSelector(selectAllChannels);

  // 1. 判定用の変数をトップレベルで一元管理
  // loading中やデータが無い間は常にfalseまたはnullとみなす
  const isExist =
    channels.length > 0 && channels.some((c) => c.id === channelId);
  const isReady = !isChannelsLoading && channels.length > 0;

  // メッセージ取得
  useEffect(() => {
    if (isReady && isExist) {
      dispatch(fetchMessagesAsync({ channelId }));
    }
    return () => dispatch(clearMessagesState());
  }, [dispatch, channelId, isExist, isReady]);

  // Snackbar通知
  useEffect(() => {
    if (isReady && !isExist && !isDeleting && channelId !== lastDeletedId) {
      dispatch(
        showSnackbar("チャンネルが存在しません。generalに移動しました。"),
      );
    }
  }, [isReady, isExist, dispatch, isDeleting]);

  let redirectTo = null;

  // ガード（Redirect）
  if (!isExist && isReady) {
    const generalChannel =
      channels.find((c) => c.name === "general") || channels[0];
    redirectTo = `/channels/${generalChannel.id}`;
  }

  return {
    channelId,
    isChannelsLoading,
    redirectTo,
    isExist,
  };
};
