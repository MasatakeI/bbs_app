export const selectChannelsCanPost = (state) => state.channels.canPost;

export const selectChannelsIsLoading = (state) => state.channels.isLoading;
export const selectAllChannels = (state) => state.channels.channels;
export const selectChannelsError = (state) => state.channels.error;
export const selectChannelsIsDeleting = (state) => state.channels.isDeleting;
export const selectChannelsLastDeletedId = (state) =>
  state.channels.lastDeletedId;
