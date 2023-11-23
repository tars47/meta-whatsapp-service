import { JSONSchemaType } from "ajv";
import { LANGUAGE_CODES, CURRENCY_CODES } from "./Common";
import {
  type Common,
  type View,
  type ViewBy,
  type TemplateCategory,
  type DeleteTemplateById,
  type DeleteTemplateByName,
} from "../controllers/types/Templates";

const CATEGORY: TemplateCategory[] = ["AUTHENTICATION", "MARKETING", "UTILITY"];

/**
 *  @description -> JSON Schema for validating template/namespace request query data
 */
export const namespace: JSONSchemaType<Common> = {
  type: "object",
  properties: {
    wabaId: { type: "string", minLength: 10 },
    token: { type: "string", minLength: 10 },
  },
  required: ["wabaId", "token"],
  additionalProperties: false,
};

/**
 *  @description -> JSON Schema for validating template/list request query data
 */
export const list: JSONSchemaType<Common> = {
  type: "object",
  properties: {
    wabaId: { type: "string", minLength: 10 },
    token: { type: "string", minLength: 10 },
  },
  required: ["wabaId", "token"],
  additionalProperties: false,
};

/**
 *  @description -> JSON Schema for validating template/view request query data
 */
export const view: JSONSchemaType<View> = {
  type: "object",
  properties: {
    token: { type: "string", minLength: 10 },
    templateId: { type: "string", minLength: 10 },
  },
  required: ["templateId", "token"],
  additionalProperties: false,
};

/**
 *  @description -> JSON Schema for validating template/viewBy request query data
 */
export const viewBy: JSONSchemaType<ViewBy> = {
  type: "object",
  properties: {
    wabaId: { type: "string", minLength: 10 },
    token: { type: "string", minLength: 10 },
    name: { type: "string", minLength: 1, nullable: true },
    language: { type: "string", enum: LANGUAGE_CODES, nullable: true },
    status: {
      type: "string",
      enum: [
        "APPROVED",
        "IN_APPEAL",
        "PENDING",
        "REJECTED",
        "PENDING_DELETION",
        "DELETED",
        "DISABLED",
        "PAUSED",
        "LIMIT_EXCEEDED",
      ],
      nullable: true,
    },
    category: { type: "string", enum: CATEGORY, nullable: true },
  },
  required: ["wabaId", "token"],
  anyOf: [
    { required: ["name"] },
    { required: ["language"] },
    { required: ["status"] },
    { required: ["category"] },
  ],
  additionalProperties: false,
};

/**
 *  @description -> JSON Schema for validating template/cteate request body
 */
export const createTemplate = {
  type: "object",
  properties: {
    wabaId: { type: "string", minLength: 10 },
    token: { type: "string", minLength: 10 },
    name: {
      type: "string",
      minLength: 1,
      maxLength: 512,
    },
    language: {
      type: "string",
      enum: LANGUAGE_CODES,
    },
    category: {
      type: "string",
      enum: CATEGORY,
    },
    allow_category_change: { type: "boolean" },
    components: {
      type: "array",
      uniqueItems: true,
      minItems: 1,
      maxItems: 4,
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["HEADER", "BODY", "FOOTER", "BUTTONS"],
          },
          format: {
            type: "string",
            enum: ["TEXT", "IMAGE", "VIDEO", "LOCATION", "DOCUMENT"],
          },
          text: {
            type: "string",
            maxLength: 1024,
            minLength: 1,
          },
          example: {
            type: "object",
            properties: {
              header_text: {
                type: "array",
                items: {
                  type: "string",
                  minLength: 1,
                },
              },
              body_text: {
                type: "array",
                items: [
                  {
                    type: "array",
                    items: {
                      type: "string",
                      minLength: 1,
                    },
                  },
                ],
              },
              header_handle: {
                type: "array",
                items: [
                  {
                    type: "string",
                    minLength: 1,
                  },
                ],
              },
            },
            additionalProperties: false,
          },
          buttons: {
            type: "array",
            uniqueItems: true,
            minItems: 1,
            maxItems: 3,
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["QUICK_REPLY", "PHONE_NUMBER", "URL"],
                },
                text: {
                  type: "string",
                  minLength: 1,
                  maxLength: 25,
                },
                phone_number: {
                  type: "string",
                  minLength: 4,
                  maxLength: 20,
                },
                url: {
                  type: "string",
                  minLength: 11,
                  maxLength: 2000,
                },
                example: {
                  type: "array",
                  items: [
                    {
                      type: "string",
                      minLength: 1,
                      maxLength: 1900,
                    },
                  ],
                },
              },
              required: ["type", "text"],
              additionalProperties: false,
            },
          },
        },
        required: ["type"],
        additionalProperties: false,
      },
    },
  },
  required: ["wabaId", "token", "name", "language", "category", "components"],
  additionalProperties: false,
};

