import axios from "axios";
import WhatsApp from "../util/WhatsApp";
import { HttpError } from "../util/HttpError";
import { decrypt } from "../util/Crypto";
import { TypedRequest, TypedResponse } from "./types/TypedReqRes";
import { type NextFunction } from "express";
import {
  type List,
  type View,
  type VerifyCode,
  type RequestCode,
  type RegisterPhone,
  type DeRegisterPhone,
  type GetBusinessProfile,
  type UpdateBusinessProfile,
  type SetTwoStepVerificationCode,
} from "./types/PhoneNumber";

/**
 *  @description -> This controller class implements all the handlers for /phoneNumbers subroutes
 */
export default class PhoneNumberController extends WhatsApp {
  /**
   *  @description -> creates instance of MessagesController
   */
  constructor() {
    super();
  }

  /**
   *  @description -> handler to get list of phone numbers for a given waba id
   */
  public async list(
    req: TypedRequest<{}, List>,
    res: TypedResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const url = `${this.url}/${req.query.wabaId}/phone_numbers?limit=1000`;
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
   *  @description -> handler to get view of phone numbers for a given phoneNumberId
   */
  public async view(
    req: TypedRequest<{}, View>,
    res: TypedResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const queryFields = `verified_name,code_verification_status,display_phone_number,quality_rating,id,name_status`;
      const url = `${this.url}/${req.query.phoneNumberId}?fields=${queryFields}`;
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
   *  @description -> handler to request verification code
   */
  public async requestCode(
    req: TypedRequest<RequestCode>,
    res: TypedResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const url = `${this.url}/${req.body.phoneNumberId}`;
      const token = decrypt(req.body.token);
      const body = {
        code_method: req.body.code_method,
        language: req.body.language,
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
   *  @description -> handler to verify code
   */
  public async verifyCode(
    req: TypedRequest<VerifyCode>,
    res: TypedResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const url = `${this.url}/${req.body.phoneNumberId}`;
      const token = decrypt(req.body.token);
      const body = {
        code: req.body.code,
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
   *  @description -> handler to set up two step verification code
   */
  public async setTwoStepVerificationCode(
    req: TypedRequest<SetTwoStepVerificationCode>,
    res: TypedResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const url = `${this.url}/${req.body.phoneNumberId}`;
      const token = decrypt(req.body.token);
      const body = {
        pin: req.body.pin,
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
   *  @description -> handler to register phone number
   */
  public async registerPhone(
    req: TypedRequest<RegisterPhone>,
    res: TypedResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const url = `${this.url}/${req.body.phoneNumberId}`;
      const token = decrypt(req.body.token);
      const body = {
        messaging_product: "whatsapp",
        pin: req.body.pin,
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
   *  @description -> handler to de-register phone number
   */
  public async deRegisterPhone(
    req: TypedRequest<DeRegisterPhone>,
    res: TypedResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const url = `${this.url}/${req.body.phoneNumberId}`;
      const token = decrypt(req.body.token);
      const response = await axios.post(url, null, this.headers(token));
      const data = response.data;
      res.locals.data = data;
      next();
    } catch (err) {
      next(new HttpError(err));
    }
  }

  /**
   *  @description -> handler to get business profile
   */
  public async getBusinessProfile(
    req: TypedRequest<{}, GetBusinessProfile>,
    res: TypedResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const queryFields = `about,address,description,email,profile_picture_url,websites,vertical`;
      const url = `${this.url}/${req.query.phoneNumberId}/whatsapp_business_profile?fields=${queryFields}`;
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
   *  @description -> handler to update business profile
   */
  public async updateBusinessProfile(
    req: TypedRequest<UpdateBusinessProfile>,
    res: TypedResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      const url = `${this.url}/${req.body.phoneNumberId}/whatsapp_business_profile`;
      const token = decrypt(req.body.token);
      const body = this.filterNulls<Partial<UpdateBusinessProfile>>({
        ...req.body,
      });
      delete body.token;
      delete body.phoneNumberId;
      const response = await axios.post(url, body, this.headers(token));
      const data = response.data;
      res.locals.data = data;
      next();
    } catch (err) {
      next(new HttpError(err));
    }
  }
}
