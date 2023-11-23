import "dotenv/config";
import helmet from "helmet";
import multer from "multer";
import compress from "compression";
import Service from "./util/Service";
import routes, { type Routes } from "./routes";
import { Response as ResHandler } from "./middleware/Response";
import express, { type Application, type NextFunction, type Request, type Response } from "express";

process.nextTick(() => Server.start());

/**
 * @description ->  defines the public contract for the server class.
 */
interface IServer {
  app: Application;
  readonly getAllRoutes: () => Server;
}

/**
 * @description ->  This class is used to setup and initiate the express server
 */
class Server implements IServer {
  /**
   * @description -> Creates an instance of Server.
   */
  constructor(public app: Application = express()) {
    this.registerEvents();
    this.mountMiddleware();
    this.mountRoutes();
    this.mountResHandler();
    this.listen();
  }

  /**
   * @description ->  Instance method to register callbacks for node process events.
   */
  private registerEvents() {
    process.on("unhandledRejection", Service.uhr);
    process.on("uncaughtException", Service.uce);
    process.on("SIGTERM", Service.sigterm);
    process.on("warning", Service.warning);
    process.on("SIGHUP", Service.sighup);
    process.on("exit", Service.exit);
  }

  /**
   * @description ->  Instance method to add the necessary middleware.
   */
  private mountMiddleware(): void {
    this.app.enable("trust proxy");
    this.app.use(helmet());
    this.app.use(compress());
    this.app.use(express.json(Service.limit));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(this.cors);
    this.app.use(this.multer);
  }

  /**
   * @description ->  Options route to handle pre-flight requests.
   */
  private cors(req: Request, res: Response, next: NextFunction): Response | void {
    if (
      req.headers?.origin?.includes("https://www.beejek.com") ||
      req.headers?.origin?.includes(process.env.URL_PIECE as string)
    ) {
      res.header("Access-Control-Allow-Origin", req.headers.origin);
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      res.header("Access-Control-Max-Age", "86400");
      res.header("Cache-Control", "public, max-age=86400");
      res.header("Vary", "origin");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With, x-api-key"
      );

      if (req.method === "OPTIONS") return res.send(200);
    }
    next();
  }

  /**
   * @description ->  middleware to initialize multer for file upload.
   */
  private multer(req: Request, res: Response, next: NextFunction): void {
    const multerMid = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    });

    multerMid.single("file")(req, res, next);
  }

  /**
   * @description ->  Instance method to cold start the container.
   */
  private ping(): void {
    this.app.get("/ping", (req: Request, res: Response, next: NextFunction) => {
      return res.send(`PONG : ${Service._name} service is awake...`);
    });
  }

  /**
   *  @description ->  Instance method to add routes to the server.
   */
  private mountRoutes(_routes: Routes[] = routes): void {
    this.ping();
    _routes.forEach((route): void => {
      this.app.use("", route.router);
    });
  }

  /**
   * @description ->  This middlewhere is responsible for sending the response for all routes
   */
  private mountResHandler(): void {
    this.app.use(ResHandler.error);
    this.app.use(ResHandler.send);
  }

  /**
   * @description ->  Instance method to start listening for network events.
   */
  private listen(): void {
    this.app.listen(Service.port, Service.listen);
  }

  /**
   * @description -> Instance method to get all registered express routes.
   */
  public getAllRoutes(): Server {
    let routes = new Set();
    function print(path: any, layer: any) {
      if (layer.route) {
        layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))));
      } else if (layer.name === "router" && layer.handle.stack) {
        layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))));
      } else if (layer.method) {
        routes.add(
          layer.method.toUpperCase() +
            " " +
            path.concat(split(layer.regexp)).filter(Boolean).join("/")
        );
      }
    }

    function split(thing: any) {
      if (typeof thing === "string") {
        return thing.split("/");
      } else if (thing.fast_slash) {
        return "";
      } else {
        var match = thing
          .toString()
          .replace("\\/?", "")
          .replace("(?=\\/|$)", "$")
          .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
        return match
          ? match[1].replace(/\\(.)/g, "$1").split("/")
          : "<complex:" + thing.toString() + ">";
      }
    }
    this.app._router.stack.forEach(print.bind(null, []));
    console.log(routes);
    return this;
  }

  /**
   * @description ->  Class method to initiate Server class
   */
  static start(log: boolean = false): Server {
    return log ? new Server().getAllRoutes() : new Server();
  }
}

/*

firebaseId / wabaId   /  phoneNumbers  /  phnum id  / messages /  messageId
(coll)      (doc)         (coll)          (doc)        (coll)       (doc)

                      /  templates    /  templateId 
                           (coll)          (doc)
*/
