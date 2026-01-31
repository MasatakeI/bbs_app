import { createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import {
  addChannelAsync,
  fetchChannelsAsync,
  deleteChannelAsync,
} from "./channelsThunks";

export const channelsInitialState = {
  canPost: true,
  isLoading: false,
  channels: [],
  error: null,

  isDeleting: false,
};

const channelsSlice = createSlice({
  name: "channels",
  initialState: channelsInitialState,

  extraReducers: (builder) => {
    builder
      //addChannel
      .addCase(addChannelAsync.pending, (state, action) => {
        state.canPost = false;
      })
      .addCase(addChannelAsync.fulfilled, (state, action) => {
        state.canPost = true;
        state.channels.push(action.payload);
        state.error = null;
      })

      //fetchChannels
      .addCase(fetchChannelsAsync.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchChannelsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.channels = action.payload;
        state.error = null;
      })

      //deleteChannel

      .addCase(deleteChannelAsync.pending, (state, action) => {
        state.isDeleting = true;
      })
      .addCase(deleteChannelAsync.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.channels = state.channels.filter(
          (channel) => channel.id !== action.payload.id,
        );
        state.error = null;
      })

      //rejected共通処理
      .addMatcher(isRejectedWithValue, (state, action) => {
        state.canPost = true;
        state.isLoading = false;

        state.error = action.payload;
        state.isDeleting = false;
      });
  },
});

export default channelsSlice.reducer;
