import { describe, expect, test, vi, beforeEach } from "vitest";
import { useSideMenu } from "@/components/layout/SideMenu/useSideMenu";
import { act } from "@testing-library/react";
import { renderHookWithStore } from "@/test/utils/renderHookWithStore";

import channelsReducer, {
  channelsInitialState,
} from "@/redux/features/channels/channelsSlice";

import * as ChannelsThunks from "@/redux/features/channels/channelsThunks";

import { mockChannelViewData } from "../../__fixtures__/channelViewData";

describe("useSideMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(ChannelsThunks, "fetchChannelsAsync");
  });

  const commonOptions = {
    reducers: {
      channels: channelsReducer,
    },
    preloadedState: {
      channels: { ...channelsInitialState },
    },
  };

  test("マウント時fetchChannelsAsyncがdispatchされる", () => {
    const { dispatchSpy } = renderHookWithStore({
      hook: () => useSideMenu(),
      ...commonOptions,
      preloadedState: {
        ...commonOptions.preloadedState,
        channels: {
          channels: [],
          isLoading: false,
        },
      },
    });

    expect(ChannelsThunks.fetchChannelsAsync).toHaveBeenCalled();

    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Function));
  });

  test("confirmDeleteでdeleteChannelAsyncがdispatchされる", async () => {
    const { dispatchSpy, result } = renderHookWithStore({
      hook: () => useSideMenu(),
      ...commonOptions,
      preloadedState: {
        ...commonOptions.preloadedState,
        channels: {
          channels: mockChannelViewData,
          isLoading: false,
        },
      },
    });

    const targetChannel = mockChannelViewData[0];

    act(() => {
      result.current.openDeleteModal(targetChannel.id, targetChannel.name);
    });

    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.modalMessage).toBe(targetChannel.name);

    const mockPromise = Promise.resolve();
    mockPromise.unwrap = () => Promise.resolve();
    vi.spyOn(ChannelsThunks, "deleteChannelAsync").mockImplementation(() => {
      return (dispatch) => mockPromise; // これが Thunk の正体
    });
    await act(async () => {
      await result.current.confirmDelete();
    });

    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Function));

    expect(ChannelsThunks.deleteChannelAsync).toHaveBeenCalledWith({
      id: targetChannel.id,
    });

    expect(result.current.isModalOpen).toBe(false);
  });

  test("削除キャンセル時はdeleteMessageAsyncがdispatchされない", async () => {
    const { result } = renderHookWithStore({
      hook: () => useSideMenu(),
      ...commonOptions,
      preloadedState: {
        ...commonOptions.preloadedState,
        channels: {
          channels: mockChannelViewData,
          isLoading: false,
        },
      },
    });

    const targetChannel = mockChannelViewData[0];

    act(() => {
      result.current.openDeleteModal(targetChannel.id, targetChannel.name);
    });

    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.modalMessage).toBe(targetChannel.name);

    const mockPromise = Promise.resolve();
    mockPromise.unwrap = () => Promise.resolve();

    await act(async () => {
      await result.current.closeDeleteModal();
    });

    expect(result.current.isModalOpen).toBe(false);
  });

  test("異常系：削除失敗時にモーダルを閉じない", async () => {
    const { result } = renderHookWithStore({
      hook: () => useSideMenu(),
      ...commonOptions,
      preloadedState: {
        ...commonOptions.preloadedState,
        channels: {
          channels: mockChannelViewData,
          isLoading: false,
        },
      },
    });

    const targetChannel = mockChannelViewData[0];

    act(() => {
      result.current.openDeleteModal(targetChannel.id, targetChannel.name);
    });

    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.modalMessage).toBe(targetChannel.name);

    const mockReject = Promise.reject(new Error("エラー"));
    mockReject.catch(() => {});
    mockReject.unwrap = () => Promise.reject(new Error("エラー"));
    vi.spyOn(ChannelsThunks, "deleteChannelAsync").mockImplementation(() => {
      return (dispatch) => mockReject; // これが Thunk の正体
    });
    await act(async () => {
      try {
        await result.current.confirmDelete();
      } catch (error) {}
    });

    expect(result.current.isModalOpen).toBe(true);
  });

  test("toggleTextBoxを呼ぶとTextBoxOpenの真偽値が反転する", () => {
    const { result } = renderHookWithStore({
      hook: () => useSideMenu(),
      ...commonOptions,
    });

    expect(result.current.textBoxOpen).toBe(false);

    act(() => {
      result.current.toggleTextBox();
    });

    expect(result.current.textBoxOpen).toBe(true);
  });
});
