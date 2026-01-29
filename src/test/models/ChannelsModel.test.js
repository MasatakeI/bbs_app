// src/test/models/ChannelsModel.test.js

import { describe, test, expect, vi, beforeEach } from "vitest";

import {
  _createChannel,
  addChannel,
  fetchChannels,
  deleteChannel,
} from "@/models/channels/ChannelsModel";

import { newChannel } from "./__fixtures__/firestoreChannelData";
import { ChannelsError } from "@/models/errors/channels/ChannelsError";
import { CHANNELS_MODEL_ERROR_CODE } from "@/models/errors/channels/channelsErrorCode";
import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";

vi.mock("firebase/firestore", () => ({
  addDoc: vi.fn(),
  getDoc: vi.fn(),
  query: vi.fn(),
  getDocs: vi.fn(),
  orderBy: vi.fn(),
  doc: vi.fn(),
  deleteDoc: vi.fn(),

  getFirestore: vi.fn(),
  collection: vi.fn(),
}));

const mockDocRef = { id: newChannel.id };

const mockSnapShot = {
  exists: () => true,
  data: () => ({
    ...newChannel,
  }),
};

const mockQuery = {};

//ヘルパー関数

const mockGetDocSuccess = () => {
  getDoc.mockResolvedValue(mockSnapShot);
};

const mockAddChannelSuccess = () => {
  addDoc.mockResolvedValue(mockDocRef);
  mockGetDocSuccess();
};

describe("ChannelsModel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("_createChannel", () => {
    test("正常系:firestoreのデータを整形し,フォーマットされたChannelオブジェクトを返す", () => {
      const result = _createChannel(newChannel.id, newChannel);
      expect(result).toEqual(newChannel);
    });

    test("異常系:壊れたデータの場合,ChannelsErrorをスローする", () => {
      expect(() =>
        _createChannel(newChannel.id, { ...newChannel, name: 1 }),
      ).toThrow(
        new ChannelsError({ code: CHANNELS_MODEL_ERROR_CODE.INVALID_DATA }),
      );
    });
  });

  describe("addChannel", () => {
    test("正常系:新しいチャンネルを追加し,追加したチャンネルを返す", async () => {
      mockAddChannelSuccess();

      const result = await addChannel({ name: mockSnapShot.data().name });
      expect(result).toEqual(mockSnapShot.data());

      expect(getDoc).toHaveBeenCalledWith(mockDocRef);
    });

    describe("異常系:", () => {
      test.each([
        {
          title: "nameが空の時",
          setup: () => {},
          name: " ",
          code: CHANNELS_MODEL_ERROR_CODE.VALIDATION,
        },
        {
          title: "データが存在しない場合",
          setup: () => {
            addDoc.mockResolvedValue(mockDocRef);
            getDoc.mockResolvedValue({ exists: () => false });
          },
          name: "aa",
          code: CHANNELS_MODEL_ERROR_CODE.UNKNOWN,
        },
      ])("$title", async ({ setup, name, code }) => {
        setup?.();

        await expect(addChannel({ name })).rejects.toThrow(
          new ChannelsError({
            code,
          }),
        );
      });
    });
  });

  describe("fetchChannels", () => {
    test("正常系:firestoreからchannelsを取得する", async () => {
      query.mockReturnValue(mockQuery);
      getDocs.mockResolvedValue({
        docs: [{ id: mockSnapShot.data().id, data: () => mockSnapShot.data() }],
      });

      const result = await fetchChannels();

      expect(result).toEqual([mockSnapShot.data()]);

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
      getDoc.mockResolvedValue(mockSnapShot);
      deleteDoc.mockResolvedValue();

      const result = await deleteChannel(mockSnapShot.data().id);
      expect(result).toEqual(mockSnapShot.data());

      expect(doc).toHaveBeenCalledTimes(1);
      expect(getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });

    test("異常系:削除対象のデータがない場合ChannelErrorをスローする", async () => {
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue({ exists: () => false });
      deleteDoc.mockResolvedValue();

      await expect(deleteChannel(mockDocRef.id)).rejects.toThrow(
        new ChannelsError({
          code: CHANNELS_MODEL_ERROR_CODE.NOT_FOUND,
        }),
      );
    });
  });
});
