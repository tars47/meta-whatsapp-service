import Firestore from "../util/Firestore";
import { Timestamp } from "@google-cloud/firestore";

export default class MerchantModel extends Firestore {
  constructor() {
    super();
  }

  async setWabaDocument(merchantId: string, wabaId: string, data: any) {
    try {
      data._createdAt = Timestamp.now();
      await this.doc(`${merchantId}/${wabaId}`).set(data);
      return true;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async setPhoneNumberDocument(
    merchantId: string,
    wabaId: string,
    phoneNumberId: string,
    data: any
  ) {
    try {
      data._createdAt = Timestamp.now();
      await this.doc(`${merchantId}/${wabaId}/phoneNumbers/${phoneNumberId}`).set(data);
      return true;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async setTemplateDocument(merchantId: string, wabaId: string, templateId: string, data: any) {
    try {
      data._createdAt = Timestamp.now();
      await this.doc(`${merchantId}/${wabaId}/templates/${templateId}`).set(data);
      return true;
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
