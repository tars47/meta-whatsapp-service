import { Language, type Language as TemplateLanguage } from "./Common";

export interface Common {
  wabaId: string;
  token: string;
}

export type View = Omit<Common, "wabaId"> & {
  templateId: string;
};

type TemplateStatus =
  | "APPROVED"
  | "IN_APPEAL"
  | "PENDING"
  | "REJECTED"
  | "PENDING_DELETION"
  | "DELETED"
  | "DISABLED"
  | "PAUSED"
  | "LIMIT_EXCEEDED";

export type TemplateCategory = "AUTHENTICATION" | "MARKETING" | "UTILITY";

export type ViewBy = Common & {
  name?: string;
  language?: TemplateLanguage;
  status?: TemplateStatus;
  category?: TemplateCategory;
};

interface Example {
  header_text?: string[];
  body_text?: string[][];
  header_handle?: string[];
}

interface Button {
  type: "QUICK_REPLY" | "PHONE_NUMBER" | "URL";
  text: string;
  phone_number?: string;
  url?: string;
  example?: string[];
}

type ComponentType = "HEADER" | "BODY" | "FOOTER" | "BUTTONS";

interface Component {
  type: ComponentType;
  format?: "TEXT" | "IMAGE" | "VIDEO" | "LOCATION" | "DOCUMENT";
  text?: string;
  example?: Example;
  buttons?: Button[];
}

export interface Template {
  name: string;
  language: Language;
  category: TemplateCategory;
  allow_category_change?: boolean;
  components: Component[];
}

export type DeleteTemplateByName = Common & {
  templateName: string;
};

export type DeleteTemplateById = DeleteTemplateByName & {
  templateId: string;
};

export interface MessageTemplate {
  phoneNumberId: string;
  token: string;
  messaging_product: "whatsapp";
  recipient_type: "individual";
  to: string;
  type: "template";
  template: {
    name: string;
    language: {
      code: Language;
    };
    components: {
      type: Exclude<ComponentType, "FOOTER">;
      parameters: {
        type: "currency" | "date_time" | "document" | "image" | "text" | "video";
        text?: string;
        image?: {
          link?: string;
          id?: string;
        };
        video?: {
          link?: string;
          id?: string;
        };
        document?: {
          link?: string;
          id?: string;
        };
        date_time?: {
          fallback_value: string;
        };
        currency: {
          fallback_value: string;
          code: string;
          amount_1000: number;
        };
      }[];
    }[];
  };
}
