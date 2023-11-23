/**
 *  @description -> Base class for all the WhatsApp API subclasses
 */
export default class WhatsApp {
  protected readonly protocol = "https";
  protected readonly subDomain = "graph";
  protected readonly domain = "facebook";
  protected readonly topLevelDomain = "com";
  protected readonly version = "v16.0";
  protected readonly sysUserAccessToken = process.env.WHATSAPP_SYS_USER_ACCESS_TOKEN as string;
  protected url = `${this.protocol}://${this.subDomain}.${this.domain}.${this.topLevelDomain}/${this.version}`;

  /**
   *  @description -> Sets the authorization header for all the requests
   */
  protected headers(token: string) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  }

  /**
   *  @description -> Removes null values from the object
   */
  protected filterNulls<T extends object>(obj: T): T {
    for (let key of Object.keys(obj)) {
      if (obj[key as keyof T] === null) {
        delete obj[key as keyof T];
      }
    }
    return obj;
  }
}
