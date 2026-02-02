// src/test/models/ChannelsModel.test.js

import { describe, test, expect, vi, beforeEach } from "vitest";

import {
  _createChannel,
  addChannel,
  fetchChannels,
  deleteChannel,
} from "@/models/channels/ChannelsModel";

import { ChannelsError } from "@/models/errors/channels/ChannelsError";
import { CHANNELS_MODEL_ERROR_CODE } from "@/models/errors/channels/channelsErrorCode";
import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  writeBatch,
} from "firebase/firestore";

vi.mock("firebase/firestore", () => ({
  addDoc: vi.fn(),
  getDoc: vi.fn(),
  query: vi.fn(),
  getDocs: vi.fn(),
  orderBy: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
  writeBatch: vi.fn(),
  collection: vi.fn(),
}));

vi.mock("@/firebase/index", () => ({
  channelsCollectionRef: { firestore: {} },
  getChannelMessages: vi.fn(),
}));

const mockQuery = {};

//ヘルパー関数

// const mockGetDocSuccess = () => {
//   getDoc.mockResolvedValue(mockSnapShot);
// };

// const mockAddChannelSuccess = () => {
//   addDoc.mockResolvedValue(mockDocRef);
//   mockGetDocSuccess();
// };

describe("ChannelsModel", () => {
  const mockId = "test-channel-id";
  const mockData = { name: "test Channel" };
  const mockDocRef = { id: mockId, firestore: {} };

  // const mockSnapShot = {
  //   exists: () => true,
  //   data: () => ({
  //     id: mockId,
  //     data: () => mockData,
  //   }),
  // };

  const mockBatch = {
    delete: vi.fn().mockReturnThis(),
    commit: vi.fn().mockResolvedValue(),
  };
  beforeEach(() => {
    vi.clearAllMocks();
    writeBatch.mockReturnValue(mockBatch);
  });

  describe("_createChannel", () => {
    test("正常系:firestoreのデータを整形し,フォーマットされたChannelオブジェクトを返す", () => {
      const result = _createChannel(mockId, mockData);
      expect(result).toEqual({ id: mockId, name: mockData.name });
    });

    test("異常系:壊れたデータの場合,ChannelsErrorをスローする", () => {
      expect(() => _createChannel(mockId, { name: 1 })).toThrow(
        new ChannelsError({
          code: CHANNELS_MODEL_ERROR_CODE.INVALID_DATA,
          message: "無効な値です",
        }),
      );
    });
  });

  describe("addChannel", () => {
    test("正常系:新しいチャンネルを追加し,追加したチャンネルを返す", async () => {
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue({ exists: () => false });
      setDoc.mockResolvedValue();

      const result = await addChannel({
        id: mockId,
        name: mockData.name,
      });
      expect(result).toEqual({ id: mockId, name: mockData.name });

      expect(setDoc).toHaveBeenCalledWith(mockDocRef, { name: mockData.name });
    });

    describe("異常系:", () => {
      test.each([
        {
          title: "IDまたはnameが空(空白を含む)の時",
          // setup: () => {},
          params: { id: " ", name: " " },
          code: CHANNELS_MODEL_ERROR_CODE.VALIDATION,
          message: "IDとチャンネル名をどちらも入力してください",
        },
        {
          title: "既にIDが存在する場合",
          setup: () => {
            doc.mockReturnValue(mockDocRef);
            getDoc.mockResolvedValue({ exists: () => true });
          },
          params: { id: mockId, name: "自己紹介" },
          code: CHANNELS_MODEL_ERROR_CODE.ALREADY_EXISTS,
          message: "指定されたIDのチャンネルは既に存在します",
        },
        {
          title: "チャンネルIDが無効な型の場合",
          params: { id: "ああああ", name: "TestChannel" },
          code: CHANNELS_MODEL_ERROR_CODE.VALIDATION,
          message:
            "チャンネルIDは半角英数字、ハイフン、アンダースコアのみ使用可能です",
        },
      ])("$title", async ({ setup, params, code, message }) => {
        setup?.();
        await expect(addChannel(params)).rejects.toThrow(
          new ChannelsError({
            code,
            message,
          }),
        );
      });
    });
  });

  describe("fetchChannels", () => {
    test("正常系:firestoreからchannelsを取得する", async () => {
      query.mockReturnValue(mockQuery);
      getDocs.mockResolvedValue({
        docs: [{ id: mockId, data: () => mockData }],
      });

      const result = await fetchChannels();

      expect(result).toEqual([{ id: mockId, name: mockData.name }]);

      expect(query).toHaveBeenCalledTimes(1);
    });

    test("異常系:データがない場合は空配列を返す", async () => {
      query.mockReturnValue(mockQuery);
      getDocs.mockResolvedValue({
        docs: [],
      });

      const result = await fetchChannels();

      expect(result).toEqual([]);
    });
  });

  describe("deleteChannel", () => {
    test("正常系:指定したChannelを削除し削除前のChannelを返す", async () => {
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue({
        exists: () => true,
        id: mockId,
        data: () => mockData,
      });

      const mockMessageDocs = [{ ref: "msg1" }, { ref: "msg2" }];

      getDocs.mockResolvedValue({
        forEach: (callback) => mockMessageDocs.forEach(callback),
      });

      const result = await deleteChannel(mockId);

      expect(result).toEqual({ id: mockId, name: mockData.name });

      expect(mockBatch.delete).toHaveBeenCalledTimes(
        mockMessageDocs.length + 1,
      );
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    test("異常系:削除対象のデータがない場合NOT_FOUNDをスローする", async () => {
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue({ exists: () => false });

      await expect(deleteChannel(mockId)).rejects.toThrow(
        new ChannelsError({
          code: CHANNELS_MODEL_ERROR_CODE.NOT_FOUND,
        }),
      );
    });
  });
});
