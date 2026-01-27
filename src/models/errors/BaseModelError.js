// /models/errors/BaseModelError.js

export class BaseModelError extends Error {
  constructor({ code, message, cause }) {
    super(message);
    this.name = "BaseModelError";
    this.code = code;
    if (cause instanceof Error) {
      this.cause = cause;
    }
  }
}
