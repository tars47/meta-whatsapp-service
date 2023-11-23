import { Router } from "express";
import type Routes from "./types/Routes";
import SystemRoutes from "./System-Routes";
import MessagesRoutes from "./Messages-Routes";
import MerchantRoutes from "./Merchant-Routes";
import TemplatesRoutes from "./Templates-Routes";
import PhoneNumberRoutes from "./PhoneNumbers-Routes";

/**
 * @description ->  utility function to mount all the sub routes on to the base route
 */
function mount(routes: Routes): Routes {
  const router = Router();
  router.use(routes.path, routes.router);
  return {
    path: routes.path,
    router: router,
  };
}

export default [
  mount(new SystemRoutes()),
  mount(new PhoneNumberRoutes()),
  mount(new MessagesRoutes()),
  mount(new TemplatesRoutes()),
  mount(new MerchantRoutes()),
];
export { type Routes };
