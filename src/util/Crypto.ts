import crypto from "crypto";

/**
 * @description -> This Utility class provides functions for
 *               encrypting and decrypting using inbuilt crypto module
 */
class Crypto {
  static #Key = process.env.ENCRYPTION_KEY as string;
  static #IVlen = 16; // For AES, this is always 16

  /**
   * @description ->  Pass a string/stringified object, get back an encrypted string.
   */
  static encrypt(text: string, key: string = Crypto.#Key): string {
    {
      let iv = Buffer.from(crypto.randomBytes(Crypto.#IVlen))
        .toString("hex")
        .slice(0, Crypto.#IVlen);
      let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
      let encrypted = cipher.update(text);
      encrypted = Buffer.concat([encrypted, cipher.final()]);

      return iv + ":" + encrypted.toString("hex");
    }
  }

  /**
   * @description ->  Pass an encrypted string, get back the decrypted value.
   */
  static decrypt(text: string, key: string = Crypto.#Key): string {
    let textParts: string[] = text.includes(":") ? text.split(":") : [];
    let iv = Buffer.from(textParts.shift() || "", "binary");
    let encryptedText = Buffer.from(textParts.join(":"), "hex");
    let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }

  /**
   *  @description ->  Generates a random UUID
   */
  static uuid() {
    return crypto.randomUUID();
  }
}

export const encrypt = Crypto.encrypt;
export const decrypt = Crypto.decrypt;
export const uuid = Crypto.uuid;
