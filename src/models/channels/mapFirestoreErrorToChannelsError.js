// src/models/channels/mapFirestoreErrorToChannelsError.js

import { ChannelsError } from "@/models/errors/channels/ChannelsError";
import { CHANNELS_MODEL_ERROR_CODE } from "@/models/errors/channels/channelsErrorCode";

const CHANNEL_ERROR_MAP = {
  "firestore/invalid-argument": {
    code: CHANNELS_MODEL_ERROR_CODE.VALIDATION,
    message: "1文字以上の入力必須です",
  },
  "firestore/not-found": {
    code: CHANNELS_MODEL_ERROR_CODE.NOT_FOUND,
    message: "channelが見つかりません",
  },
  "firestore/permission-denied": {
    code: CHANNELS_MODEL_ERROR_CODE.NETWORK,
    message: "権限がありません",
  },
};

export const mapFirestoreErrorToChannelsError = (error) => {
  if (error instanceof ChannelsError) {
    return error;
  }

  if (typeof error?.code == "string" && error?.code?.startsWith("firestore/")) {
    const mapped = CHANNEL_ERROR_MAP[error.code];

    if (mapped) {
      return new ChannelsError({
        code: mapped.code,
        message: mapped.message,
        cause: error,
      });
    }

    return new ChannelsError({
      code: CHANNELS_MODEL_ERROR_CODE.NETWORK,
      message: "通信エラーが発生しました",
      cause: error,
    });
  }

  return new ChannelsError({
    code: CHANNELS_MODEL_ERROR_CODE.UNKNOWN,
    message: "予期せぬエラーが発生しました",
    cause: error,
  });
};
