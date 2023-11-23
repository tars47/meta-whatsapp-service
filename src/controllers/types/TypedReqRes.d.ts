import { type Request, type Response } from "express";
import { type ContextObject } from "../../middleware/Context";
import { type ResponseObject } from "../../middleware/Response";

export type TypedRequest<
  ReqBody = Record<string, unknown>,
  QueryString = Record<string, unknown>
> = Request<Record<string, unknown>, ResponseObject, ReqBody, Partial<QueryString>, ContextObject>;

export type TypedResponse = Response<ResponseObject, ContextObject>;
