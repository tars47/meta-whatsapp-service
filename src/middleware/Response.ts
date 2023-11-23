import { type HttpErrorObject } from "../util/HttpError";
import { type Request, type NextFunction } from "express";
import { type TypedResponse } from "../controllers/types/TypedReqRes";
/**
 * @description ->  Defines the public contract of a response object
 */
export interface ResponseObject {
  status: {
    code: StatusCode;
    message: string;
    traceId?: string;
    processedIn: number;
  };
  data?: object;
  error?: object;
}

export type StatusCode = keyof typeof Response.codes;

/**
 * @description -> This class is responsible for formating, logging and sending the responses
 *                 back to the client.
 */
export class Response {
  /**
   * @description ->  this middleware is responsible to format the response and send it back
   *                to the client.
   */
  static send(_: Request, res: TypedResponse): TypedResponse {
    if (res.locals.isValidRoute !== true) {
      console.log(_);
      const statusCode: StatusCode = 404;
      return res.status(statusCode).json({
        status: {
          code: statusCode,
          message: Response.codes[statusCode],
          processedIn: 0,
        },
        error: {
          message: "The requested resource doesn't exist on this server",
        },
      });
    }
    let response: ResponseObject = {
      status: {
        code: res.locals.statusCode,
        message: Response.codes[res.locals.statusCode],
        processedIn: Date.now() - new Date(res.locals.reqdt).valueOf(),
      },
    };

    if (res.locals.statusCode >= 400) response.status.traceId = res.locals.traceId;
    if (res.locals.data) response.data = res.locals.data;
    if (res.locals.error) response.error = res.locals.error;

    res.locals.processedIn = response.status.processedIn;
    res.locals.save();

    return res.status(response.status.code).json(response);
  }

  /**
   * @description ->  this middleware is responsible to handle errors
   */
  static error(err: HttpErrorObject, _: Request, res: TypedResponse, next: NextFunction) {
    res.locals.statusCode = err.statusCode;
    res.locals.error = err.error;

    if (typeof res.locals?.log === "function") {
      res.locals?.log();
    }
    next();
  }

  /**
   * @description ->  List of all the HTTP status codes and descriptions
   */
  static codes = {
    100: "CONTINUE",
    101: "SWITCHING_PROTOCOLS",
    102: "PROCESSING",
    200: "OK",
    201: "CREATED",
    202: "ACCEPTED",
    203: "NON_AUTHORITATIVE_INFORMATION",
    204: "NO_CONTENT",
    205: "RESET_CONTENT",
    206: "PARTIAL_CONTENT",
    207: "MULTI_STATUS",
    300: "MULTIPLE_CHOICES",
    301: "MOVED_PERMANENTLY",
    302: "MOVED_TEMPORARILY",
    303: "SEE_OTHER",
    304: "NOT_MODIFIED",
    305: "USE_PROXY",
    307: "TEMPORARY_REDIRECT",
    308: "PERMANENT_REDIRECT",
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    402: "PAYMENT_REQUIRED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    405: "METHOD_NOT_ALLOWED",
    406: "NOT_ACCEPTABLE",
    407: "PROXY_AUTHENTICATION_REQUIRED",
    408: "REQUEST_TIMEOUT",
    409: "CONFLICT",
    410: "GONE",
    411: "LENGTH_REQUIRED",
    412: "PRECONDITION_FAILED",
    413: "REQUEST_TOO_LONG",
    414: "REQUEST_URI_TOO_LONG",
    415: "UNSUPPORTED_MEDIA_TYPE",
    416: "REQUESTED_RANGE_NOT_SATISFIABLE",
    417: "EXPECTATION_FAILED",
    418: "IM_A_TEAPOT",
    419: "INSUFFICIENT_SPACE_ON_RESOURCE",
    420: "METHOD_FAILURE",
    421: "MISDIRECTED_REQUEST",
    422: "UNPROCESSABLE_ENTITY",
    423: "LOCKED",
    424: "FAILED_DEPENDENCY",
    428: "PRECONDITION_REQUIRED",
    429: "TOO_MANY_REQUESTS",
    431: "REQUEST_HEADER_FIELDS_TOO_LARGE",
    451: "UNAVAILABLE_FOR_LEGAL_REASONS",
    500: "INTERNAL_SERVER_ERROR",
    501: "NOT_IMPLEMENTED",
    502: "BAD_GATEWAY",
    503: "SERVICE_UNAVAILABLE",
    504: "GATEWAY_TIMEOUT",
    505: "HTTP_VERSION_NOT_SUPPORTED",
    507: "INSUFFICIENT_STORAGE",
    511: "NETWORK_AUTHENTICATION_REQUIRED",
  };
}
