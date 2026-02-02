// src/test/components/widgets/Form/ChannelForm.test.jsx

import { describe, test, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, act } from "@testing-library/react";

import { useChannelForm } from "@/components/widgets/Form/useChannelForm";
import { renderHookWithStore } from "@/test/utils/renderHookWithStore";

import channelsReducer, {
  channelsInitialState,
} from "@/redux/features/channels/channelsSlice";

import * as ChannelsThunks from "@/redux/features/channels/channelsThunks";

describe("useChannelForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(ChannelsThunks, "addChannelAsync");
  });

  const commonOptions = {
    reducers: {
      channels: channelsReducer,
    },
    preloadedState: {
      channels: { ...channelsInitialState },
    },
  };

  describe("handleSubmit", () => {
    test("正常系:フォーム入力後にhandleSubmitを呼ぶと正しい引数でdispatchされ,onCloseが呼ばれる", async () => {
      const onClose = vi.fn();

      const { result } = renderHookWithStore({
        hook: () => useChannelForm(onClose),
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          channels: { ...channelsInitialState, isLoading: false },
        },
      });

      const testData = { id: "new-id", name: "新チャンネル" };

      await act(async () => {
        result.current.setForm(testData);
      });

      const mockThunk = vi
        .spyOn(ChannelsThunks, "addChannelAsync")
        .mockImplementation((arg) => {
          const thunkAction = (dispatch) => {
            return Promise.resolve(arg);
          };
          const promise = Promise.resolve(arg);
          promise.unwrap = () => Promise.resolve(arg);

          return (dispatch) => promise;
        });

      await act(async () => {
        await result.current.handleSubmit();
      });

      await waitFor(() => {
        expect(mockThunk).toHaveBeenCalledWith(testData);
      });
      expect(onClose).toHaveBeenCalled();
      expect(result.current.form).toEqual({ id: "", name: "" });
    });

    test("異常系: addChannelAsyncが失敗した場合はエラーを投げ、フォームをリセットしない", async () => {
      const onClose = vi.fn();

      const { result } = renderHookWithStore({
        hook: () => useChannelForm(onClose),
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          channels: { ...channelsInitialState, isLoading: false },
        },
      });

      const errorTestData = { id: "error-id", name: "失敗テスト" };

      await act(async () => {
        result.current.setForm(errorTestData);
      });

      const mockThunk = vi
        .spyOn(ChannelsThunks, "addChannelAsync")
        .mockImplementation((arg) => {
          // const thunkAction = (dispatch) => {
          //   return Promise.reject(arg);
          // };
          const promise = Promise.reject(new Error("Firebase Error"));
          promise.catch(() => {});
          promise.unwrap = () => Promise.reject(new Error("Firebase Error"));
          return (dispatch) => promise;
        });

      // handleSubmit内でエラーがスローされることを確認

      await act(async () => {
        await expect(result.current.handleSubmit()).rejects.toThrow(
          "Firebase Error",
        );
      });

      // onCloseは呼ばれず、フォームの値も保持されたままであること
      expect(onClose).not.toHaveBeenCalled();
      expect(result.current.form).toEqual(errorTestData);
    });
  });
});
