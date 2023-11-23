import Auth from "../middleware/Auth";
import type Routes from "./types/Routes";
import IsValid from "../middleware/Validation";
import { Context } from "../middleware/Context";
import { type TypedResponse } from "../controllers/types/TypedReqRes";
import PhoneNumberController from "../controllers/PhoneNumbers-Controller";
import { Router, type NextFunction, type Request, type Response } from "express";

/**
 * @description ->  This class implements all the sub routes of /phoneNumbers base route
 */
export default class PhoneNumberRoutes extends PhoneNumberController implements Routes {
  public path = "/phoneNumbers";
  public router = Router();

  /**
   * @description -> Creates an instance of PhoneNumberRoutes.
   */
  public constructor() {
    super();
    this.mountRoutes();
  }

  /**
   * @description ->  this method registers all the sub routes of /phoneNumbers base route
   */
  private mountRoutes(): void {
    this.router.get(`/list`, this.context, this.authenticate, this.validate, this.list.bind(this));
    this.router.get(`/view`, this.context, this.authenticate, this.validate, this.view.bind(this));
    this.router.post(
      `/verifyCode`,
      this.context,
      this.authenticate,
      this.validate,
      this.verifyCode.bind(this)
    );
    this.router.post(
      `/requestCode`,
      this.context,
      this.authenticate,
      this.validate,
      this.requestCode.bind(this)
    );
    this.router.post(
      `/registerPhone`,
      this.context,
      this.authenticate,
      this.validate,
      this.registerPhone.bind(this)
    );
    this.router.post(
      `/deRegisterPhone`,
      this.context,
      this.authenticate,
      this.validate,
      this.deRegisterPhone.bind(this)
    );
    this.router.get(
      `/getBusinessProfile`,
      this.context,
      this.authenticate,
      this.validate,
      this.getBusinessProfile.bind(this)
    );
    this.router.post(
      `/updateBusinessProfile`,
      this.context,
      this.authenticate,
      this.validate,
      this.updateBusinessProfile.bind(this)
    );
    this.router.post(
      `/setTwoStepVerificationCode`,
      this.context,
      this.authenticate,
      this.validate,
      this.setTwoStepVerificationCode.bind(this)
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
