// src/redux/features/utils/createModelThunk.js

import { createAsyncThunk } from "@reduxjs/toolkit";

import { BaseModelError } from "@/models/errors/BaseModelError";

export const createModelThunk = (type, fn) =>
  createAsyncThunk(type, async (arg, thunkApi) => {
    try {
      return await fn(arg, thunkApi);
    } catch (error) {
      if (error instanceof BaseModelError) {
        return thunkApi.rejectWithValue({
          code: error.code,
          message: error.message,
        });
      }

      return thunkApi.rejectWithValue({
        code: "UNKNOWN",
        message: "予期せぬエラーが発生しました",
      });
    }
  });
