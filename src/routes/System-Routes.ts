import Auth from "../middleware/Auth";
import type Routes from "./types/Routes";
import IsValid from "../middleware/Validation";
import { Context } from "../middleware/Context";
import SystemController from "../controllers/System-Controller";
import { Router, type NextFunction, type Request, type Response } from "express";

/**
 * @description ->  This class reisters all the nexessary middleware for /system base route
 */
export default class SystemRoutes extends SystemController implements Routes {
  public path = "/system";
  public router = Router();

  /**
   * @description -> Creates an instance of SystemRoutes.
   */
  public constructor() {
    super();
    this.mountRoutes();
  }

  /**
   * @description ->  this method registers all the sub routes of /system base route
   */
  private mountRoutes(): void {
    this.router.get(`/log`, this.context, this.log.bind(this));
    this.router.get(`/info`, this.context, this.authenticate, this.info.bind(this));
    this.router.get(`/time`, this.context, this.authenticate, this.time.bind(this));
    this.router.get(`/usage`, this.context, this.authenticate, this.usage.bind(this));
    this.router.get(`/process`, this.context, this.authenticate, this.process.bind(this));
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
   * @description -> middleware to authenticate req (uses apikey strategy)
   */
  private authenticate(req: Request, res: Response, next: NextFunction): void {
    const strategy = new Auth.ApiKeyStrategy();
    return strategy.verify(req, res, next);
  }
}
