// src/test/redux/middleware/snackbarMiddleware.test.js

import { describe, test, expect, vi, beforeEach } from "vitest";

import { snackbarMiddleware } from "@/redux/middleware/snackbarMiddleware";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { showSnackbar } from "@/redux/features/snackbar/snackbarSlice";

vi.mock("@reduxjs/toolkit", async () => {
  const actual = await vi.importActual("@reduxjs/toolkit");

  return {
    ...actual,
    isRejectedWithValue: vi.fn(),
  };
});

const dispatch = vi.fn();
const next = vi.fn();
const store = { dispatch };

describe("snackbarMiddleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("rejectWithValueされたactionでsnackbarをdispatchする", () => {
    isRejectedWithValue.mockReturnValue(true);

    const middleware = snackbarMiddleware(store)(next);

    const message = "追加失敗";

    const action = {
      type: "messages/addMessage/rejected",
      payload: { message },
    };

    middleware(action);

    expect(dispatch).toHaveBeenCalledWith(showSnackbar(message));

    expect(next).toHaveBeenCalledWith(action);
  });

  test("payload.messageがない場合はデフォルト文言", () => {
    isRejectedWithValue.mockReturnValue(true);

    const middleware = snackbarMiddleware(store)(next);

    const action = {
      type: "messages/addMessage/rejected",
      payload: {},
    };

    middleware(action);

    expect(dispatch).toHaveBeenCalledWith(showSnackbar("エラーが発生しました"));
  });

  test("isRejectedWithValueがfalseの場合はdispatchを呼ばない", () => {
    isRejectedWithValue.mockReturnValue(false);

    const middleware = snackbarMiddleware(store)(next);

    const message = "追加失敗";

    const action = {
      type: "messages/addMessage/rejected",
      payload: { message },
    };

    middleware(action);
    expect(dispatch).not.toHaveBeenCalled();
  });

  test("snackbar action自身ではsnackbarを再dispatchしない", () => {
    isRejectedWithValue.mockReturnValue(true);
    const middleware = snackbarMiddleware(store)(next);

    const message = "再帰防止";

    const action = {
      type: "snackbar/showSnackbar",
      payload: { message },
    };

    middleware(action);
    expect(dispatch).not.toHaveBeenCalled();
  });
});
