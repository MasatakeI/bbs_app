// src/redux/features/messages/messagesSlice.js

import {
  addMessageAsync,
  fetchMessagesAsync,
  deleteMessageAsync,
} from "./messagesThunks";

import { createSlice, isRejectedWithValue } from "@reduxjs/toolkit";

export const messagesInitialState = {
  canPost: true,
  isLoading: false,
  messages: [],
  error: null,
  isDeleting: false,
};

const messsagesSlice = createSlice({
  name: "messages",
  initialState: messagesInitialState,
  reducers: {
    clearMessagesState: (state) => messagesInitialState,
  },

  extraReducers: (builder) => {
    builder
      //addMessageAsync
      .addCase(addMessageAsync.pending, (state, action) => {
        state.canPost = false;
      })
      .addCase(addMessageAsync.fulfilled, (state, action) => {
        state.canPost = true;
        state.messages.unshift(action.payload);
        state.error = null;
      })

      //fetchMessagesAsync
      .addCase(fetchMessagesAsync.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchMessagesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
        state.error = null;
      })

      //deleteMessageAsync

      .addCase(deleteMessageAsync.pending, (state, action) => {
        state.isDeleting = true;
      })
      .addCase(deleteMessageAsync.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.messages = state.messages.filter(
          (message) => message.id !== action.payload.id,
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

export const { clearMessagesState } = messsagesSlice.actions;

export default messsagesSlice.reducer;
