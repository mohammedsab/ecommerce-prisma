import { ErrorCode, HtppException } from "./root";

export class BadRequestsException extends HtppException {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 400, null);
  }
}
