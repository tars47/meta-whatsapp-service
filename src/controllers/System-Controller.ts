import * as os from "os";
import { HttpError } from "../util/HttpError";
import { type NextFunction, type Request, type Response } from "express";
import BigQuery from "../util/BigQuery";

/**
 * @description ->  This class implements req handlers for /system sub routes
 */
export default class SystemController {
  /**
   * @description ->  this method implements handler for /info route
   */
  public info(_: Request, res: Response, next: NextFunction): void {
    try {
      const cpuInfo = os.cpus();
      const totalMem = os.totalmem();
      const upTime = Math.floor(os.uptime());
      const response = {
        cpus: cpuInfo.map(e => ({ model: e.model, speed: e.speed })),
        availableParallelism: cpuInfo.length,
        os: {
          platform: process.platform,
          version: os.release(),
          hostname: os.hostname(),
          totalMemoryMb: totalMem / 1024 / 1024,
          totalMemoryGb: totalMem / 1024 / 1024 / 1024,
          uptimeMins: upTime / 60,
          uptimeHrs: upTime / 60 / 60,
          uptimeDays: upTime / 60 / 60 / 24,
          loadavg: os.loadavg(),
        },
        network: os.networkInterfaces(),
        currentUser: os.userInfo(),
      };

      res.locals.data = response;

      next();
    } catch (err) {
      next(new HttpError(err));
    }
  }

  /**
   * @description ->  this method implements handler for /time route
   */
  public time(_: Request, res: Response, next: NextFunction): void {
    try {
      const utc = new Date();
      const local = new Date(utc.getTime() + -utc.getTimezoneOffset() * 60000);
      const response = {
        utc,
        local,
      };
      res.locals.data = response;
      next();
    } catch (err) {
      next(new HttpError(err));
    }
  }

  /**
   * @description ->  this method implements handler for /usage route
   */
  public usage(_: Request, res: Response, next: NextFunction): void {
    try {
      const totalMem = os.totalmem();
      const freemMem = os.freemem();

      const response = {
        processMemory: this.processMemoryUsage(),
        systemMemory: {
          units: "MB",
          free: freemMem * 1e-6,
          total: totalMem * 1e-6,
          percentFree: Math.round((freemMem / totalMem) * 100),
        },
      };
      res.locals.data = response;
      next();
    } catch (err) {
      next(new HttpError(err));
    }
  }

  /**
   * @description ->  this method implements handler for /process route
   */
  public process(_: Request, res: Response, next: NextFunction): void {
    try {
      const response = {
        memUsage: this.processMemoryUsage(),
        env: process.env,
        pid: process.pid,
        uptimeMins: Math.floor(process.uptime()) / 60,
        applicationVersion: process.version,
        nodeDependencyVersions: process.versions,
      };
      res.locals.data = response;
      next();
    } catch (err) {
      next(new HttpError(err));
    }
  }

  private processMemoryUsage() {
    const memProc = process.memoryUsage();
    return {
      units: "MB",
      rss: memProc?.rss * 1e-6,
      heapTotal: memProc?.heapTotal * 1e-6,
      heapUsed: memProc?.heapUsed * 1e-6,
      external: memProc?.external * 1e-6,
      arrayBuffers: memProc?.arrayBuffers * 1e-6,
    };
  }

  /**
   * @description ->  this method implements handler for /log route
   */
  public async log(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.query.traceId) return next(new HttpError("traceId is required", 400));
      const response = await BigQuery.getTraceLog(req.query.traceId as string);
      res.locals.data = response;
      next();
    } catch (err) {
      next(new HttpError(err));
    }
  }
}
