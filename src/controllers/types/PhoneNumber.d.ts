import { type Language } from "./Common";

export interface List {
  wabaId: string;
  token: string;
}

export interface View {
  phoneNumberId: string;
  token: string;
}

export type RequestCode = View & {
  code_method: "SMS" | "VOICE";
  language: Language;
};

export type VerifyCode = View & {
  code: string;
};

export type SetTwoStepVerificationCode = View & {
  pin: string;
};

export type RegisterPhone = SetTwoStepVerificationCode;

export type DeRegisterPhone = View;

export type GetBusinessProfile = View;

export type UpdateBusinessProfile = View & {
  messaging_product: "whatsapp";
  about?: string;
  address?: string;
  description?: string;
  vertical?: string;
  email?: string;
  websites?: string[];
};
