import { AxiosError } from "axios";
import { type StatusCode } from "../middleware/Response";

/**
 * @description -> public contract for HttpError class
 */
export interface HttpErrorObject {
  statusCode: StatusCode;
  error: unknown;
}

/**
 * @description ->  This utility class is used to define a http error
 */
export class HttpError implements HttpErrorObject {
  public statusCode: StatusCode = 500;
  public error;

  /**
   *  @description ->  This constructor is used to define a http error
   */
  constructor(error: unknown, code?: StatusCode) {
    if (error instanceof AxiosError) {
      this.error = error.response?.data || error.response;
      this.statusCode = (error.response?.status as StatusCode) || 500;
    } else if (error instanceof Error) {
      this.error = { message: error.message };
    } else {
      this.error = error;
    }
    if (code) this.statusCode = code;
  }
}