/**
 *  @description -> JSON Schema for validating template/deleteTemplateById request query
 */
export const deleteTemplateById: JSONSchemaType<DeleteTemplateById> = {
  type: "object",
  properties: {
    wabaId: { type: "string", minLength: 10 },
    token: { type: "string", minLength: 10 },
    templateId: { type: "string", minLength: 10 },
    templateName: { type: "string", minLength: 1 },
  },
  required: ["wabaId", "token", "templateId", "templateName"],
  additionalProperties: false,
};

/**
 *  @description -> JSON Schema for validating template/deleteTemplateByName request query
 */
export const deleteTemplateByName: JSONSchemaType<DeleteTemplateByName> = {
  type: "object",
  properties: {
    wabaId: { type: "string", minLength: 10 },
    token: { type: "string", minLength: 10 },
    templateName: { type: "string", minLength: 1 },
  },
  required: ["wabaId", "token", "templateName"],
  additionalProperties: false,
};

/**
 *  @description -> JSON Schema for validating template/message request body
 */
export const messageTemplate = {
  type: "object",
  properties: {
    phoneNumberId: { type: "string", minLength: 10 },
    token: { type: "string", minLength: 10 },
    messaging_product: { type: "string", enum: ["whatsapp"] },
    recipient_type: { type: "string", enum: ["individual"] },
    to: { type: "string", minLength: 4, maxLength: 15 },
    type: { type: "string", enum: ["template"] },
    template: {
      type: "object",
      properties: {
        name: {
          type: "string",
          minLength: 1,
          maxLength: 512,
        },
        language: {
          type: "object",
          properties: {
            code: { type: "string", enum: LANGUAGE_CODES },
          },
          required: ["code"],
          additionalProperties: false,
        },

        components: {
          type: "array",
          uniqueItems: true,
          minItems: 1,
          maxItems: 4,
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["HEADER", "BODY", "BUTTONS"],
              },
              parameters: {
                type: "array",
                items: {
                  minItems: 1,
                  type: "object",
                  properties: {
                    type: {
                      type: "string",
                      enum: ["currency", "date_time", "document", "image", "text", "video"],
                    },
                    text: { type: "string", minLength: 1, maxLength: 32768 },
                    image: {
                      type: "object",
                      properties: {
                        link: { type: "string", minLength: 1, maxLength: 2000 },
                        id: { type: "string", minLength: 1, maxLength: 2000 },
                      },

                      additionalProperties: false,
                    },
                    video: {
                      type: "object",
                      properties: {
                        link: { type: "string", minLength: 1, maxLength: 2000 },
                        id: { type: "string", minLength: 1, maxLength: 2000 },
                      },
                      additionalProperties: false,
                    },
                    document: {
                      type: "object",
                      properties: {
                        link: { type: "string", minLength: 1, maxLength: 2000 },
                        id: { type: "string", minLength: 1, maxLength: 2000 },
                        filename: { type: "string", minLength: 1, maxLength: 2000 },
                      },
                      additionalProperties: false,
                    },
                    date_time: {
                      type: "object",
                      properties: {
                        fallback_value: { type: "string", minLength: 1, maxLength: 500 },
                      },
                      required: ["fallback_value"],
                      additionalProperties: false,
                    },
                    currency: {
                      type: "object",
                      properties: {
                        fallback_value: { type: "string", minLength: 1, maxLength: 500 },
                        code: { type: "string", enum: CURRENCY_CODES },
                        amount_1000: { type: "number", minimum: 1 },
                      },
                      required: ["fallback_value", "code", "amount_1000"],
                      additionalProperties: false,
                    },
                  },
                  required: ["type"],
                  additionalProperties: false,
                },
              },
            },
            required: ["type", "parameters"],
            additionalProperties: false,
          },
        },
      },
      required: ["name", "language", "components"],
      additionalProperties: false,
    },
  },
  required: [
    "phoneNumberId",
    "token",
    "messaging_product",
    "recipient_type",
    "to",
    "type",
    "template",
  ],
  additionalProperties: false,
};
