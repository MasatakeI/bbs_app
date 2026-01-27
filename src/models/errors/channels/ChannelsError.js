// src/models/errors/channels/ChannelsError.js

import { BaseModelError } from "../BaseModelError";
import { CHANNELS_MODEL_ERROR_CODE } from "./channelsErrorCode";

export class ChannelsError extends BaseModelError {
  constructor({ code, message, cause }) {
    const resolvedCode = Object.values(CHANNELS_MODEL_ERROR_CODE).includes(code)
      ? code
      : CHANNELS_MODEL_ERROR_CODE.UNKNOWN;

    super({
      code: resolvedCode,
      message: message ?? resolvedCode,
      cause,
    });

    this.name = "ChannelsError";
  }
}
