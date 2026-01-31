// src/test/redux/features/messages/messagesSlice.test.js

import { describe, test, expect } from "vitest";

import messagesSlice, {
  messagesInitialState,
} from "@/redux/features/messages/messagesSlice";

import {
  addMessageAsync,
  fetchMessagesAsync,
  deleteMessageAsync,
} from "@/redux/features/messages/messagesThunks";
import {
  mockMessages,
  newMessage,
} from "@/test/models/__fixtures__/firestoreMessageData";
import { MESSAGES_MODEL_ERROR_CODE } from "@/models/errors/messages/messagesErrorCode";

// ヘルパー
const applyPending = (slice, thunk, prev = messagesInitialState) =>
  slice(prev, thunk.pending(prev));
const applyFulfilled = (slice, thunk, payload, prev) =>
  slice(prev, thunk.fulfilled(payload));

const applyRejected = (slice, thunk, error, prev) =>
  slice(prev, thunk.rejected(null, "requestId", undefined, error));

describe("messagesSlice", () => {
  test("初期stateのテスト", () => {
    expect(messagesInitialState).toEqual({
      canPost: true,
      isLoading: false,
      messages: [],
      error: null,
      isDeleting: false,
    });
  });

  describe("正常系:pendingからfulfilledに遷移する", () => {
    describe("addMessageAsync", () => {
      test("canPostがtrueに戻り,messageを追加する", async () => {
        const pending = applyPending(messagesSlice, addMessageAsync);
        expect(pending).toEqual({
          ...messagesInitialState,
          canPost: false,
        });

        const fulfilled = applyFulfilled(
          messagesSlice,
          addMessageAsync,
          newMessage,
          pending,
        );
        expect(fulfilled).toEqual({
          ...pending,
          messages: [newMessage],
          canPost: true,
          error: null,
        });
      });
    });

    describe("fetchMessagesAsync", () => {
      test("isLoadingがfalseに戻り,messagesを取得する", async () => {
        const pending = applyPending(messagesSlice, fetchMessagesAsync);
        expect(pending).toEqual({
          ...messagesInitialState,
          isLoading: true,
        });

        const fulfilled = applyFulfilled(
          messagesSlice,
          fetchMessagesAsync,
          mockMessages,
          pending,
        );
        expect(fulfilled).toEqual({
          ...pending,
          messages: mockMessages,
          isLoading: false,
          error: null,
        });
      });
    });

    describe("deleteMessageAsync", () => {
      test("isDeletingがfalseに戻り,対象messageを削除する", async () => {
        const stateWithMessages = {
          ...messagesInitialState,
          messages: mockMessages,
        };
        const pending = applyPending(
          messagesSlice,
          deleteMessageAsync,
          stateWithMessages,
        );
        expect(pending).toEqual({
          ...stateWithMessages,
          isDeleting: true,
          error: null,
        });

        const targetMessage = mockMessages[0];
        const fulfilled = applyFulfilled(
          messagesSlice,
          deleteMessageAsync,
          targetMessage,
          stateWithMessages,
        );

        const expectMessages = mockMessages.filter(
          (m) => m.id !== targetMessage.id,
        );
        expect(fulfilled).toEqual({
          ...pending,
          messages: expectMessages,
          isDeleting: false,
        });
      });
    });
  });

  describe("rejected共通処理", () => {
    test.each([
      { title: "addMessageAsync", thunk: addMessageAsync },
      { title: "fetchMessagesAsync", thunk: fetchMessagesAsync },
      { title: "deleteMessageAsync", thunk: deleteMessageAsync },
    ])("$title", async ({ thunk }) => {
      const pending = applyPending(messagesSlice, thunk);

      const error = {
        code: MESSAGES_MODEL_ERROR_CODE.NETWORK,
        message: "エラー",
      };

      const rejected = applyRejected(messagesSlice, thunk, error, pending);

      expect(rejected).toEqual({
        ...pending,
        canPost: true,
        isLoading: false,
        error,
        isDeleting: false,
      });
    });
  });
});
