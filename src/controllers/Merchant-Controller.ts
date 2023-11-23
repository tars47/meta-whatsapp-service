import axios from "axios";
import WhatsApp from "../util/WhatsApp";
import { HttpError } from "../util/HttpError";
import { decrypt } from "../util/Crypto";
import { TypedRequest, TypedResponse } from "./types/TypedReqRes";
import { type NextFunction } from "express";
import { type SignUp } from "./types/Merchant";
import MerchantModel from "../models/Merchant-Model";

/**
 *  @description -> This controller class implements all the handlers for /merchant subroutes
 */
export default class MerchantController extends WhatsApp {
  /**
   *  @description -> creates instance of MerchantController
   */
  constructor() {
    super();
  }

  public async debugInputToken(inputToken: string): Promise<[string, object]> {
    try {
      const url = `${this.url}/debug_token?input_token=${inputToken}`;
      const response = await axios.get(url, this.headers(this.sysUserAccessToken));
      const data = response.data;
      console.log(data);
      const merchantWabaId: string | undefined = data?.data?.granular_scopes?.[0]?.target_ids?.[0];
      if (!merchantWabaId)
        throw {
          message: "Merchant Waba Id not found!! Please retry again.",
          fbResponse: data,
        };

      return [merchantWabaId, data];
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getMerchantWabaInfo(merchantWabaId: string): Promise<object> {
    try {
      const url = `${this.url}/${merchantWabaId}`;
      const accessToken = this.sysUserAccessToken;
      const response = await axios.get(url, this.headers(accessToken));
      return response.data;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async addSysUserToMerchantWaba(merchantWabaId: string): Promise<boolean> {
    try {
      const sysUserId = process.env.WHATSAPP_SYS_USER_ID as string;
      const tasks = "MANAGE";
      const accessToken = this.sysUserAccessToken;
      const url = `${this.url}/${merchantWabaId}/assigned_users?user=${sysUserId}&tasks=['${tasks}']&access_token=${accessToken}`;
      const response = await axios.post(url, null, this.headers(this.sysUserAccessToken));
      if (response.data?.success) return true;
      else
        throw {
          message: "Error in adding system user to merchant waba!!",
          fbResponse: response.data,
        };
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getMerchantPhoneNumbers(merchantWabaId: string): Promise<object[]> {
    try {
      const accessToken = this.sysUserAccessToken;
      const url = `${this.url}/${merchantWabaId}/phone_numbers?limit=1000`;
      const response = await axios.get(url, this.headers(accessToken));
      if (response.data?.data) return response.data.data;
      else
        throw {
          message: "Error in getting Merchant phone numbers!!",
          fbResponse: response.data,
        };
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getMerchantTemplates(merchantWabaId: string): Promise<object[]> {
    try {
      const accessToken = this.sysUserAccessToken;
      const url = `${this.url}/${merchantWabaId}/message_templates?limit=1000`;
      const response = await axios.get(url, this.headers(accessToken));
      if (response.data?.data) return response.data.data;
      else
        throw {
          message: "Error in getting Merchant Templates!!",
          fbResponse: response.data,
        };
    } catch (err) {
      return Promise.reject(err);
    }
  }
  /**
   *  @description ->
   */
  public async signUp(
    req: TypedRequest<SignUp>,
    res: TypedResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      // Step 1: Get the merchant Waba Id
      const [merchantWabaId, debugTokenResponse] = await this.debugInputToken(req.body.inputToken);

      // res.locals.saveOperation("debugTokenCall", debugTokenResponse);

      // // Step 2: Get the merchant Waba Info
      // const merchantWabaInfo = await this.getMerchantWabaInfo(merchantWabaId);

      // // Step 3: Add System Users to merchant Waba
      // const sysUserAddedToMerchantWaba = await this.addSysUserToMerchantWaba(merchantWabaId);

      // // Step 4: Store Merchant Waba Document
      // const merchantWabaDocument = {
      //   isDeleted: false,
      //   merchantWabaId,
      //   merchantWabaInfo,
      //   debugTokenResponse,
      //   sysUserAddedToMerchantWaba,
      // };
      // const merchant = new MerchantModel();
      // await merchant.setWabaDocument(req.body.merchantId, merchantWabaId, merchantWabaDocument);

      // // Step 5: Get Merchant Phone Numbers
      // const merchantPhoneNumbers = await this.getMerchantPhoneNumbers(merchantWabaId);

      // // Step 6: Store Merchant Phone Numbers
      // await Promise.allSettled(
      //   merchantPhoneNumbers.map((e: any) =>
      //     merchant.setPhoneNumberDocument(req.body.merchantId, merchantWabaId, e.id, e)
      //   )
      // );

      // // Step 7: Get Merchant Templates
      // const merchantTemplates = await this.getMerchantTemplates(merchantWabaId);

      // // Step 8: Store Merchant Templates
      // await Promise.allSettled(
      //   merchantTemplates.map((e: any) =>
      //     merchant.setTemplateDocument(req.body.merchantId, merchantWabaId, e.id, e)
      //   )
      // );

      next();
    } catch (err) {
      next(new HttpError(err));
    }
  }
}
