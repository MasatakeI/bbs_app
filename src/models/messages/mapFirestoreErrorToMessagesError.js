// src/models/messages/mapFirestoreErrorToMessagesError.js

import { MessagesError } from "../errors/messages/MessagesError";
import { MESSAGES_MODEL_ERROR_CODE } from "../errors/messages/messagesErrorCode";

const MESSAGE_ERROR_MAP = {
  "firestore/invalid-argument": {
    code: MESSAGES_MODEL_ERROR_CODE.VALIDATION,
    message: "1文字以上の入力必須です",
  },
  "firestore/not-found": {
    code: MESSAGES_MODEL_ERROR_CODE.NOT_FOUND,
    message: "messageが見つかりません",
  },
  "firestore/permission-denied": {
    code: MESSAGES_MODEL_ERROR_CODE.NETWORK,
    message: "権限がありません",
  },
};

export const mapFirestoreErrorToMessagesError = (error) => {
  if (error instanceof MessagesError) {
    return error;
  }

  if (typeof error?.code == "string" && error?.code?.startsWith("firestore/")) {
    const mapped = MESSAGE_ERROR_MAP[error.code];

    if (mapped) {
      return new MessagesError({
        code: mapped.code,
        message: mapped.message,
        cause: error,
      });
    }

    return new MessagesError({
      code: MESSAGES_MODEL_ERROR_CODE.NETWORK,
      message: "通信エラーが発生しました",
      cause: error,
    });
  }

  return new MessagesError({
    code: MESSAGES_MODEL_ERROR_CODE.UNKNOWN,
    message: "予期せぬエラーが発生しました",
    cause: error,
  });
};
