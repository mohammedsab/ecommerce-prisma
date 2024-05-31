import { ErrorCode, HtppException } from "./root";

export class NotFoundException extends HtppException {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 404, null);
  }
}
