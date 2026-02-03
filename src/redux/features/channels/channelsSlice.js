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
  lastDeletedId: null,
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
        state.channels.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
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
        state.lastDeletedId = action.meta.arg.id;
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
        state.lastDeletedId = null;
      });
  },
});

export default channelsSlice.reducer;
