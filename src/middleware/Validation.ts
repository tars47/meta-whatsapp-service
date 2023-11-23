import Ajv from "ajv";
import {
  list,
  view,
  verifyCode,
  requestCode,
  registerPhone,
  deRegisterPhone,
  getBusinessProfile,
  updateBusinessProfile,
  setTwoStepVerificationCode,
} from "../schemas/PhoneNumbers-Schema";
import {
  text,
  image,
  textReply,
  imageReply,
  textWithUrl,
  reactionReply,
  textReplyWithUrl,
} from "../schemas/Messages-Schema";
import {
  viewBy,
  namespace,
  createTemplate,
  messageTemplate,
  deleteTemplateById,
  deleteTemplateByName,
  list as templateList,
  view as templateView,
} from "../schemas/Templates-Schemas";
import { signUp } from "../schemas/Merchant-Schema";
import { Request, Response, NextFunction } from "express";
import { HttpError } from "../util/HttpError";

/**
 *  @description -> This class is used to validate the request body against the schema.
 */
class Validation extends Ajv {
  /**
   *  @description -> Creates an instance of Validation
   */
  constructor() {
    super({
      allErrors: true,
    });
  }

  /**
   *  @description -> This function is used to add phoneNumber schemas
   */
  private addPhoneNumberSchemas() {
    this.addSchema(list, "phoneNumbers/list");
    this.addSchema(view, "phoneNumbers/view");
    this.addSchema(verifyCode, "phoneNumbers/verifyCode");
    this.addSchema(requestCode, "phoneNumbers/requestCode");
    this.addSchema(registerPhone, "phoneNumbers/registerPhone");
    this.addSchema(deRegisterPhone, "phoneNumbers/deRegisterPhone");
    this.addSchema(getBusinessProfile, "phoneNumbers/getBusinessProfile");
    this.addSchema(updateBusinessProfile, "phoneNumbers/updateBusinessProfile");
    this.addSchema(setTwoStepVerificationCode, "phoneNumbers/setTwoStepVerificationCode");
    return this;
  }

  /**
   *  @description -> This function is used to add messages schemas
   */
  private addMessagesSchemas() {
    this.addSchema(text, "messages/text");
    this.addSchema(image, "messages/image");
    this.addSchema(textReply, "messages/textReply");
    this.addSchema(imageReply, "messages/imageReply");
    this.addSchema(textWithUrl, "messages/textWithUrl");
    this.addSchema(reactionReply, "messages/reactionReply");
    this.addSchema(textReplyWithUrl, "messages/textReplyWithUrl");
    return this;
  }

  /**
   *  @description -> This function is used to add templates schemas
   */
  private addTemplateSchemas() {
    this.addSchema(viewBy, "templates/viewBy");
    this.addSchema(templateList, "templates/list");
    this.addSchema(templateView, "templates/view");
    this.addSchema(namespace, "templates/namespace");
    this.addSchema(createTemplate, "templates/create");
    this.addSchema(messageTemplate, "templates/message");
    this.addSchema(deleteTemplateById, "templates/deleteById");
    this.addSchema(deleteTemplateByName, "templates/deleteByName");
    return this;
  }

  /**
   *  @description -> This function is used to add merchant schemas
   */
  private addMerchantSchemas() {
    this.addSchema(signUp, "merchant/signUp");

    return this;
  }

  /**
   *  @description -> Utility method that calls all route methods
   */
  private addAllSchemas() {
    this.addPhoneNumberSchemas();
    this.addMessagesSchemas();
    this.addTemplateSchemas();
    this.addMerchantSchemas();
    return this;
  }

  /**
   *  @description -> Middleware function that validates the request body against the schema.
   */
  public Validate(req: Request, res: Response, next: NextFunction): void {
    const subRoute = res.locals.path;
    const httpMethod = res.locals.method;
    const route = res.locals.mountPath.split("/")[1];
    const validate = this.getSchema(`${route}${subRoute}`);
    let data;
    switch (httpMethod) {
      case "GET":
      case "DELETE": {
        data = req.query;
        break;
      }
      case "PUT":
      case "POST":
      case "PATCH": {
        data = req.body;
        break;
      }
    }
    if (validate?.(data)) {
      next();
    } else {
      next(new HttpError(validate?.errors, 400));
    }
  }

  /**
   *  @description -> Static method that initializes the Validation class and returns the Validate function.
   */
  static init() {
    const _ = new Validation().addAllSchemas();
    return _.Validate.bind(_);
  }
}

export default Validation.init();
