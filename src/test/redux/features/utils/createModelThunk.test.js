// src/test/redux/features/utils/createModelThunk.js

import { describe, test, expect, vi } from "vitest";

import { createModelThunk } from "@/redux/features/utils/createModelThunk";

import { BaseModelError } from "@/models/errors/BaseModelError";

const dispatch = vi.fn();
const getState = vi.fn();

describe("createModelThunk", () => {
  test("fn終了時はfulfilledになる", async () => {
    const thunk = createModelThunk("test/success", async () => {
      return "Success";
    });

    const result = await thunk()(dispatch, getState, undefined);
    expect(result.type).toBe("test/success/fulfilled");
    expect(result.payload).toBe("Success");
  });

  test("BaseModelErrorの場合はrejectWithValueされる", async () => {
    const thunk = createModelThunk("test/baseError", async () => {
      throw new BaseModelError({ code: "VALIDATION", message: "入力必須です" });
    });

    const result = await thunk()(dispatch, getState, undefined);

    expect(result.type).toBe(thunk.rejected.type);
    expect(result.payload).toEqual({
      code: "VALIDATION",
      message: "入力必須です",
    });

    expect(result.meta.rejectedWithValue).toBe(true);
  });

  test("BaseModelError以外はUNKOWNでrejectされる", async () => {
    const thunk = createModelThunk("test/unkownError", async () => {
      throw new Error("予期せぬエラーが発生しました");
    });

    const result = await thunk()(dispatch, getState, undefined);

    expect(result.type).toBe(thunk.rejected.type);
    expect(result.payload).toEqual({
      code: "UNKNOWN",
      message: "予期せぬエラーが発生しました",
    });

    expect(result.meta.rejectedWithValue).toBe(true);
  });
});
