import {
  addMessage,
  fetchMessages,
  deleteMessage,
} from "@/models/messages/MessagesModel";

import { createModelThunk } from "../utils/createModelThunk";
import { showSnackbar } from "../snackbar/snackbarSlice";

export const addMessageAsync = createModelThunk(
  "messages/addMessage",
  async ({ body, channelId }, thunkApi) => {
    const message = await addMessage({ body, channelId });
    thunkApi.dispatch(showSnackbar(`${message.body}を追加しました`));
    return message;
  },
);

export const fetchMessagesAsync = createModelThunk(
  "messages/fetchMessages",
  async ({ channelId }) => {
    const messages = await fetchMessages(channelId);
    return messages;
  },
);

export const deleteMessageAsync = createModelThunk(
  "messages/deleteMessage",
  async ({ id, channelId }, thunkApi) => {
    const message = await deleteMessage(id, channelId);
    thunkApi.dispatch(showSnackbar(`${message.body}を削除しました`));
    return message;
  },
);
