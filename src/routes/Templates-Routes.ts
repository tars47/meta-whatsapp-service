import Auth from "../middleware/Auth";
import type Routes from "./types/Routes";
import IsValid from "../middleware/Validation";
import { Context } from "../middleware/Context";
import { type TypedResponse } from "../controllers/types/TypedReqRes";
import TemplatesController from "../controllers/Templates-Controller";
import { Router, type NextFunction, type Request, type Response } from "express";

/**
 *  @description -> This Class registers middleware for /templates route
 */
export default class TemplatesRoutes extends TemplatesController implements Routes {
  public path = "/templates";
  public router = Router();

  /**
   *  @description -> This constructor middleware /templates route
   */
  public constructor() {
    super();
    this.mountRoutes();
  }

  /**
   *  @description -> This method registers subroutes and middleware for /templates route
   */
  private mountRoutes(): void {
    this.router.get(`/list`, this.context, this.authenticate, this.validate, this.list.bind(this));
    this.router.get(`/view`, this.context, this.authenticate, this.validate, this.view.bind(this));
    this.router.get(
      `/viewBy`,
      this.context,
      this.authenticate,
      this.validate,
      this.viewBy.bind(this)
    );
    this.router.post(
      `/create`,
      this.context,
      this.authenticate,
      this.validate,
      this.create.bind(this)
    );
    this.router.post(
      `/message`,
      this.context,
      this.authenticate,
      this.validate,
      this.message.bind(this)
    );
    this.router.get(
      `/namespace`,
      this.context,
      this.authenticate,
      this.validate,
      this.namespace.bind(this)
    );
    this.router.delete(
      `/deleteById`,
      this.context,
      this.authenticate,
      this.validate,
      this.deleteById.bind(this)
    );
    this.router.delete(
      `/deleteByName`,
      this.context,
      this.authenticate,
      this.validate,
      this.deleteByName.bind(this)
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
