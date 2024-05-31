import { HtppException } from "./root";

export class InternalException extends HtppException {
  constructor(message: string, errors: any, errorCode: number) {
    super(message, errorCode, 500, errors);
  }
}
