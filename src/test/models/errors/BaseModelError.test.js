// src/test/models/errors/BaseModelError.js

import { describe, test, expect } from "vitest";

import { BaseModelError } from "@/models/errors/BaseModelError";

describe("BaseModelError", () => {
  test("Errorを継承しcodeとmessageを保持する", () => {
    const error = new BaseModelError({
      code: "TEST_CODE",
      message: "test message",
    });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(BaseModelError);

    expect(error.code).toBe("TEST_CODE");
    expect(error.message).toBe("test message");
    expect(error.name).toBe("BaseModelError");
  });

  test("causeがErrorの場合のみ保持される", () => {
    const cause = new Error("original");

    const error = new BaseModelError({
      code: "WITH_CAUSE",
      message: "wrapped",
      cause,
    });

    expect(error.cause).toBe(cause);
  });

  test("causeがErrorでない場合はむしされる", () => {
    const error = new BaseModelError({
      code: "NO_CAUSE",
      message: "no cause",
      cause: "string",
    });

    expect(error.cause).toBe(undefined);
  });
});
