// src/models/errors/messages/MessagesError.js

import { BaseModelError } from "../BaseModelError";
import { MESSAGES_MODEL_ERROR_CODE } from "./messagesErrorCode";

export class MessagesError extends BaseModelError {
  constructor({ code, message, cause }) {
    const resolvedCode = Object.values(MESSAGES_MODEL_ERROR_CODE).includes(code)
      ? code
      : MESSAGES_MODEL_ERROR_CODE.UNKNOWN;

    super({
      code: resolvedCode,
      message: message ?? resolvedCode,
      cause,
    });

    this.name = "MessagesError";
  }
}
