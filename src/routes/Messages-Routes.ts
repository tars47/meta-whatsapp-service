import Auth from "../middleware/Auth";
import type Routes from "./types/Routes";
import IsValid from "../middleware/Validation";
import { Context } from "../middleware/Context";
import { type TypedResponse } from "../controllers/types/TypedReqRes";
import MessagesController from "../controllers/Messages-Controller";
import { Router, type NextFunction, type Request, type Response } from "express";

/**
 *  @description ->  This class implements all the sub routes of /messages base route
 */
export default class MessagesRoutes extends MessagesController implements Routes {
  public path = "/messages";
  public router = Router();

  /**
   * @description -> Creates an instance of MessagesRoutes.
   */
  public constructor() {
    super();
    this.mountRoutes();
  }

  /**
   * @description ->  this method registers all the sub routes of /phoneNumbers base route
   */
  private mountRoutes(): void {
    this.router.post(`/text`, this.context, this.authenticate, this.validate, this.text.bind(this));
    this.router.post(
      `/textReply`,
      this.context,
      this.authenticate,
      this.validate,
      this.textReply.bind(this)
    );
    this.router.post(
      `/textWithUrl`,
      this.context,
      this.authenticate,
      this.validate,
      this.text.bind(this)
    );
    this.router.post(
      `/textReplyWithUrl`,
      this.context,
      this.authenticate,
      this.validate,
      this.textReply.bind(this)
    );
    this.router.post(
      `/reactionReply`,
      this.context,
      this.authenticate,
      this.validate,
      this.reactionReply.bind(this)
    );
    this.router.post(
      `/uploadFileToGCS`,
      this.context,
      this.authenticate,
      this.uploadFileToGCS.bind(this)
    );
    this.router.post(
      `/image`,
      this.context,
      this.authenticate,
      this.validate,
      this.image.bind(this)
    );
    this.router.post(
      `/imageReply`,
      this.context,
      this.authenticate,
      this.validate,
      this.imageReply.bind(this)
    );
  }

  /**
   * @description ->  middleware to keep track of req/res lifecycle
   */
  private context(req: Request, res: Response, next: NextFunction): void {
    res.locals = new Context(req);
    next();
  }

  /**
   * @description ->   middleware to validate req body/query
   */
  private validate(req: Request, res: Response, next: NextFunction): void {
    return IsValid(req, res, next);
  }

  /**
   * @description -> middleware to authenticate req (uses firebase auth strategy)
   */
  private authenticate(req: Request, res: TypedResponse, next: NextFunction): void {
    const strategy = new Auth.FirebaseAuthStrategy();
    return strategy.verify(req, res, next);
  }
}
