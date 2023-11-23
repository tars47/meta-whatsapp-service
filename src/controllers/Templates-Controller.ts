import axios, { AxiosRequestConfig } from "axios";
import WhatsApp from "../util/WhatsApp";
import { HttpError } from "../util/HttpError";
import { decrypt } from "../util/Crypto";
import { TypedRequest, TypedResponse } from "./types/TypedReqRes";
import { type NextFunction } from "express";
import {
  type ViewBy,
  type Common,
  type View,
  type Template,
  type DeleteTemplateById,
  type DeleteTemplateByName,
  type MessageTemplate,
} from "./types/Templates";

/**
 *  @description -> This controller class implements all the handlers for /templates subroutes
 */
export default class TemplatesController extends WhatsApp {
  /**
   *  @description -> creates instance of TemplatesController
   */
  constructor() {
    super();
  }

  /**
   *  @description -> handler to get message template namespace
   */
  public async namespace(req: TypedRequest<{}, Common>, res: TypedResponse, next: NextFunction) {
    try {
      const url = `${this.url}/${req.query.wabaId}?fields=message_template_namespace`;
      const token = decrypt(req.query.token as string);
      const response = await axios.get(url, this.headers(token));
      const data = response.data;
      res.locals.data = data;
      next();
    } catch (err) {
      next(new HttpError(err));
    }
  }

  /**
   *  @description -> handler to get list of message templates
   */
  public async list(
    req: TypedRequest<{}, Common>,
    res: TypedResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const url = `${this.url}/${req.query.wabaId}/message_templates?limit=1000`;
      const token = decrypt(req.query.token as string);
      const response = await axios.get(url, this.headers(token));
      const data = response.data;
      res.locals.data = data;
      next();
    } catch (err) {
      next(new HttpError(err));
    }
  }

  /**
   *  @description -> handler to view message template based on templateId
   */
  public async view(
    req: TypedRequest<{}, View>,
    res: TypedResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const url = `${this.url}/${req.query.templateId}`;
      const token = decrypt(req.query.token as string);
      const response = await axios.get(url, this.headers(token));
      const data = response.data;
      res.locals.data = data;
      next();
    } catch (err) {
      next(new HttpError(err));
    }
  }

  /**
   *  @description -> handler to view message template based on specified query params
   */
  public async viewBy(
    req: TypedRequest<{}, ViewBy>,
    res: TypedResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const url = `${this.url}/${req.query.wabaId}/message_templates?`;
      const token = decrypt(req.query.token as string);
      const query = this.filterNulls<Partial<ViewBy>>({ ...req.query });
      delete query.wabaId;
      delete query.token;
      const config: AxiosRequestConfig = {
        headers: this.headers(token).headers,
        params: query,
      };
      const response = await axios.get(url, config);
      const data = response.data;
      res.locals.data = data;
      next();
    } catch (err) {
      next(new HttpError(err));
    }
  }

  /**
   *  @description -> handler to create message template
   */
  public async create(
    req: TypedRequest<Common & Template>,
    res: TypedResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const url = `${this.url}/${req.body.wabaId}/message_templates`;
      const token = decrypt(req.body.token);
      const body: Partial<Common & Template> = { ...req.body };
      delete body.wabaId;
      delete body.token;
      const response = await axios.post(url, body, this.headers(token));
      const data = response.data;
      res.locals.data = data;
      next();
    } catch (err) {
      next(new HttpError(err));
    }
  }

  /**
   *  @description -> handler to delete message template based on templateId
   */
  public async deleteById(
    req: TypedRequest<{}, DeleteTemplateById>,
    res: TypedResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const query = `name=${req.query.templateName}&hsm_id=${req.query.templateId}`;
      const url = `${this.url}/${req.query.wabaId}/message_templates?${query}`;
      const token = decrypt(req.query.token as string);
      const response = await axios.delete(url, this.headers(token));
      const data = response.data;
      res.locals.data = data;
      next();
    } catch (err) {
      next(new HttpError(err));
    }
  }

  /**
   *  @description -> handler to delete message template based on templateName
   */
  public async deleteByName(
    req: TypedRequest<{}, DeleteTemplateByName>,
    res: TypedResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const query = `name=${req.query.templateName}`;
      const url = `${this.url}/${req.query.wabaId}/message_templates?${query}`;
      const token = decrypt(req.query.token as string);
      const response = await axios.delete(url, this.headers(token));
      const data = response.data;
      res.locals.data = data;
      next();
    } catch (err) {
      next(new HttpError(err));
    }
  }

  /**
   *  @description -> handler to send message template
   */
  public async message(
    req: TypedRequest<MessageTemplate>,
    res: TypedResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const url = `${this.url}/${req.body.phoneNumberId}/messages`;
      const token = decrypt(req.body.token);
      const body: Partial<MessageTemplate> = { ...req.body };
      delete body.phoneNumberId;
      delete body.token;
      const response = await axios.post(url, body, this.headers(token));
      const data = response.data;
      res.locals.data = data;
      next();
    } catch (err) {
      next(new HttpError(err));
    }
  }
}
