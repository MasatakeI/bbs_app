// src/test/components/page/MainPage/useMainPage.test.jsx

import { useMainPage } from "@/components/page/MainPage/useMainpage";
import { describe, test, expect, vi, beforeEach } from "vitest";

import { renderHookWithStore } from "@/test/utils/renderHookWithStore";

import channelsReducer, {
  channelsInitialState,
} from "@/redux/features/channels/channelsSlice";
import messagesReducer, {
  clearMessagesState,
  messagesInitialState,
} from "@/redux/features/messages/messagesSlice";
import { createMemoryHistory } from "history";
import * as messagesThunks from "@/redux/features/messages/messagesThunks";

import { showSnackbar } from "@/redux/features/snackbar/snackbarSlice";
import { waitFor } from "@testing-library/react";

vi.mock("@/redux/features/messages/messagesThunks", async (importOriginal) => {
  const actual = await importOriginal();

  const mockFetch = vi.fn((arg) => ({
    type: "messages/fetchMessages/fulfilled",
    payload: arg,
  }));

  mockFetch.pending = actual.fetchMessagesAsync.pending;
  mockFetch.fulfilled = actual.fetchMessagesAsync.fulfilled;
  mockFetch.rejected = actual.fetchMessagesAsync.rejected;

  return {
    ...actual,
    fetchMessagesAsync: mockFetch,
  };
});

vi.mock("@/redux/features/snackbar/snackbarSlice", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    showSnackbar: vi.fn((msg) => ({ type: "showSnackbar", payload: msg })),
  };
});

vi.mock("@/redux/features/messages/messagesSlice", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    clearMessagesState: vi.fn(() => ({ type: "clearMessagesState" })),
  };
});

describe("useMainPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(messagesThunks, "fetchMessagesAsync");
  });

  const commonOptions = {
    reducers: {
      channels: channelsReducer,
      messages: messagesReducer,
    },
    preloadedState: {
      channels: { ...channelsInitialState },
      messages: { ...messagesInitialState },
    },
  };

  test("正常系: isReady && isExistの時,fetchMessagesAsyncをdispatchする", async () => {
    renderHookWithStore({
      hook: useMainPage,
      ...commonOptions,
      preloadedState: {
        ...commonOptions.preloadedState,
        channels: {
          isLoading: false,
          channels: [{ id: "general", name: "全体連絡" }],
        },
      },
    });

    expect(messagesThunks.fetchMessagesAsync).toHaveBeenCalled();
  });

  test("異常系:存在しない/無効な channelIdの時,snackbarを表示しredirectされる", async () => {
    const { result } = renderHookWithStore({
      hook: useMainPage,
      ...commonOptions,

      preloadedState: {
        ...commonOptions.preloadedState,
        channels: {
          isLoading: false,
          channels: [{ id: "general", name: "全体連絡" }],
        },
      },
      initialPath: "/channels/@@@",
    });

    expect(showSnackbar).toHaveBeenCalled();
    expect(result.current.redirectTo).toBe("/channels/general");
  });

  test("ローティング中は何もdispatchしない", async () => {
    renderHookWithStore({
      hook: useMainPage,
      ...commonOptions,
      preloadedState: {
        ...commonOptions.preloadedState,
        channels: {
          isLoading: true,
          channels: [],
        },
      },
    });

    expect(messagesThunks.fetchMessagesAsync).not.toHaveBeenCalled();
    expect(showSnackbar).not.toHaveBeenCalled();
  });

  test("unmount時にclearMessagesStateがdispatchされる", async () => {
    const { unmount } = renderHookWithStore({
      hook: useMainPage,
      ...commonOptions,
      preloadedState: {
        ...commonOptions.preloadedState,
        channles: {
          isLoading: false,
          channels: [{ id: "general", name: "全体連絡" }],
        },
      },
    });
    unmount();

    expect(clearMessagesState).toHaveBeenCalled();
  });

  test("channelIdが変わったら再fetchされる", async () => {
    const history = createMemoryHistory({
      initialEntries: ["/channels/general"],
    });

    const { rerender } = renderHookWithStore({
      hook: useMainPage,
      ...commonOptions,
      preloadedState: {
        ...commonOptions.preloadedState,
        channels: {
          isLoading: false,
          channels: [
            { id: "general", name: "全体連絡" },
            { id: "chat", name: "雑談" },
          ],
        },
      },
      history,
    });

    expect(messagesThunks.fetchMessagesAsync).toHaveBeenCalledTimes(1);

    history.push("/channels/chat");

    rerender();
    await waitFor(() => {
      expect(messagesThunks.fetchMessagesAsync).toHaveBeenCalledTimes(2);
    });
    expect(messagesThunks.fetchMessagesAsync).toHaveBeenLastCalledWith({
      channelId: "chat",
    });
  });
});
