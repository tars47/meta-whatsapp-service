import { JSONSchemaType } from "ajv";
import {
  type Text,
  type Image,
  type Common,
  type Message,
  type Reaction,
  type TextReply,
  type ImageReply,
} from "../controllers/types/Messages";

/**
 *  @description -> JSON Schema for validating messages/text request body data
 */
export const text: JSONSchemaType<Common & Message<"text"> & Text<false>> = {
  type: "object",
  properties: {
    phoneNumberId: { type: "string", minLength: 10 },
    token: { type: "string", minLength: 10 },
    messaging_product: { type: "string", enum: ["whatsapp"] },
    recipient_type: { type: "string", enum: ["individual"] },
    to: { type: "string", minLength: 4, maxLength: 15 },
    type: { type: "string", enum: ["text"] },
    text: {
      type: "object",
      properties: {
        preview_url: { type: "boolean", enum: [false] },
        body: { type: "string", maxLength: 4096 },
      },
      required: ["body", "preview_url"],
      additionalProperties: false,
    },
  },
  required: ["phoneNumberId", "token", "messaging_product", "recipient_type", "to", "type", "text"],
  additionalProperties: false,
};

/**
 *  @description -> JSON Schema for validating messages/textWithUrl request body data
 */
export const textWithUrl: JSONSchemaType<Common & Message<"text"> & Text<true>> = {
  type: "object",
  properties: {
    phoneNumberId: { type: "string", minLength: 10 },
    token: { type: "string", minLength: 10 },
    messaging_product: { type: "string", enum: ["whatsapp"] },
    recipient_type: { type: "string", enum: ["individual"] },
    to: { type: "string", minLength: 4, maxLength: 15 },
    type: { type: "string", enum: ["text"] },
    text: {
      type: "object",
      properties: {
        preview_url: { type: "boolean", enum: [true] },
        body: { type: "string", maxLength: 4096 },
      },
      required: ["body", "preview_url"],
      additionalProperties: false,
    },
  },
  required: ["phoneNumberId", "token", "messaging_product", "recipient_type", "to", "type", "text"],
  additionalProperties: false,
};

/**
 *  @description -> JSON Schema for validating messages/textReply request body data
 */
export const textReply: JSONSchemaType<Common & Message<"text"> & TextReply<false>> = {
  type: "object",
  properties: {
    phoneNumberId: { type: "string", minLength: 10 },
    token: { type: "string", minLength: 10 },
    messaging_product: { type: "string", enum: ["whatsapp"] },
    recipient_type: { type: "string", enum: ["individual"] },
    to: { type: "string", minLength: 4, maxLength: 15 },
    type: { type: "string", enum: ["text"] },
    context: {
      type: "object",
      properties: {
        message_id: { type: "string", minLength: 5 },
      },
      required: ["message_id"],
      additionalProperties: false,
    },
    text: {
      type: "object",
      properties: {
        preview_url: { type: "boolean", enum: [false] },
        body: { type: "string", maxLength: 4096 },
      },
      required: ["body", "preview_url"],
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
    "context",
    "text",
  ],
  additionalProperties: false,
};

/**
 *  @description -> JSON Schema for validating messages/textReplyWithUrl request body data
 */
export const textReplyWithUrl: JSONSchemaType<Common & Message<"text"> & TextReply<true>> = {
  type: "object",
  properties: {
    phoneNumberId: { type: "string", minLength: 10 },
    token: { type: "string", minLength: 10 },
    messaging_product: { type: "string", enum: ["whatsapp"] },
    recipient_type: { type: "string", enum: ["individual"] },
    to: { type: "string", minLength: 4, maxLength: 15 },
    type: { type: "string", enum: ["text"] },
    context: {
      type: "object",
      properties: {
        message_id: { type: "string", minLength: 5 },
      },
      required: ["message_id"],
      additionalProperties: false,
    },
    text: {
      type: "object",
      properties: {
        preview_url: { type: "boolean", enum: [true] },
        body: { type: "string", maxLength: 4096 },
      },
      required: ["body", "preview_url"],
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
    "context",
    "text",
  ],
  additionalProperties: false,
};

/**
 *  @description -> JSON Schema for validating messages/textReplyWithUrl request body data
 */
export const reactionReply: JSONSchemaType<Common & Message<"reaction"> & Reaction> = {
  type: "object",
  properties: {
    phoneNumberId: { type: "string", minLength: 10 },
    token: { type: "string", minLength: 10 },
    messaging_product: { type: "string", enum: ["whatsapp"] },
    recipient_type: { type: "string", enum: ["individual"] },
    to: { type: "string", minLength: 4, maxLength: 15 },
    type: { type: "string", enum: ["reaction"] },
    reaction: {
      type: "object",
      properties: {
        message_id: { type: "string", minLength: 5 },
        emoji: { type: "string", minLength: 1, maxLength: 2, pattern: "^\\p{Emoji}$" },
      },
      required: ["message_id", "emoji"],
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
    "reaction",
  ],
  additionalProperties: false,
};

/**
 *  @description -> JSON Schema for validating messages/image request body data
 */
export const image: JSONSchemaType<Common & Message<"image"> & Image> = {
  type: "object",
  properties: {
    phoneNumberId: { type: "string", minLength: 10 },
    token: { type: "string", minLength: 10 },
    messaging_product: { type: "string", enum: ["whatsapp"] },
    recipient_type: { type: "string", enum: ["individual"] },
    to: { type: "string", minLength: 4, maxLength: 15 },
    type: { type: "string", enum: ["image"] },
    image: {
      type: "object",
      properties: {
        link: { type: "string", minLength: 13, maxLength: 1000 },
      },
      required: ["link"],
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
    "image",
  ],
  additionalProperties: false,
};

/**
 *  @description -> JSON Schema for validating messages/imageReply request body data
 */
export const imageReply: JSONSchemaType<Common & Message<"image"> & ImageReply> = {
  type: "object",
  properties: {
    phoneNumberId: { type: "string", minLength: 10 },
    token: { type: "string", minLength: 10 },
    messaging_product: { type: "string", enum: ["whatsapp"] },
    recipient_type: { type: "string", enum: ["individual"] },
    to: { type: "string", minLength: 4, maxLength: 15 },
    type: { type: "string", enum: ["image"] },
    context: {
      type: "object",
      properties: {
        message_id: { type: "string", minLength: 5 },
      },
      required: ["message_id"],
      additionalProperties: false,
    },
    image: {
      type: "object",
      properties: {
        link: { type: "string", minLength: 13, maxLength: 1000 },
      },
      required: ["link"],
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
    "context",
    "image",
  ],
  additionalProperties: false,
};
