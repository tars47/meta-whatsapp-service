import { JSONSchemaType } from "ajv";
import { SignUp } from "../controllers/types/Merchant";
/**
 *  @description -> JSON Schema for validating messages/text request body data
 */
export const signUp: JSONSchemaType<SignUp> = {
  type: "object",
  properties: {
    inputToken: { type: "string", minLength: 1 },
    merchantId: { type: "string", minLength: 1 },
  },
  required: ["inputToken", "merchantId"],
  additionalProperties: false,
};
