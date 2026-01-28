// src/test/models/MessagesModel.test.js

import { describe, test, expect, vi, beforeEach } from "vitest";

import {
  _createMessage,
  addMessage,
  fetchMessages,
  deleteMessage,
} from "@/models/MessagesModel";

import { newMessage } from "./__fixtures__/firestoreMessageData";

import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { MessagesError } from "@/models/errors/messages/MessagesError";
import { MESSAGES_MODEL_ERROR_CODE } from "@/models/errors/messages/messagesErrorCode";

vi.mock("firebase/firestore", () => ({
  addDoc: vi.fn(),
  getDoc: vi.fn(),
  query: vi.fn(),
  getDocs: vi.fn(),
  orderBy: vi.fn(),
  doc: vi.fn(),
  deleteDoc: vi.fn(),
  serverTimestamp: vi.fn(),

  getFirestore: vi.fn(),
  collection: vi.fn(),
}));

const mockDocRef = { id: newMessage.id };

const mockSnapShot = {
  exists: () => true,
  data: () => ({
    ...newMessage,
  }),
};

const mockQuery = {};

// ヘルパー関数
const expectMessage = (message) => {
  return {
    id: message.id,
    body: message.body,
    date: message.formattedDate,
  };
};

const mockGetDocSuccess = () => {
  getDoc.mockResolvedValue(mockSnapShot);
};

const mockAddMessageSuccess = () => {
  addDoc.mockResolvedValue(mockDocRef);
  mockGetDocSuccess();
};

describe("MessagesModel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("_createMessage", () => {
    test("正常系:firestoreデータを整形し,フォーマットされたMessageオブジェクトを返す", () => {
      const result = _createMessage(newMessage.id, newMessage);
      expect(result).toEqual(expectMessage(newMessage));
    });

    test("異常系:壊れたデータの場合MessageErrorをスローする", () => {
      expect(() =>
        _createMessage(newMessage.id, { ...newMessage, body: 1 }),
      ).toThrow(
        new MessagesError({ code: MESSAGES_MODEL_ERROR_CODE.INVALID_DATA }),
      );
    });
  });

  describe("addMessage", () => {
    test("正常系:messageを追加し,追加したmessageを返す", async () => {
      mockAddMessageSuccess();

      const result = await addMessage({ body: newMessage.body });

      expect(result).toEqual(expectMessage(newMessage));
    });

    describe("異常系", () => {
      test.each([
        {
          title: "追加後データが存在しない",
          setup: () => {
            addDoc.mockResolvedValue(mockDocRef);
            getDoc.mockResolvedValue({ exists: () => false });
          },
          body: mockSnapShot.data().body,
          code: MESSAGES_MODEL_ERROR_CODE.UNKNOWN,
        },
        {
          title: "bodyが空",
          setup: () => {},
          body: "  ",
          code: MESSAGES_MODEL_ERROR_CODE.VALIDATION,
        },
      ])(`$title `, async ({ body, setup, code }) => {
        setup?.();
        await expect(addMessage({ body })).rejects.toThrow(
          new MessagesError({
            code,
          }),
        );
      });
    });
  });

  describe("fetchMessages", () => {
    test("正常系:messages配列を取得し返す", async () => {
      query.mockReturnValue(mockQuery);
      getDocs.mockResolvedValue({
        docs: [{ id: mockSnapShot.data().id, data: () => mockSnapShot.data() }],
      });

      const result = await fetchMessages();
      expect(result).toEqual([expectMessage(mockSnapShot.data())]);
    });

    test("異常系:データがない場合,空配列を返す", async () => {
      query.mockReturnValue(mockQuery);
      getDocs.mockResolvedValue({
        docs: [],
      });

      const result = await fetchMessages();
      expect(result).toEqual([]);
    });
  });

  describe("deleteMessage", () => {
    test("正常系:対象messageを削除し,削除前のmessageを返す", async () => {
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue(mockSnapShot);
      deleteDoc.mockResolvedValue();

      const result = await deleteMessage(mockSnapShot.data().id);
      expect(result).toEqual(expectMessage(mockSnapShot.data()));

      expect(doc).toHaveBeenCalledTimes(1);
      expect(getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });

    test("異常系:削除するデータがない場合,MessagesErrorをスローする", async () => {
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue({ exists: () => false });
      deleteDoc.mockResolvedValue();

      await expect(deleteMessage(1)).rejects.toThrow(
        new MessagesError({ code: MESSAGES_MODEL_ERROR_CODE.NOT_FOUND }),
      );
    });
  });
});
