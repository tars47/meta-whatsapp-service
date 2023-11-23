import { JSONSchemaType } from "ajv";
import { LANGUAGE_CODES } from "./Common";
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
} from "../controllers/types/PhoneNumber";

/**
 *  @description -> JSON Schema for validating phoneNumbers/list request query data
 */
export const list: JSONSchemaType<List> = {
  type: "object",
  properties: {
    wabaId: { type: "string", minLength: 10 },
    token: { type: "string", minLength: 10 },
  },
  required: ["wabaId", "token"],
  additionalProperties: false,
};

/**
 *  @description -> JSON Schema for validating phoneNumbers/view request query data
 */
export const view: JSONSchemaType<View> = {
  type: "object",
  properties: {
    phoneNumberId: { type: "string", minLength: 10 },
    token: { type: "string", minLength: 10 },
  },
  required: ["phoneNumberId", "token"],
  additionalProperties: false,
};

/**
 *  @description -> JSON Schema for validating phoneNumbers/requestCode request body data
 */
export const requestCode: JSONSchemaType<RequestCode> = {
  type: "object",
  properties: {
    phoneNumberId: { type: "string", minLength: 10 },
    token: { type: "string", minLength: 10 },
    code_method: { type: "string", enum: ["SMS", "VOICE"] },
    language: {
      type: "string",
      enum: LANGUAGE_CODES,
    },
  },
  required: ["phoneNumberId", "token", "code_method", "language"],
  additionalProperties: false,
};

/**
 *  @description -> JSON Schema for validating phoneNumbers/verifyCode request body data
 */
export const verifyCode: JSONSchemaType<VerifyCode> = {
  type: "object",
  properties: {
    phoneNumberId: { type: "string", minLength: 10 },
    token: { type: "string", minLength: 10 },
    code: { type: "string", minLength: 4 },
  },
  required: ["phoneNumberId", "token", "code"],
  additionalProperties: false,
};

/**
 *  @description -> JSON Schema for validating phoneNumbers/setTwoStepVerificationCode
 *                  request body data
 */
export const setTwoStepVerificationCode: JSONSchemaType<SetTwoStepVerificationCode> = {
  type: "object",
  properties: {
    phoneNumberId: { type: "string", minLength: 10 },
    token: { type: "string", minLength: 10 },
    pin: { type: "string", minLength: 6, maxLength: 6 },
  },
  required: ["phoneNumberId", "token", "pin"],
  additionalProperties: false,
};

/**
 *  @description -> JSON Schema for validating phoneNumbers/registerPhone request body data
 */
export const registerPhone: JSONSchemaType<RegisterPhone> = {
  type: "object",
  properties: {
    phoneNumberId: { type: "string", minLength: 10 },
    token: { type: "string", minLength: 10 },
    pin: { type: "string", minLength: 6, maxLength: 6 },
  },
  required: ["phoneNumberId", "token", "pin"],
  additionalProperties: false,
};

/**
 *  @description -> JSON Schema for validating phoneNumbers/deRegisterPhone request body data
 */
export const deRegisterPhone: JSONSchemaType<DeRegisterPhone> = {
  type: "object",
  properties: {
    phoneNumberId: { type: "string", minLength: 10 },
    token: { type: "string", minLength: 10 },
  },
  required: ["phoneNumberId", "token"],
  additionalProperties: false,
};

/**
 *  @description -> JSON Schema for validating phoneNumbers/getBusinessProfile request query data
 */
export const getBusinessProfile: JSONSchemaType<GetBusinessProfile> = {
  type: "object",
  properties: {
    phoneNumberId: { type: "string", minLength: 10 },
    token: { type: "string", minLength: 10 },
  },
  required: ["phoneNumberId", "token"],
  additionalProperties: false,
};

/**
 *  @description -> JSON Schema for validating phoneNumbers/updateBusinessProfile request body data
 */
export const updateBusinessProfile: JSONSchemaType<UpdateBusinessProfile> = {
  type: "object",
  properties: {
    phoneNumberId: { type: "string", minLength: 10 },
    token: { type: "string", minLength: 10 },
    messaging_product: { type: "string", enum: ["whatsapp"] },
    about: { type: "string", minLength: 1, maxLength: 138, nullable: true },
    address: { type: "string", minLength: 1, maxLength: 255, nullable: true },
    description: { type: "string", minLength: 1, maxLength: 511, nullable: true },
    email: {
      type: "string",
      minLength: 1,
      maxLength: 127,
      nullable: true,
    },
    vertical: {
      type: "string",
      nullable: true,
      enum: [
        "UNDEFINED",
        "OTHER",
        "AUTO",
        "BEAUTY",
        "APPAREL",
        "EDU",
        "ENTERTAIN",
        "EVENT_PLAN",
        "FINANCE",
        "GROCERY",
        "GOVT",
        "HOTEL",
        "HEALTH",
        "NONPROFIT",
        "PROF_SERVICES",
        "RETAIL",
        "TRAVEL",
        "RESTAURANT",
        "NOT_A_BIZ",
      ],
    },
    websites: {
      type: "array",
      nullable: true,
      minItems: 1,
      maxItems: 2,
      uniqueItems: true,
      items: { type: "string" },
    },
  },
  required: ["messaging_product", "phoneNumberId", "token"],
  anyOf: [
    { required: ["about"] },
    { required: ["address"] },
    { required: ["description"] },
    { required: ["email"] },
    { required: ["vertical"] },
    { required: ["website"] },
  ],
  additionalProperties: false,
};
