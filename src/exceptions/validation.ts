import { HtppException } from "./root";

export class UnprocessableEntity extends HtppException {
  constructor(error: any, message: string, errorCode: number) {
    super(message, errorCode, 422, error);
  }
}
