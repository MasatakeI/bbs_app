// /src/test/redux/features/channels/channelsThunks.js

import { describe, test, expect, vi, beforeEach } from "vitest";

import {
  addChannelAsync,
  fetchChannelsAsync,
  deleteChannelAsync,
} from "@/redux/features/channels/channelsThunks";

import { showSnackbar } from "@/redux/features/snackbar/snackbarSlice";

import {
  addChannel,
  deleteChannel,
  fetchChannels,
} from "@/models/channels/ChannelsModel";
import {
  mockChannels,
  newChannel,
} from "@/test/models/__fixtures__/firestoreChannelData";

vi.mock("@/models/channels/ChannelsModel", () => ({
  addChannel: vi.fn(),
  fetchChannels: vi.fn(),
  deleteChannel: vi.fn(),
}));

const dispatch = vi.fn();
const getState = vi.fn();

//ヘルパー

const mockSuccess = (fn, value) => fn.mockResolvedValue(value);

const callThunk = async (thunk, params) =>
  thunk(params)(dispatch, getState, undefined);

const SUCCESS_CASES = [
  {
    title: "addChannelAsync",
    fn: addChannel,
    arg: { name: newChannel.name },
    thunk: addChannelAsync,
    params: { name: newChannel.name },
    expected: newChannel,
    snackbarMessage: `${newChannel.name}を追加しました`,
  },
  {
    title: "fetchChannelsAsync",
    fn: fetchChannels,
    thunk: fetchChannelsAsync,
    expected: mockChannels,
    snackbarMessage: null,
  },
  {
    title: "deleteChannelAsync",
    fn: deleteChannel,
    arg: mockChannels[0].id,
    thunk: deleteChannelAsync,
    params: { id: mockChannels[0].id },
    expected: mockChannels[0],
    snackbarMessage: `${mockChannels[0].name}を削除しました`,
  },
];

describe("channelsThunks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test.each(SUCCESS_CASES)(
    "$title",
    async ({ fn, arg, thunk, params, expected, snackbarMessage }) => {
      mockSuccess(fn, expected);

      const result = await callThunk(thunk, params);
      expect(result.payload).toEqual(expected);

      if (arg === undefined) {
        expect(fn).toHaveBeenCalled();
      } else {
        expect(fn).toHaveBeenCalledWith(arg);
      }

      if (snackbarMessage) {
        expect(dispatch).toHaveBeenCalledWith(showSnackbar(snackbarMessage));
      } else {
        expect(dispatch).not.toHaveBeenCalledWith(
          showSnackbar(expect.anything()),
        );
      }
    },
  );
});
