import { HtppException } from "./root";

export class BadRequestsException extends HtppException {
  constructor(message: string, errorCode: number, errors?: any) {
    super(message, errorCode, 400, errors);
  }
}
