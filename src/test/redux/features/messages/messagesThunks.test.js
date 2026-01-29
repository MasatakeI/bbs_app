// src/test/redux/features/messages/messagesThunks.test.js

import { describe, test, expect, vi, beforeEach } from "vitest";

import {
  addMessageAsync,
  fetchMessagesAsync,
  deleteMessageAsync,
} from "@/redux/features/messages/messagesThunks";

import {
  addMessage,
  fetchMessages,
  deleteMessage,
} from "@/models/messages/MessagesModel";
import {
  mockMessages,
  newMessage,
} from "@/test/models/__fixtures__/firestoreMessageData";
import { showSnackbar } from "@/redux/features/snackbar/snackbarSlice";

vi.mock("@/models/messages/MessagesModel", () => ({
  addMessage: vi.fn(),
  deleteMessage: vi.fn(),
  fetchMessages: vi.fn(),
}));

//ヘルパー

const mockSuccess = (fn, value) => fn.mockResolvedValue(value);

const dispatch = vi.fn();
const getState = vi.fn();

const callThunk = async (thunk, params) =>
  thunk(params)(dispatch, getState, undefined);

const channelId = "Channel1";

const SUCCESS_CASES = [
  {
    title: "addMessageAsync",
    fn: addMessage,
    arg: { body: newMessage.body, channelId },
    thunk: addMessageAsync,
    params: { body: newMessage.body, channelId },
    expected: newMessage,
    snackbarMessage: `${newMessage.body}を追加しました`,
  },
  {
    title: "fetchMessagesAsync",
    fn: fetchMessages,
    arg: channelId,
    thunk: fetchMessagesAsync,
    params: { channelId },
    expected: mockMessages,
  },
  {
    title: "deleteMessageAsync",
    fn: deleteMessage,
    arg: [mockMessages[0].id, channelId],
    thunk: deleteMessageAsync,
    params: { id: mockMessages[0].id, channelId },
    expected: mockMessages[0],
    snackbarMessage: `${mockMessages[0].body}を削除しました`,
  },
];

describe("messagesThunks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test.each(SUCCESS_CASES)(
    "$title",
    async ({ fn, thunk, expected, params, arg, snackbarMessage }) => {
      mockSuccess(fn, expected);

      const result = await callThunk(thunk, params);

      expect(result.payload).toEqual(expected);

      if (Array.isArray(arg)) {
        expect(fn).toHaveBeenCalledWith(...arg);
      } else {
        expect(fn).toHaveBeenCalled();
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
