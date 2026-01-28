// src/test/models/utils/createFirestoreModel.test.js

import { describe, expect, test } from "vitest";

import { createFirestoreModel } from "@/models/utils/createFirestoreModel";

class TestModelError extends Error {
  constructor({ code, cause }) {
    super(code);
    this.code = code;
    this.cause = cause;
  }
}

const INVALID_DATA = "INVALID_DATA";

describe("createFirestoreModel", () => {
  test("正常系:createModelの戻り値をそのまま返す", async () => {
    const createModel = (id, data) => ({ id, ...data });

    const create = createFirestoreModel({
      createModel,
      ErrorClass: TestModelError,
      invalidDataCode: INVALID_DATA,
    });

    const result = create("1", { name: "test" });
    expect(result).toEqual({ id: "1", name: "test" });
  });

  test("異常系:createModelがErrorClassを投げた場合,そのまま再スローする", () => {
    const createModel = () => {
      throw new TestModelError({ code: "NOT_FOUND" });
    };

    const create = createFirestoreModel({
      createModel,
      ErrorClass: TestModelError,
      invalidDataCode: INVALID_DATA,
    });

    expect(() => create("1", {})).toThrow(TestModelError);

    try {
      create("1", {});
    } catch (error) {
      expect(error.code).toBe("NOT_FOUND");
      expect(error.cause).toBeUndefined();
    }
  });

  test("異常系:createModelが想定外エラーを投げた場合", () => {
    const originalError = new Error("@@@");

    const createModel = () => {
      throw originalError;
    };

    const create = createFirestoreModel({
      createModel,
      ErrorClass: TestModelError,
      invalidDataCode: INVALID_DATA,
    });
    try {
      create("1", {});
    } catch (error) {
      expect(error).toBeInstanceOf(TestModelError);
      expect(error.code).toBe(INVALID_DATA);
      expect(error.cause).toBe(originalError);
    }
  });
});
