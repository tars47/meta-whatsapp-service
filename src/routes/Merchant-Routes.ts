import Auth from "../middleware/Auth";
import type Routes from "./types/Routes";
import IsValid from "../middleware/Validation";
import { Context } from "../middleware/Context";
import MerchantController from "../controllers/Merchant-Controller";
import { Router, type NextFunction, type Request, type Response } from "express";
import { TypedResponse } from "../controllers/types/TypedReqRes";

/**
 *  @description ->  This class implements all the sub routes of /merchant base route
 */
export default class MerchantRoutes extends MerchantController implements Routes {
  public path = "/merchant";
  public router = Router();

  /**
   * @description -> Creates an instance of MerchantRoutes.
   */
  public constructor() {
    super();
    this.mountRoutes();
  }

  /**
   * @description ->  this method registers all the sub routes of /merchant base route
   */
  private mountRoutes(): void {
    this.router.post(
      `/signUp`,
      this.context,
      this.authenticate,
      this.validate,
      this.signUp.bind(this)
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
