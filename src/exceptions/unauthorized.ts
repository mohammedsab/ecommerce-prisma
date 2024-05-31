import { HtppException } from "./root";

export class UnauthorizedException extends HtppException {
  constructor(message: string, errorCode: number, errors?: any) {
    super(message, errorCode, 401, errors);
  }
}
