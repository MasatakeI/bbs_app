// /src/redux/features/channels/channelsThunks.js

import {
  addChannel,
  deleteChannel,
  fetchChannels,
} from "@/models/channels/ChannelsModel";
import { createModelThunk } from "../utils/createModelThunk";

import { showSnackbar } from "../snackbar/snackbarSlice";

export const addChannelAsync = createModelThunk(
  "channels/addChannel",
  async ({ id, name }, thunkApi) => {
    const channel = await addChannel({ id, name });
    thunkApi.dispatch(showSnackbar(`${channel.name}を追加しました`));
    return channel;
  },
);

export const fetchChannelsAsync = createModelThunk(
  "channels/fetchChannels",
  async () => {
    const channels = await fetchChannels();
    return channels;
  },
);

export const deleteChannelAsync = createModelThunk(
  "channels/deleteChannel",
  async ({ id }, thunkApi) => {
    const channel = await deleteChannel(id);
    thunkApi.dispatch(showSnackbar(`${channel.name}を削除しました`));
    return channel;
  },
);
