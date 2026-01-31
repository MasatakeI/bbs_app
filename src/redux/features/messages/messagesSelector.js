// import { createSelector } from "@reduxjs/toolkit";

export const selectMessagesCanPost = (state) => state.messages.canPost;
export const selectMessagesIsLoading = (state) => state.messages.isLoading;
export const selectAllMessages = (state) => state.messages.messages;
export const selectMessagesError = (state) => state.messages.error;
export const selectMessagesIsDeleting = (state) => state.messages.isDeleting;

// export const selectReversedMessages = createSelector(
//   [selectAllMessages],
//   (messages) => {
//     if (!messages) return [];
//     return [...messages].sort((a, b) => {
//       return b.createdAt - a.date.createdAt;
//     });
//   },
// );
