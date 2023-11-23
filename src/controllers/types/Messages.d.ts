import { type Language } from "./Common";

export interface Common {
  phoneNumberId: string;
  token: string;
}

type MessageTypes = "text" | "reaction" | "image" | "location" | "contacts" | "interactive";

export interface Message<T extends MessageTypes> {
  messaging_product: "whatsapp";
  recipient_type: "individual";
  to: string;
  type: T;
}

export interface Text<T extends boolean> {
  text: {
    preview_url: T;
    body: string;
  };
}

export type TextReply<T extends boolean> = Text<T> & {
  context: {
    message_id: string;
  };
};

export type Reaction = {
  reaction: {
    message_id: string;
    emoji: string;
  };
};

export type Image = {
  image: {
    link: string;
  };
};

export type ImageReply = Image & {
  context: {
    message_id: string;
  };
};
