// src/test/redux/features/channels/channelsSlice.test.js

import { describe, test, expect } from "vitest";

import channelsSlice, {
  channelsInitialState,
} from "@/redux/features/channels/channelsSlice";
import {
  addChannelAsync,
  deleteChannelAsync,
  fetchChannelsAsync,
} from "@/redux/features/channels/channelsThunks";
import {
  mockChannels,
  newChannel,
} from "@/test/models/__fixtures__/firestoreChannelData";
import { CHANNELS_MODEL_ERROR_CODE } from "@/models/errors/channels/channelsErrorCode";

//ヘルパー関数
const applyPending = (slice, thunk, prev = channelsInitialState) =>
  slice(prev, thunk.pending(prev));

const applyFulfilled = (slice, thunk, payload, prev) =>
  slice(prev, thunk.fulfilled(payload));

const applyRejected = (slice, thunk, error, prev) =>
  slice(prev, thunk.rejected(null, "requestId", undefined, error));

describe("channelsSlice", () => {
  test("初期stateの確認", () => {
    expect(channelsInitialState).toEqual({
      canPost: true,
      isLoading: false,
      channels: [],
      error: null,

      isDeleting: false,
    });
  });
  describe("正常系:pendingからfulfilledに遷移し状態を更新する", () => {
    test("addChannelAsync:isLoadingをfalseに戻し,channelsにpayloadを追加する", async () => {
      const pending = applyPending(channelsSlice, addChannelAsync);
      expect(pending).toEqual({ ...channelsInitialState, canPost: false });

      const fulfilled = applyFulfilled(
        channelsSlice,
        addChannelAsync,
        newChannel,
      );
      expect(fulfilled).toEqual({
        ...pending,
        canPost: true,

        channels: [newChannel],
        error: null,
      });
    });

    test("fetchChannelsAsync:isLoadingをfalseに戻し,channelsにpayloadを取得する", async () => {
      const pending = applyPending(channelsSlice, fetchChannelsAsync);
      expect(pending).toEqual({ ...channelsInitialState, isLoading: true });

      const fulfilled = applyFulfilled(
        channelsSlice,
        fetchChannelsAsync,
        mockChannels,
      );
      expect(fulfilled).toEqual({
        ...pending,
        isLoading: false,
        channels: mockChannels,
        error: null,
      });
    });
    test("deleteChannelAsync:isDeletingをfalseに戻し,対象のchannelを削除する", async () => {
      const stateWithChannels = {
        ...channelsInitialState,
        channels: mockChannels,
      };
      const pending = applyPending(
        channelsSlice,
        deleteChannelAsync,
        stateWithChannels,
      );
      expect(pending).toEqual({
        ...stateWithChannels,
        isDeleting: true,
        error: null,
      });

      const targetChannel = mockChannels.find((channel) => channel.id === 1);

      const fulfilled = applyFulfilled(
        channelsSlice,
        deleteChannelAsync,
        targetChannel,
        pending,
      );

      const expectChannels = mockChannels.filter(
        (c) => c.id !== targetChannel.id,
      );
      expect(fulfilled).toEqual({
        ...pending,
        isDeleting: false,
        channels: expectChannels,
      });
    });
  });

  describe("rejected共通処理", () => {
    test.each([
      { title: "addChannelAsync", thunk: addChannelAsync },
      { title: "fetchChannelsAsync", thunk: fetchChannelsAsync },
      { title: "deleteChannelAsync", thunk: deleteChannelAsync },
    ])(`$title`, async ({ thunk }) => {
      const pending = applyPending(channelsSlice, thunk);

      const error = {
        code: CHANNELS_MODEL_ERROR_CODE.NETWORK,
        message: "失敗",
      };

      const rejected = applyRejected(channelsSlice, thunk, error, pending);

      expect(rejected).toMatchObject({
        isLoading: false,
        error,
        isDeleting: false,
      });
    });
  });
});
