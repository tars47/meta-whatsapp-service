import axios from "axios";
import WhatsApp from "../util/WhatsApp";
import { decrypt } from "../util/Crypto";
import { HttpError } from "../util/HttpError";
import uploadFile from "../util/CloudStorage";
import { type TypedRequest, type TypedResponse } from "./types/TypedReqRes";
import { type NextFunction } from "express";
import {
  type Text,
  type Common,
  type Message,
  type TextReply,
  type Reaction,
  Image,
  ImageReply,
} from "./types/Messages";

/**
 *  @description -> This controller class implements all the handlers for /messages subroutes
 */
export default class MessagesController extends WhatsApp {
  /**
   *  @description -> creates instance of MessagesController
   */
  constructor() {
    super();
  }

  /**
   *  @description -> Generic method to send text/text with url.
   */
  public async text<T extends boolean>(
    req: TypedRequest<Common & Message<"text"> & Text<T>>,
    res: TypedResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const url = `${this.url}/${req.body.phoneNumberId}/messages`;
      const token = decrypt(req.body.token);
      const body: Message<"text"> & Text<T> = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: req.body.to,
        type: "text",
        text: {
          preview_url: req.body.text.preview_url,
          body: req.body.text.body,
        },
      };
      const response = await axios.post(url, body, this.headers(token));
      console.log(response.data);
      const data = response.data;
      res.locals.data = data;
      next();
    } catch (err) {
      next(new HttpError(err));
    }
  }

  /**
   *  @description -> Generic method to reply with text/text with url.
   */
  public async textReply<T extends boolean>(
    req: TypedRequest<Common & Message<"text"> & TextReply<T>>,
    res: TypedResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const url = `${this.url}/${req.body.phoneNumberId}/messages`;
      const token = decrypt(req.body.token);
      const body: Message<"text"> & TextReply<T> = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: req.body.to,
        type: "text",
        context: {
          message_id: req.body.context.message_id,
        },
        text: {
          preview_url: req.body.text.preview_url,
          body: req.body.text.body,
        },
      };
      const response = await axios.post(url, body, this.headers(token));
      const data = response.data;
      res.locals.data = data;
      next();
    } catch (err) {
      next(new HttpError(err));
    }
  }

  /**
   *  @description -> method to reply with reaction.
   */
  public async reactionReply(
    req: TypedRequest<Common & Message<"reaction"> & Reaction>,
    res: TypedResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const url = `${this.url}/${req.body.phoneNumberId}/messages`;
      const token = decrypt(req.body.token);
      const body: Message<"reaction"> & Reaction = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: req.body.to,
        type: "reaction",
        reaction: {
          message_id: req.body.reaction.message_id,
          emoji: req.body.reaction.emoji,
        },
      };
      const response = await axios.post(url, body, this.headers(token));
      const data = response.data;
      res.locals.data = data;
      next();
    } catch (err) {
      next(new HttpError(err));
    }
  }

  /**
   *  @description -> utility method to upload file to google cloud storage
   */
  public async uploadFileToGCS(
    req: TypedRequest,
    res: TypedResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const myFile = req.file;
      if (!myFile?.originalname || !myFile?.buffer) throw new Error("Invalid file");
      const fileUrl = await uploadFile(myFile, res.locals.merchant.uid);
      res.locals.data = {
        fileUrl,
      };
      next();
    } catch (err) {
      next(new HttpError(err));
    }
  }

  /**
   *  @description -> method to send image message.
   */
  public async image(
    req: TypedRequest<Common & Message<"image"> & Image>,
    res: TypedResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const url = `${this.url}/${req.body.phoneNumberId}/messages`;
      const token = decrypt(req.body.token);
      const body: Message<"image"> & Image = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: req.body.to,
        type: "image",
        image: {
          link: req.body.image.link,
        },
      };
      const response = await axios.post(url, body, this.headers(token));
      const data = response.data;
      res.locals.data = data;
      next();
    } catch (err) {
      next(new HttpError(err));
    }
  }

  /**
   *  @description -> Generic method to reply with image.
   */
  public async imageReply(
    req: TypedRequest<Common & Message<"image"> & ImageReply>,
    res: TypedResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const url = `${this.url}/${req.body.phoneNumberId}/messages`;
      const token = decrypt(req.body.token);
      const body: Message<"image"> & ImageReply = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: req.body.to,
        type: "image",
        image: {
          link: req.body.image.link,
        },
        context: {
          message_id: req.body.context.message_id,
        },
      };
      const response = await axios.post(url, body, this.headers(token));
      const data = response.data;
      res.locals.data = data;
      next();
    } catch (err) {
      next(new HttpError(err));
    }
  }
}
