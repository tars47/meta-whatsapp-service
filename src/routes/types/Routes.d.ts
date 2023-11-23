import { Router } from "express";

/**
 * @description ->  Describes the public contract of all the Route classes
 */
export default interface Routes {
  path: string;
  router: Router;
}
